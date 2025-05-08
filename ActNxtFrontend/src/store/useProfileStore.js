import { create } from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    loadProfile: async () => {
        try {
            const stored = await AsyncStorage.getItem('user-profile');
            if (stored) {
                set({ profile: JSON.parse(stored) });
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            set({ hydrated: true });
        }
    },

    updateProfile: async (updated) => {
        try {
            await AsyncStorage.setItem('user-profile', JSON.stringify(updated));
            set({ profile: updated });
            return true;
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    },
    
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