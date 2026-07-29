import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../auth.store';
import { UserRole } from '../../models';

// Mock AuthService and UserService
vi.mock('../../core/services/auth.service', () => ({
  authService: {
    getTokens: () => null,
    setTokens: vi.fn(),
    clearTokens: vi.fn(),
  },
}));

vi.mock('../../services/admin-auth.service', () => ({
  adminAuthService: {
    login: vi.fn().mockResolvedValue({ accessToken: 'fake_jwt', refreshToken: 'fake_refresh', expiresIn: 3600 }),
    logout: vi.fn().mockResolvedValue(undefined),
    getRememberMePreference: () => true,
  },
}));

vi.mock('../../services/user.service', () => ({
  userService: {
    getProfile: vi.fn().mockResolvedValue({
      id: 'admin_123',
      email: 'admin@codelens.ai',
      firstName: 'Admin',
      lastName: 'User',
      role: 'SUPER_ADMIN',
      permissions: ['*'],
      accountStatus: 'ACTIVE',
      isActive: true,
      createdAt: new Date().toISOString(),
    }),
  },
}));

describe('AuthStore Unit Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with default unauthenticated state', () => {
    const store = useAuthStore();
    expect(store.isAuthenticated).toBe(false);
    expect(store.currentUser).toBeNull();
    expect(store.userPermissions).toEqual([]);
  });

  it('should update state upon successful login', async () => {
    const store = useAuthStore();
    await store.login({ email: 'admin@codelens.ai', password: 'Password123!', rememberMe: true });

    expect(store.isAuthenticated).toBe(true);
    expect(store.currentUser?.email).toBe('admin@codelens.ai');
    expect(store.userRole).toBe(UserRole.SUPER_ADMIN);
    expect(store.hasPermission('users.delete')).toBe(true);
  });

  it('should purge tokens and user state upon logout', async () => {
    const store = useAuthStore();
    await store.login({ email: 'admin@codelens.ai', password: 'Password123!' });
    await store.logout();

    expect(store.isAuthenticated).toBe(false);
    expect(store.currentUser).toBeNull();
    expect(store.userPermissions).toEqual([]);
  });
});
