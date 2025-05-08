import { create } from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';

// User profile description
const useProfileStore = create((set) => ({
    profile: {
        name: '',
        birthDate: '',
        gender: '',
        email: '',
        code: ''
    },

    loadProfile: async () => {
        const stored = await AsyncStorage.getItem('user-profile');
        if (stored) {
            set({ profile: JSON.parse(stored) });
        }
    },

    updateProfile: async (updated) => {
        await AsyncStorage.setItem('user-profile', JSON.stringify(updated));
        set({ profile: updated });
        return true;
    },
    
    resetProfile: async () => {
        await AsyncStorage.removeItem('user-profile');
        set({ profile: {} });
    },
}));

export default useProfileStore;