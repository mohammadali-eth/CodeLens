import { onMounted, onUnmounted } from 'vue';
import { webSocketService } from '../../../services/websocket.service';
import { useUsersStore } from '../../../stores/users.store';
import { ManagedUser } from '../../../models';

export function useUsersWebSocket() {
  const usersStore = useUsersStore();

  const handleUserCreated = (data: unknown) => {
    if (data && typeof data === 'object') {
      usersStore.handleRealtimeUserCreated(data as ManagedUser);
    }
  };

  const handleUserUpdated = (data: unknown) => {
    if (data && typeof data === 'object') {
      usersStore.handleRealtimeUserUpdated(data as { id: string; changes: Partial<ManagedUser> });
    }
  };

  onMounted(() => {
    webSocketService.connect();
    webSocketService.on('user:created', handleUserCreated);
    webSocketService.on('user:updated', handleUserUpdated);
    webSocketService.on('user:status_changed', handleUserUpdated);
    webSocketService.on('user:deleted', handleUserUpdated);
  });

  onUnmounted(() => {
    webSocketService.off('user:created', handleUserCreated);
    webSocketService.off('user:updated', handleUserUpdated);
    webSocketService.off('user:status_changed', handleUserUpdated);
    webSocketService.off('user:deleted', handleUserUpdated);
  });
}
