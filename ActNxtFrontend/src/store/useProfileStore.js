import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

console.log('[Storage Check] AsyncStorage:', !!AsyncStorage && typeof AsyncStorage.getItem === 'function');

const fallbackStorage = {
    getItem: async (key) => {
        console.warn('[Fallback Storage] getItem called:', key);
        return null;
    },
    setItem: async (key, value) => {
        console.warn('[Fallback Storage] setItem called:', key, value);
    },
    removeItem: async (key) => {
        console.warn('[Fallback Storage] removeItem called:', key);
    },
};

// User profile description
const useProfileStore = create(
    persist(
        (set) => ({
            // State
            profile: {
                name: '',
                birthDate: null,
                gender: '',
                email: '',
                code: '123456',
            },

            // Actions
            updateProfile: (newData) => {
                try {
                    set((state) => ({
                        profile: {...state.profile, ...newData }
                    }));
                    return true;
                } catch (error) {
                    console.error('Update failed:', error);
                    return false;
                }
            },

            resetProfile: () =>
                set({
                    profile: {
                        name: '',
                        birthDate: null,
                        gender: '',
                        email: '',
                        code: '123456'
                    }
                }),
        }),
        {
            name: 'user-profile',
            getStorage: () => {
                if (!AsyncStorage || typeof AsyncStorage.getItem !== 'function') {
                    console.warn('[Zustand persist] Using fallback storage');
                    return fallbackStorage;
                } else {
                    console.log('[Zustand persist] Using AsyncStorage');
                    return AsyncStorage;
                }
            },
            onRehydrateStorage: () => (state) => {
                if (state) {
                    console.log('[Zustand persists] Profile storage hydrated', state.profile);
                }
            },
        }
    )
);

// Test storage immediatly
AsyncStorage.getItem('user-profile')
    .then((data) => console.log('Current storage:', data))
    .catch((err) => console.error('Storage test failed:', err));

export default useProfileStore;