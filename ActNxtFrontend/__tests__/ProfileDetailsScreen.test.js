import React from 'react';
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ProfileDetailsScreen from '../src/screens/burgermenu/ProfileDetailsScreen';
import * as SecureStore from 'expo-secure-store';
import { useAuth0 } from 'react-native-auth0';
import { Alert } from 'react-native';

jest.spyOn(Alert, 'alert');

// Mock external dependencies
jest.mock('expo-secure-store');

// Auth0
jest.mock('react-native-auth0', () => ({
    useAuth0: () => ({
        clearSession: jest.fn().mockResolvedValue(true),
        user: { email: 'test@gmail.com' },
        error: null,
    })
}));

// useAuthStore
const mockAuthStoreLogout = jest.fn().mockResolvedValue();
jest.mock('../src/store/useAuthStore', () => ({
    __esModule: true,
    default: () => ({
        logout: mockAuthStoreLogout
    }),
}));

jest.mock('../src/screens/burgermenu/DateTimePickerInput', () => () => null);
jest.mock('../src/screens/burgermenu/GenderPickerInput', () => () => null);
jest.mock('@expo/vector-icons', () => ({
    Feather: () => null
}));

jest.mock('../src/Themes/ThemeContext', () => ({
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

let mockUpdateProfile = jest.fn();
let mockResetProfile = jest.fn();

jest.mock('../src/store/useProfileStore', () => {
    const React = require('react');

    return {
        __esModule: true,
        default: () => ({
            hydrated: true,
            profile: {
                name: 'John Doe',
                birthDate: '01/01/1990',
                gender: 'Male',
                email: 'john@example.com',  
                code: '123456',
            },
            updateProfile: mockUpdateProfile,
            resetProfile: mockResetProfile,
            loadProfile: jest.fn()
        }),
    };
});


describe('ProfileDetailsScreen', () => {
    const mockUser = {
        email: 'test@example.com'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        SecureStore.setItemAsync.mockResolvedValue();

        // Mock Auth0 hooks
        useAuth0.mockReturnValue({
            user: mockUser,
            error: null,
            logout: jest.fn().mockResolvedValue(true)
        });
    });

    it('renders correctly', async () => {
        const { findByText } = render(<ProfileDetailsScreen />);

        // Wait for initial data to load
        expect(await findByText('Profile Details')).toBeTruthy();
    });

    it('updates name field and removes digits', async () => {
        const { getByPlaceholderText } = render(<ProfileDetailsScreen />);
        const nameInput = await waitFor(() =>
            getByPlaceholderText('Enter your name')
        );

        fireEvent.changeText(nameInput, 'Jane123 Doe');
        expect(nameInput.props.value).toBe('Jane Doe');
    });

    it('toggles password visibility', async () => {
        const { getByTestId, getByDisplayValue } = render(<ProfileDetailsScreen />);
        
        // Password should be hidden initially
        await waitFor(() => 
            expect(getByDisplayValue('******')).toBeTruthy()
        );

        // Press eye icon
        const eyeIcon = getByTestId('eye-icon');
        fireEvent.press(eyeIcon);

        // Password should now be visible
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
            expect(mockUpdateProfile).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Jane',
                email: 'jane@example.com'
            }));
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