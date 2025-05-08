import { create } from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = 'app-settings';

// Settings (e.g., themes, languages)
const useSettingsStore = create((set, get) => ({
    theme: { mode: 'light' },
    language: 'en',
    notificationsEnabled: true,

    loadSettings: async () => {
        const stored = await AsyncStorage.getItem(SETTINGS_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            set({ ...parsed })
        }
    },

    updateTheme: async (theme) => {
        const current = get();
        const updated = { ...current, theme };
        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
        set({ theme });
    },

    setLanguage: async (lang) => {
        const current = get();
        const updated = { ...current, language: lang };
        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
        set({ language: lang });
    },

    toggleNotifications: async () => {
        const current = get();
        const newValue = !current.notificationsEnabled;
        const updated = { ...current, notificationsEnabled: newValue };
        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
        set({ notificationsEnabled: newValue });
    },
}));

export default useSettingsStore;