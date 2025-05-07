import React from 'react';
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ProfileDetailsScreen from '../src/screens/burgermenu/ProfileDetailsScreen';
import * as SecureStore from 'expo-secure-store';
import { useAuth0 } from 'react-native-auth0';

// Mock external dependencies
jest.mock('expo-secure-store');
jest.mock('react-native-auth0');
jest.mock('../src/screens/burgermenu/DateTimePickerInput', () => () => null);
jest.mock('../src/screens/burgermenu/GenderPickerInput', () => () => null);
jest.mock('@expo/vector-icons', () => ({
    Feather: () => null
}));

let mockUpdateProfile = jest.fn();
let mockResetProfile = jest.fn();

jest.mock('../src/store/useProfileStore', () => {
    const React = require('react');

    return {
        __esModule: true,
        default: () => ({
            profile: {
                name: 'John Doe',
                birthDate: '01/01/1990',
                gender: 'Male',
                email: 'john@example.com',  
                code: '123456'
            },
            updateProfile: mockUpdateProfile,
            resetProfile: mockResetProfile,
        }),
    };
});


describe('ProfileDetailsScreen', () => {
    const mockUser = {
        email: 'test@example.com'
    };

    beforeEach(() => {
        mockUpdateProfile.mockClear();
        mockResetProfile.mockClear();
        SecureStore.setItemAsync.mockResolvedValue();

        // Mock Auth0 hooks
        useAuth0.mockReturnValue({
            user: mockUser,
            error: null,
            clearSession: jest.fn().mockResolvedValue(true)
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
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

    it('shows error when new password and confirm password fo not match', async () => {
        const { getByText, getByPlaceholderText } = render(<ProfileDetailsScreen />);

        fireEvent.press(getByText('New Password'));
        fireEvent.changeText(getByPlaceholderText('New Password'), 'abc123');
        fireEvent.changeText(getByPlaceholderText('Confirm New Password'), 'abc456');
        fireEvent.press(getByText('Save Changes'));

        await waitFor(() => {
            expect(mockUpdateProfile).not.toHaveBeenCalled();
        });
    });

    it('shows alert for invalid email', async () => {
        const { getByText, getByPlaceholderText } = render(<ProfileDetailsScreen />);

        fireEvent.changeText(getByPlaceholderText('Enter your email'), 'invalid email');
        fireEvent.press(getByText('Save Changes'));

        await waitFor(() => {
            expect(mockUpdateProfile).not.toHaveBeenCalled();
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

    it('calls logout and navigates to home when logout button is pressed', async () => {
        const mockLogout = jest.fn();
        const mockNavigate = jest.fn();
        const mockCloseModal = jest.fn();

        useAuth0.mockReturnValue({
            logout: mockLogout,
            user: { email: 'test@example.com' },
            isAuthenticated: true,
        });

        const { getByText } = render(
            <ProfileDetailsScreen
                navigation={{ navigate: mockNavigate }}
                closeModal={mockCloseModal}
            />
        );

        fireEvent.press(getByText('Log Out'));
        await waitFor(() => {
            expect(mockLogout).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('Home');
            expect(mockCloseModal).toHaveBeenCalled();
        });
    });

    it('does not save if required field are empty', async () => {
        const { getByText, getByPlaceholderText } = render(<ProfileDetailsScreen />);

        fireEvent.changeText(getByPlaceholderText('Enter your name'), '');
        fireEvent.changeText(getByPlaceholderText('Enter your email'), '');
        fireEvent.press(getByText('Save Changes'));

        await waitFor(() => {
            expect(mockUpdateProfile).not.toHaveBeenCalled();
        });
    });
});