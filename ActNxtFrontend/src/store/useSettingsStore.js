import { create } from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = 'app-settings';

// Settings (e.g., themes, languages)
const useSettingsStore = create((set, get) => ({
    theme: { mode: 'light' },
    language: 'en',
    notificationsEnabled: true,
    hydrated: false,

    loadSettings: async () => {
        try {
            const stored = await AsyncStorage.getItem(SETTINGS_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                set({ 
                    theme: parsed.theme || { mode: 'light' },
                    language: parsed.language || 'en',
                    notificationsEnabled: parsed.notificationsEnabled ?? true
                });
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        } finally {
            set({ hydrated: true });
        }
    },

    updateTheme: async (theme) => {
        try {
            const current = get();
            const updated = { ...current, theme };
            await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
            set({ theme });
        } catch (error) {
            console.error('Failed to update theme:', error);
        }
    },

    setLanguage: async (lang) => {
        try {
            const current = get();
            const updated = { ...current, language: lang };
            await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
            set({ language: lang });
        } catch (error) {
            console.error('Failed to update language:', error);
        }
    },

    toggleNotifications: async () => {
        try {
            const current = get();
            const newValue = !current.notificationsEnabled;
            const updated = { ...current, notificationsEnabled: newValue };
            await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
            set({ notificationsEnabled: newValue });
        } catch (error) {
            console.error('Failed to update notifications:', error);
        }
    },
}));

export default useSettingsStore;