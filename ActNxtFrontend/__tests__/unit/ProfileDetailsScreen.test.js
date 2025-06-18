// Written by s224837

import React from 'react';
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ProfileDetailsScreen from '../../src/screens/burgermenu/settingComponents/ProfileDetailsScreen';
import * as SecureStore from 'expo-secure-store';
import { useAuth0 } from 'react-native-auth0';
import { Alert } from 'react-native';

jest.spyOn(Alert, 'alert');

const mockAuthStoreLogout = jest.fn().mockResolvedValue();
const mockUpdateProfile = jest.fn();
const mockResetProfile = jest.fn();

let mockHydrated = true;
let mockProfile = {
    name: 'John Doe',
    birthDate: '01/01/1990',
    gender: 'Male',
    email: 'john@example.com',  
    code: '123456',
};

jest.mock('../../src/store/useProfileStore', () => {
    // const React = require('react');

    const useProfileStore = () => ({
        hydrated: mockHydrated,
        profile: mockProfile,
        updateProfile: mockUpdateProfile,
        resetProfile: mockResetProfile,
        loadProfile: jest.fn(),
    });

    useProfileStore.__setHydrated = v => { mockHydrated = v };
    useProfileStore.__setProfile = v => { mockProfile = v };

    return { __esModule: true, default: useProfileStore };
});

import useProfileStore from '../../src/store/useProfileStore';
const setHydrated = useProfileStore.__setHydrated;
const setProfile = useProfileStore.__setProfile;


// Mock external dependencies
jest.mock('expo-secure-store');

// Auth0
jest.mock('react-native-auth0', () => ({
    useAuth0: jest.fn()
}));    

// useAuthStore
jest.mock('../../src/store/useAuthStore', () => ({
    __esModule: true,
    default: () => ({
        logout: mockAuthStoreLogout
    }),    
}));    

