import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/*
token: stores the Auth0 access token for API calls.
user: holds the basic user info.
setAuth: gets called after successful login
logout: clears all auth related data
*/

// Auth State
const useAuthStore = create(
    persist(
        (set) => ({
            // State
            token: null,
            user: null,

            // Actions
            setAuth: (token, user) => set({ token, user }),
            logout: () => ({ token: null, user: null }),
        }),
        {
            name: 'auth-storage',
            getStorage: () => AsyncStorage,
        }
    )
);

export default useAuthStore;