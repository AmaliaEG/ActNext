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

            // Actions
            setAuth: (token, user) => set({ token, user }),
            logout: () => ({ token: null, user: null }),
        }),
        {
            name: 'auth-storage',
            getStorage: () => AsyncStorage,
        }
    )
);

export default useAuthStore;