jest.mock('../../src/screens/burgermenu/settingComponents/profileInput/DateTimePickerInput', () => () => null);
jest.mock('../../src/screens/burgermenu/settingComponents/profileInput/GenderPickerInput', () => () => null);
jest.mock('@expo/vector-icons', () => ({
    Feather: () => null
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


describe('ProfileDetailsScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        SecureStore.setItemAsync.mockResolvedValue();

        setHydrated(true);
        setProfile({
            name: 'John Doe',
            birthDate: '01/01/1990',
            gender: 'Male',
            email: 'john@example.com',  
            code: '123456',
        });

        useAuth0.mockReturnValue ({
            clearSession: jest.fn().mockResolvedValue(true),
            user: { email: 'test@example.com' },
            error: null,
        });
    });

    it('shows loading indicator until store hydrates', async () => {
        setHydrated(false);
        const { getByText, queryByText, rerender } = render(<ProfileDetailsScreen />);
        expect(getByText('Loading profile...')).toBeTruthy();

        setHydrated(true);
        rerender(<ProfileDetailsScreen />);

        expect(queryByText('Loading profile...')).toBeNull();
        expect(getByText('Profile Details')).toBeTruthy();
    });

    it('persists to store and UI shows updated name', async () => {
        mockUpdateProfile.mockImplementation(async updated => {
            setProfile(updated);
            return true;
        });

        const { getByText, getByPlaceholderText } = render(<ProfileDetailsScreen />);

        fireEvent.changeText(getByPlaceholderText('Enter your name'), 'Jane');
        fireEvent.press(getByText('Save Changes'));

        await waitFor(() =>
            expect(getByPlaceholderText('Enter your name').props.value).toBe('Jane')
        );
    });

    it('renders correctly', async () => {
        const { findByText } = render(<ProfileDetailsScreen />);

        // Wait for initial data to load
        expect(await findByText('Profile Details')).toBeTruthy();
    });

    it('updates name field and removes digits', () => {
        const { getByPlaceholderText } = render(<ProfileDetailsScreen />);
        const nameInput = getByPlaceholderText('Enter your name');

        fireEvent.changeText(nameInput, 'Jane123 Doe');
        expect(nameInput.props.value).toBe('Jane Doe');
    });

    it('toggles password visibility', async () => {
        const { getByTestId, getByDisplayValue } = render(<ProfileDetailsScreen />);
        expect(getByDisplayValue('******')).toBeTruthy();
        fireEvent.press(getByTestId('eye-icon'));

        await waitFor(() => 
            expect(getByDisplayValue('123456')).toBeTruthy()
        );
    });

    it('saves profile data when inputs are valid', async() => {
        const { getByText, getByPlaceholderText } = render(<ProfileDetailsScreen />);

        fireEvent.changeText(getByPlaceholderText('Enter your name'), 'Jane');
        fireEvent.changeText(getByPlaceholderText('Enter your email'), 'jane@example.com');
        fireEvent.press(getByText('Save Changes'));

        await waitFor(() => {
            expect(mockUpdateProfile).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'Jane',
                    email: 'jane@example.com'
                }),
            );
        });
    });

    it('shows error when "new password" and "confirm password" do not match', async () => {
        const { getByText, getByPlaceholderText } = render(<ProfileDetailsScreen />);
        mockUpdateProfile.mockClear();

        // Test
        fireEvent.changeText(getByPlaceholderText('Enter your name'), 'John');
        fireEvent.changeText(getByPlaceholderText('Enter your email'), 'john@example.com');

        fireEvent.press(getByText('New Password'));
        fireEvent.changeText(getByPlaceholderText('New Password'), 'abc123');
        fireEvent.changeText(getByPlaceholderText('Confirm New Password'), 'abc456');
        fireEvent.press(getByText('Save Changes'));

        await waitFor(() => {
            expect(mockUpdateProfile).not.toHaveBeenCalled();
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Passwords do not match');
        });
    });

    it('shows alert for invalid email', async () => {
        const { getByText, getByPlaceholderText } = render(<ProfileDetailsScreen />);
        mockUpdateProfile.mockClear();

        // Test
        fireEvent.changeText(getByPlaceholderText('Enter your name'), 'John');

        fireEvent.changeText(getByPlaceholderText('Enter your email'), 'invalid email');
        fireEvent.press(getByText('Save Changes'));

        await waitFor(() => {
            expect(mockUpdateProfile).not.toHaveBeenCalled();
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter a valid email address.');
        });
    });

    it('saves new password when confirmed correctly', async () => {
        const { getByText, getByPlaceholderText } = render(<ProfileDetailsScreen />);

        fireEvent.press(getByText('New Password'));
        fireEvent.changeText(getByPlaceholderText('New Password'), 'mypassword');
        fireEvent.changeText(getByPlaceholderText('Confirm New Password'), 'mypassword');
        fireEvent.press(getByText('Save Changes'));

        await waitFor(() => {
            expect(mockUpdateProfile).toHaveBeenCalledWith(expect.objectContaining({
                code: 'mypassword'
            }));
        });
    });

    it('calls clearSession, resetProfile, logout, navigates home and closes modal when logout button is pressed', async () => {
        const mockNavigate = jest.fn();
        const mockCloseModal = jest.fn();

        const { getByText } = render(
            <ProfileDetailsScreen
                navigation={{ navigate: mockNavigate }}
                closeModal={mockCloseModal}
            />
        );

        fireEvent.press(getByText('Log Out'));
        await waitFor(() => {
            // Comes from useAuth0
            expect(useAuth0().clearSession).toHaveBeenCalled();

            // From useProfileStore
            expect(mockResetProfile).toHaveBeenCalled();

            // From useAuthStore
            expect(mockAuthStoreLogout).toHaveBeenCalled();
            
            expect(mockNavigate).toHaveBeenCalledWith('Home');
            expect(mockCloseModal).toHaveBeenCalled();
        });
    });

    it('does not save if required field are empty', async () => {
        const { getByText, getByPlaceholderText } = render(<ProfileDetailsScreen />);
        mockUpdateProfile.mockClear();

        fireEvent.changeText(getByPlaceholderText('Enter your name'), '');
        fireEvent.changeText(getByPlaceholderText('Enter your email'), '');
        fireEvent.press(getByText('Save Changes'));

        await waitFor(() => {
            expect(mockUpdateProfile).not.toHaveBeenCalled();
            expect(Alert.alert).toHaveBeenCalledWith('Error',  expect.any(String));
        });
    });
});