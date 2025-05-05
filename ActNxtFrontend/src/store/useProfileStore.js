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
            updateProfile: (newData) =>
                set((state) => ({ profile: {...state.profile, ...newData } })),

            resetProfile: () =>
                set({ profile: { name: '', birthDate: null, gender: '', email: '', code: '123456' } }),
        }),
        {
            name: 'user-profile',
            getStorage: () => AsyncStorage,
        }
    )
);

export default useProfileStore;