import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auth State
const useAuthStore = create((set) => ({
    isLoggenIn: false,
    userInfo: null,

    loadAuth: async () => {
        const stored = await AsyncStorage.getItem('auth-state');
        if (stored) {
            const parsed = JSON.parse(stored);
            set({ isLoggenIn: parsed.isLoggenIn, userInfo: parsed.userInfo });
        }
    },

    login: async (userInfo) => {
        const newState = { isLoggenIn: true, userInfo };
        await AsyncStorage.setItem('auth-state', JSON.stringify(newState));
        set(newState);
    },

    logout: async () => {
        await AsyncStorage.removeItem('auth-state');
        set({ isLoggenIn: false, userInfo: null });
    },
}));

export default useAuthStore;