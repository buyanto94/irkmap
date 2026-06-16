import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, UserRole } from '@/entities/tourism/model/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  
  const isAuthenticated = computed(() => !!user.value);
  const userRole = computed(() => user.value?.role);
  
  const login = (role: UserRole = 'USER', email = 'test@example.com') => {
    user.value = {
      id: 1,
      email,
      role,
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      profile: {
        first_name: 'Test',
        last_name: 'User',
      }
    };
  };

  const logout = () => {
    user.value = null;
  };

  const register = () => {
    login('USER', 'newuser@example.com');
  };

  // Mock function for demo purposes
  const switchRole = (role: UserRole) => {
    if (user.value) {
      user.value.role = role;
    } else {
      login(role);
    }
  };

  return {
    user,
    isAuthenticated,
    userRole,
    login,
    logout,
    register,
    switchRole
  };
});
