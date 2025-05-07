import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
            getStorage: () => AsyncStorage,
            onRehydrateStorage: () => (state) => {
                if (state) {
                    console.log('[Zustand persists] Profile storage hydrated', state.profile);
                }
            },
        }
    )
);

export default useProfileStore;