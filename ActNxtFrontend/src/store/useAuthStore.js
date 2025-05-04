import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
            userToken: null,
            pushToken: null,
            setUserToken: (token) => set({ userToken: token }),
            setPushToken: (token) => set({ pushToken: token }),
            clearTokens: () => set({ userToken: null, pushToken: null }),
        }),
        {
            name: 'auth-storage',
        }
    )
);