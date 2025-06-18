/**
 * @file useProfileStore.js
 * @description
 * Manages the user's profile information with persistence via AsyncStorage.
 * Loads an existing profile from storage or a mock database, allows updates, and supports resetting.
 * Ensures the UI only renders once the profile has been loaded (hydrated).
 * 
 * State:
 * - `profile` (Object): user profile fields(`name`, `birthDate`, `gender`, `email`, `code`, and `auth0ID` when available).
 * - `hydrated` (boolean): indicates if the persisted profile has been loaded.
 * 
 * Actions:
 * - `loadProfile(user)`: loads profile from AsyncStorage or mock database based on Auth0 user,persists and sets it.
 * - `updateProfile(updated)`: persists and updates the profile in storage.
 * - `resetProfile`: clears the stored profile and resets state.
 * 
 * @module useProfileStore
 * @author s224837
 * @since 2025-05-05
 */

import { create } from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';
import mockUserDB from '../store/mockUserDatabase.json';

/**
 * Default empty profile structure.
 * @type {Object}
 */
const defaultProfile = {
    name: '',
    birthDate: '',
    gender: '',
    email: '',
    code: ''
};

// User profile description
const useProfileStore = create((set) => ({
    profile: { ...defaultProfile },
    hydrated: false,

    /**
     * Loads the user profile from AsyncStorage if present - otherwise it attempts to find in mockUserDataBase using Auth0 user.sub.
     * It then saves and sets the profile, and marks hydrated when done.
     * @async
     * @param {Object} user - Auth0 user object.
     * @author S235251
     */
    loadProfile: async (user) => {
        try {
            // const pathDB = '../store/mockUserDatabase.json';
            // const mockUserDB = require(pathDB);
            const stored = await AsyncStorage.getItem('user-profile');
            const findUser = (user) =>{
                if(user){
                    const data = mockUserDB.find(item=> item.auth0ID === user.sub );
                    return data || null;
                };
                return null;
            };

            const distributeData = async (data) => {
                if (data) {
                    await AsyncStorage.setItem('user-profile', JSON.stringify(data));
                    set({ profile: data })
                } else {
                    if(user) {
                    //alert("I was not in the local DB")
                    const newProfile = {
                        auth0ID: user.sub,
                        name: user.name,
                        email: user.email
                    }
                    //No real Database, from this point send new profile to database
                    await AsyncStorage.setItem('user-profile', JSON.stringify(newProfile));
                    set({ profile: newProfile });
                    }
                }
            }
            //Function logic
            if (stored) {
                set({ profile: JSON.parse(stored) });
            } else {
                const data = findUser(user);
                await distributeData(data)
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            set({ hydrated: true });
        }
    },

    /**
     * Persists an updates profile to AsyncStorage and updates state.
     * @async
     * @param {Object} updated - The updates profile object.
     * @returns {Promise<boolean>} True on success.
     */
    updateProfile: async (updated) => {
        try {
            //no real database, send updated to database
            await AsyncStorage.setItem('user-profile', JSON.stringify(updated));
            set({ profile: updated });
            return true;
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    },
    
    /**
     * Clears the stored profile in AsyncStorage and resets state to defaults.
     * @async
     */
    resetProfile: async () => {
        try {
            await AsyncStorage.removeItem('user-profile');
            set({ profile: {} });
        } catch (error) {
            console.error('Failed to reset profile:', error);
        }
    },
}));

export default useProfileStore;