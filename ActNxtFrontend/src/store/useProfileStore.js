import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// User profile description
const useProfileStore = create(
    persist(
        (set) => ({
            // State
            profile: {},
            _hasHydrated: false,
            setHasHydrated: (value) => set({ _hasHydrated: value }),

            // Actions
            updateProfile: (newProfile) => set({ profile: newProfile }),
            resetProfile: () => set({ profile: {} }),
        }),
        {
            name: 'profile-storage',
            getStorage: () => AsyncStorage,
            onRehydrateStorage: () => (state) => {
                console.log('[Zustand] onRehydrateStorage called');
                return (state) => {
                    console.log('[Zustand] Final hydration step:', state)
                    state?.setHasHydrated?.(true);
                }
            }
        }
    )
);

export default useProfileStore;