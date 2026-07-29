<template>
  <template v-if="isAllowed">
    <slot />
  </template>
  <template v-else>
    <slot name="fallback" />
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePermissions } from '../../../features/auth/composables/usePermissions';
import { AdminPermission, UserRole } from '../../../models';

interface Props {
  permission?: AdminPermission | string;
  anyPermission?: (AdminPermission | string)[];
  allPermissions?: (AdminPermission | string)[];
  role?: UserRole | UserRole[];
}

const props = defineProps<Props>();
const { can, canAny, canAll, isRole } = usePermissions();

const isAllowed = computed(() => {
  if (props.permission && !can(props.permission)) {
    return false;
  }
  if (props.anyPermission && !canAny(props.anyPermission)) {
    return false;
  }
  if (props.allPermissions && !canAll(props.allPermissions)) {
    return false;
  }
  if (props.role && !isRole(props.role)) {
    return false;
  }
  return true;
});
</script>
