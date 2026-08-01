import { onMounted, onUnmounted } from 'vue';
import { useMonitoringStore } from '../../../stores/monitoring.store';
import { webSocketService } from '../../../services/websocket.service';
import { SystemMetrics, SystemAlert } from '../models/monitoring.model';

/**
 * Composable: useMonitoringRealtime
 * Purpose: Connects the monitoring dashboard to live WebSocket telemetry channels.
 * Responsibilities: Listens for metrics heartbeats, health badge changes, queue updates, and alert triggers.
 * Dependencies: webSocketService, useMonitoringStore.
 */
export function useMonitoringRealtime() {
  const store = useMonitoringStore();

  const handleMetricsTick = (data: unknown) => {
    if (data && typeof data === 'object') {
      store.updateLiveRealtimeMetrics(data as Partial<SystemMetrics>);
    }
  };

  const handleHealthUpdate = () => {
    store.refreshMetricsOnly();
  };

  const handleAlertTriggered = (data: unknown) => {
    if (data && typeof data === 'object') {
      store.alerts.unshift(data as SystemAlert);
    }
  };

  onMounted(() => {
    try {
      webSocketService.connect();
      webSocketService.subscribe('monitoring:metrics_tick', handleMetricsTick);
      webSocketService.subscribe('monitoring:health_updated', handleHealthUpdate);
      webSocketService.subscribe('monitoring:alert_triggered', handleAlertTriggered);
    } catch (error) {
      console.warn('[useMonitoringRealtime] Realtime WebSocket connection error:', error);
    }
  });

  onUnmounted(() => {
    try {
      webSocketService.unsubscribe('monitoring:metrics_tick', handleMetricsTick);
      webSocketService.unsubscribe('monitoring:health_updated', handleHealthUpdate);
      webSocketService.unsubscribe('monitoring:alert_triggered', handleAlertTriggered);
    } catch (error) {
      console.warn('[useMonitoringRealtime] Realtime cleanup error:', error);
    }
  });
}
