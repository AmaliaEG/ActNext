import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";

// Settings (e.g., themes, languages)
const useSettingsStore = create(
    persist(
        (set) => ({
            // State
            theme: 'light',
            language: 'en',
            notificationsEnabled: true,

            // Actions
            toggleTheme: () =>
                set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

            setLanguage: (language) => set({ language }),

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