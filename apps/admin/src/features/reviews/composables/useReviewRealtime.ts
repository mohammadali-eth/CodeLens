import { ref, onMounted, onUnmounted } from 'vue';
import { webSocketService } from '../../../services/websocket.service';
import { useReviewsStore } from '../../../stores/reviews.store';
import { AdminReviewItem } from '../models/review.model';

/**
 * useReviewRealtime Composable
 * Purpose: Connects Vue Admin Portal Review Management to backend WebSocket real-time event pipeline.
 * Responsibilities: Handles event binding for live updates on review creation, completion, failure, rerun, and deletion.
 * Dependencies: webSocketService, useReviewsStore.
 */
export function useReviewRealtime() {
  const store = useReviewsStore();

  const isConnected = ref<boolean>(false);
  const lastEventTimestamp = ref<string | null>(null);
  const eventCount = ref<number>(0);

  const handleCreated = (data: any) => {
    eventCount.value++;
    lastEventTimestamp.value = new Date().toISOString();
    if (data && data.id) {
      store.handleRealtimeReviewCreated(data as AdminReviewItem);
    }
  };

  const handleCompleted = (data: any) => {
    eventCount.value++;
    lastEventTimestamp.value = new Date().toISOString();
    if (data && data.id) {
      store.handleRealtimeReviewCompleted(data);
    }
  };

  const handleFailed = (data: any) => {
    eventCount.value++;
    lastEventTimestamp.value = new Date().toISOString();
    if (data && data.id) {
      store.handleRealtimeReviewFailed(data);
    }
  };

  const handleRerun = (data: any) => {
    eventCount.value++;
    lastEventTimestamp.value = new Date().toISOString();
    if (data && data.id) {
      store.handleRealtimeReviewCompleted({ id: data.id, status: 'PROCESSING' });
    }
  };

  const handleDeleted = (data: any) => {
    eventCount.value++;
    lastEventTimestamp.value = new Date().toISOString();
    const id = typeof data === 'string' ? data : data?.id;
    if (id) {
      store.handleRealtimeReviewDeleted(id);
    }
  };

  function connectSocket() {
    try {
      webSocketService.connect();
      isConnected.value = true;

      webSocketService.on('review:created', handleCreated);
      webSocketService.on('review:completed', handleCompleted);
      webSocketService.on('review:failed', handleFailed);
      webSocketService.on('review:rerun', handleRerun);
      webSocketService.on('review:deleted', handleDeleted);
    } catch {
      isConnected.value = false;
    }
  }

  function disconnectSocket() {
    webSocketService.off('review:created', handleCreated);
    webSocketService.off('review:completed', handleCompleted);
    webSocketService.off('review:failed', handleFailed);
    webSocketService.off('review:rerun', handleRerun);
    webSocketService.off('review:deleted', handleDeleted);
    isConnected.value = false;
  }

  onMounted(() => {
    connectSocket();
  });

  onUnmounted(() => {
    disconnectSocket();
  });

  return {
    isConnected,
    lastEventTimestamp,
    eventCount,
    connectSocket,
    disconnectSocket,
  };
}
