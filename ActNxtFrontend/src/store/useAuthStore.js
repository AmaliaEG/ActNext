import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auth State
const useAuthStore = create((set) => ({
    isLoggedIn: false,
    token: null,
    hydrated: false,

    loadAuth: async () => {
        try {
            const stored = await AsyncStorage.getItem('auth-state');
            if (stored) {
                const parsed = JSON.parse(stored);
                set({
                    isLoggedIn: parsed.isLoggedIn,
                    token: parsed.token 
                });
            }
        } catch (error) {
            console.error('Failed to load auth state:', error);
        } finally {
            set({ hydrated: true });
        }
    },

    login: async (accessToken) => {
        try {
            const newState = { isLoggedIn: true, token: accessToken };
            await AsyncStorage.setItem('auth-state', JSON.stringify(newState));
            set(newState);
        } catch (error) {
            console.error('Failed to log in:', error);
        }
    },

    logout: async () => {
        try {
            await AsyncStorage.removeItem('auth-state');
            set({ isLoggedIn: false, token: null });
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    },
}));

export default useAuthStore;