import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";

// Settings (e.g., themes, languages)
const useSettingsStore = create(
    persist(
        (set) => ({
            // Theme
            theme: { mode: 'light' },
            toggleTheme: () =>
                set((state) => ({
                    theme: {
                        mode: state.theme.mode === 'light' ? 'dark' : 'light'
                    }
                })),
                updateTheme: (newTheme) => set({ theme: newTheme || { mode: 'light' } }), // fallback
            
            // Language
            language: 'en',
            setLanguage: (language) => set({ language }),
            
            // Notifications
            notificationsEnabled: true,
            toggleNotifications: () =>
                set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
        }),
        {
            name: 'app-settings',
            getStorage: () => AsyncStorage,
        }
    )
);

export default useSettingsStore;