import { onMounted, onUnmounted, ref } from 'vue';
import { useDashboardStore } from '../../../stores/dashboard.store';
import { QueueStatus, SystemHealthOverview, ActivityTimelineItem } from '../../../models';

/**
 * useDashboardWebSocket
 * Purpose: Real-time event streaming composable connecting to backend WebSocket gateway.
 * Responsibilities: Listens for background worker queue progress, service health telemetry, and new review activity events to update Pinia store reactively.
 * Dependencies: Pinia useDashboardStore, Dashboard domain interfaces.
 */

export function useDashboardWebSocket() {
  const dashboardStore = useDashboardStore();
  const isConnected = ref(false);
  let socket: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  function connect() {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:4000/admin/ws';

    try {
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        isConnected.value = true;
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
          reconnectTimer = null;
        }
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          handleWebSocketEvent(payload);
        } catch (err) {
          // Ignore malformed WS frames
        }
      };

      socket.onclose = () => {
        isConnected.value = false;
        scheduleReconnect();
      };

      socket.onerror = () => {
        isConnected.value = false;
        socket?.close();
      };
    } catch (err) {
      isConnected.value = false;
      scheduleReconnect();
    }
  }

  function handleWebSocketEvent(payload: { event: string; data: any }) {
    switch (payload.event) {
      case 'queue:update':
        if (payload.data) {
          dashboardStore.updateQueueStatus(payload.data as Partial<QueueStatus>);
        }
        break;
      case 'health:update':
        if (payload.data) {
          dashboardStore.updateSystemHealth(payload.data as SystemHealthOverview);
        }
        break;
      case 'activity:new':
        if (payload.data) {
          dashboardStore.addRecentActivity(payload.data as ActivityTimelineItem);
        }
        break;
    }
  }

  function scheduleReconnect() {
    if (!reconnectTimer) {
      reconnectTimer = setTimeout(() => {
        connect();
      }, 5000);
    }
  }

  function disconnect() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if (socket) {
      socket.close();
      socket = null;
    }
    isConnected.value = false;
  }

  onMounted(() => {
    connect();
  });

  onUnmounted(() => {
    disconnect();
  });

  return {
    isConnected,
    connect,
    disconnect,
  };
}
