/**
 * @file useAuthStore.js
 * @description
 * Tracks the authentication state and user token, persists it in AsyncStorage, and provides actions to load, login, and logout.
 * Hydration ensures the UI only renders when persisted state has been retrieved.
 * 
 * State:
 * - `isLoggedIn` (boolean): whether the user is currently authenticated.
 * - `userInfo` (string|null): the stored auth token.
 * - `hydrated` (boolean): indicates if the persisted state has been loaded from storage.
 * 
 * Actions:
 * - `loadAuth`: loads and persists the saved auth-state from AsyncStorage, then sets `hydrated` to true.
 * - `login(accessToken)`: saves the new auth-state and updates the store.
 * - `logout`: clears the stored auth-state and resets the store to initial values.
 * 
 * @module useAuthStore
 * @author s224837
 * @since 2025-04-05
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auth State
const useAuthStore = create((set) => ({
    isLoggedIn: false,
    token: null,
    hydrated: false,

    /**
     * Loads persisted authentication state from AsyncStorage.
     * Parses stored JSON and update `isLoggedIn` and `token`.
     * Always sets `hydrated` to true once done.
     * @async
     */
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

    /**
     * Logs in the user by saving accessToken and setting state.
     * Persists new state to AsyncStorage.
     * @async
     * @param {string} accessToken - The auth token received upon login.
     * @author s235251
     */
    login: async (accessToken) => {
        try {
            const newState = { isLoggedIn: true, token: accessToken };
            await AsyncStorage.setItem('auth-state', JSON.stringify(newState));
            set(newState);
        } catch (error) {
            console.error('Failed to log in:', error);
        }
    },

    /**
     * Logs out the user by clearing persisted state and resetting store.
     * @async
     */
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