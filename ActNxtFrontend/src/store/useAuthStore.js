import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auth State
const useAuthStore = create(
    persist(
        (set) => ({
            // State
            token: null,
            user: null,
            _hasHydrated: false,
            setHasHydrated: (value) => set({ _hasHydrated: value }),

            // Actions
            setAuth: (token, user) => set({ token, user }),
            logout: () => set({ token: null, user: null }),
        }),
        {
            name: 'auth-storage',
            getStorage: () => AsyncStorage,
            onRehydrateStorage: () => (state) => {
                console.log('[Zustand] onRehydrateStorage called');
                return (state) => {
                    console.log('[Zustand] Final hydration step:', state)
                    state?.setHasHydrated?.(true);
                }
            }
        }
    )
);

export default useAuthStore;