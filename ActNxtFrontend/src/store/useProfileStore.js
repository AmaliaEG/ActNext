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

    loadProfile: async (user) => {
        try {
            const pathDB = '../store/mockUserDatabase.json';
            const mockUserDB = require(pathDB);
            const stored = await AsyncStorage.getItem('user-profile');
            const findUser = (user) =>{
                if(user){
                    const data = mockUserDB.find(item=> item.auth0ID === user.sub );
                    return data
                };
                return null;
            }
            const distributeData = async (data) => {
                if (data) {
                    await AsyncStorage.setItem('user-profile', JSON.stringify(data));
                    set({profile: data})
                }else{
                    if(user){
                    //alert("I was not in the local DB")
                    const newProfile = {
                        auth0ID: user.sub,
                        name: user.name,
                        email: user.email
                    }
                    const updatedDB = [...mockUserDB, newProfile];
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