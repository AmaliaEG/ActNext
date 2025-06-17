import React from 'react';
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ProfileDetailsScreen from '../../src/screens/burgermenu/ProfileDetailsScreen';
import useAuthStore from '../../src/store/useAuthStore';
import useProfileStore from '../../src/store/useProfileStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
}));

const mockUser = {
    name: 'Test User',
    email: 'test@example.com',
    sub: 'auth0|abc123'
};

jest.mock('react-native-auth0', () => ({
    useAuth0: () => ({
        user: mockUser,
        authorize: jest.fn(),
        clearSession: jest.fn()
    }),
    Auth0Provider: ({ children }) => children,
}));

jest.mock('../../src/Themes/ThemeContext', () => ({
    useTheme: () => ({
        theme: {
            colors: {
                background: '#E9E9E9',
                text: '#000000',
                inputBg: '#FFFFFF',
                inputText: '#000000',
                border: '#DDDDDD',
                placeholder: '#555555',
                primary: '#007AFF',
                buttonBorder: '#DDDDDD',
                buttonText: '#000000',
            },    
        },    
    }),    
}));  


describe('Auth0 login and profile editing flow', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useAuthStore.setState({
            isLoggedIn: true,
            token: 'mock-token',
            hydrated: true,
        });

        const mockUpdateProfile = jest.fn(async (updates) => {
            useProfileStore.setState((prev) => ({
                profile: { ...prev.profile, ...updates }
            }));
            await AsyncStorage.setItem('user-profile', JSON.stringify(updates));
            return true;
        });

        useProfileStore.setState({
            profile: {
                name: mockUser.name,
                gender: 'Male',
                birthDate: '2000-01-01',
                email: mockUser.email,
            },
            hydrated: true,
            updateProfile: mockUpdateProfile,
        });
    });

    it('allows editing and saving profile data after login', async () => {
        const { getByDisplayValue, getByPlaceholderText, getByText, queryByText } = render(<ProfileDetailsScreen />);

        await waitFor(() => {
            expect(useProfileStore.getState().hydrated).toBe(true);
        });
        expect(queryByText('Loading profile...')).toBeNull();

        expect(getByDisplayValue(mockUser.name)).toBeTruthy();

        const input = getByPlaceholderText('Enter your name');
        fireEvent.changeText(input, 'New Name');
        fireEvent.press(getByText('Save Changes'));

        await waitFor(() => {
            expect(useProfileStore.getState().profile.name).toBe('New Name');
        });

        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
            'user-profile',
            expect.stringContaining('New Name')
        );
    });
});