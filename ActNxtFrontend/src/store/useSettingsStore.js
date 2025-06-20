/**
 * @file useSettingsStore.js
 * @description
 * Manages application settings (theme, language, notifications) with persistence via AsyncStorage.
 * Ensures the UI only renders once settings have been loaded (hydrated).
 * 
 * State:
 * - `theme` (object): the current theme mode, e.g. `{ mode: 'light' }`.
 * - `language` (string): two-letter language code, e.g. `'en'`.
 * - `notificationsEnabled`(boolean): whether push notifications are enabled.
 * - `hydrated` (boolean): indicates if settings have been loaded from storage.
 * 
 * Actions:
 * - `loadSettings`: loads and applies persisted settings from AsyncStorage, then marks `hydrated`.
 * - `updateTheme(theme)`: updates the theme, persists new settings.
 * - `setLanguage(lang)`: updates the language, persists new settings.
 * - `toggleNotifications`: flips the notificationsEnabled flag, persist new settings.
 * 
 * @module useSettingsStore
 * @author s224837
 * @since 2025-05-05
 */

import { create } from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = 'app-settings';

// Settings (e.g., themes, languages)
const useSettingsStore = create((set, get) => ({
    theme: { mode: 'light' },
    language: 'en',
    notificationsEnabled: true,
    hydrated: false,

    /**
     * Loads persisted settings from AsyncStorage.
     * Falls bavk to defaults if none are stored.
     * Marks the store as hydrated when completed.
     * @async
     */
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

    /**
     * Updates the theme and persists the new settings.
     * @async
     * @param {{ mode: 'light' }} theme - New theme object.
     */
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

    /**
     * Sets a new language and persists the new settings.
     * @async
     * @param {string} lang - Two-letter language code.
     */
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

    /**
     * Toggles the notifications setting and persists the change.
     * @async
     */
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