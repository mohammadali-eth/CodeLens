import { onMounted, onUnmounted } from 'vue';
import { webSocketService } from '../../../services/websocket.service';
import { useSystemAdminStore } from '../../../stores/system-admin.store';

export function useSystemAdminRealtime(): void {
  const store = useSystemAdminStore();

  const handleFlagUpdated = (payload: any) => {
    if (payload?.id && typeof payload?.isEnabled === 'boolean') {
      const flag = store.featureFlags.find((f) => f.id === payload.id);
      if (flag) flag.isEnabled = payload.isEnabled;
    }
  };

  const handleProviderStatus = (payload: any) => {
    if (payload?.id && payload?.status) {
      const prov = store.aiProviders.find((p) => p.id === payload.id);
      if (prov) prov.status = payload.status;
    }
  };

  const handleMaintenanceChanged = (payload: any) => {
    if (store.maintenanceConfig && typeof payload?.isMaintenanceEnabled === 'boolean') {
      store.maintenanceConfig.isMaintenanceEnabled = payload.isMaintenanceEnabled;
    }
  };

  onMounted(() => {
    webSocketService.connect();
    webSocketService.subscribe('system:flag_updated', handleFlagUpdated);
    webSocketService.subscribe('system:provider_status', handleProviderStatus);
    webSocketService.subscribe('system:maintenance_changed', handleMaintenanceChanged);
  });

  onUnmounted(() => {
    webSocketService.unsubscribe('system:flag_updated', handleFlagUpdated);
    webSocketService.unsubscribe('system:provider_status', handleProviderStatus);
    webSocketService.unsubscribe('system:maintenance_changed', handleMaintenanceChanged);
  });
}
