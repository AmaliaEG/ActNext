import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auth State
const useAuthStore = create((set) => ({
    isLoggedIn: false,
    userInfo: null,
    hydrated: false,

    loadAuth: async () => {
        try {
            const stored = await AsyncStorage.getItem('auth-state');
            if (stored) {
                const parsed = JSON.parse(stored);
                set({
                    isLoggedIn: parsed.isLoggedIn,
                    userInfo: parsed.userInfo 
                });
            }
        } catch (error) {
            console.error('Failed to load auth state:', error);
        } finally {
            set({ hydrated: true });
        }
    },

    login: async (userInfo) => {
        try {
            const newState = { isLoggedIn: true,userInfo };
            await AsyncStorage.setItem('auth-state', JSON.stringify(newState));
            set(newState);
        } catch (error) {
            console.error('Failed to log in:', error);
        }
    },

    logout: async () => {
        try {
            await AsyncStorage.removeItem('auth-state');
            set({ isLoggedIn: false, userInfo: null });
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    },
}));

export default useAuthStore;