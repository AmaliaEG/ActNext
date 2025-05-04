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

describe('ProfileDetailsScreen', () => {
    const mockUser = {
        email: 'test@example.com'
    };

    beforeEach(() => {
        // Mock SecureStore methods
        SecureStore.getItemAsync.mockImplementation((key) =>
            Promise.resolve({
                name: 'John Doe',
                birthDate: '01/01/1990',
                gender: 'Male',
                email: 'john@example.com',
                code: '123456'
            }[key])
        );

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

    it('loads saved profile data on mount', async () => {
        render(<ProfileDetailsScreen />);

        await waitFor(() => {
            expect(SecureStore.getItemAsync).toHaveBeenCalledWith('name');
            expect(SecureStore.getItemAsync).toHaveBeenCalledWith('birthDate');
            expect(SecureStore.getItemAsync).toHaveBeenCalledWith('gender');
            expect(SecureStore.getItemAsync).toHaveBeenCalledWith('email');
            expect(SecureStore.getItemAsync).toHaveBeenCalledWith('code');
        });
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
            expect(SecureStore.setItemAsync).toHaveBeenCalledWith('name', 'Jane');
            expect(SecureStore.setItemAsync).toHaveBeenCalledWith('email', 'jane@example.com');
        });
    });

    it('shows error when new password and confirm password fo not match', async () => {
        const { getByText, getByPlaceholderText } = render(<ProfileDetailsScreen />);

        fireEvent.press(getByText('New Password'));

        fireEvent.changeText(getByPlaceholderText('New Password'), 'abc123');
        fireEvent.changeText(getByPlaceholderText('Confirm New Password'), 'abc456');

        fireEvent.press(getByText('Save Changes'));

        await waitFor(() => {
            expect(SecureStore.setItemAsync).not.toHaveBeenCalledWith('code', 'abc123');
        });
    });

    it('shows alert for invalid email', async () => {
        const { getByText, getByPlaceholderText } = render(<ProfileDetailsScreen />);

        fireEvent.changeText(getByPlaceholderText('Enter your email'), 'invalid email');
        fireEvent.press(getByText('Save Changes'));

        await waitFor(() => {
            expect(SecureStore.setItemAsync).not.toHaveBeenCalledWith();
        });
    });

    it('saves new password when confirmed correctly', async () => {
        const { getByText, getByPlaceholderText } = render(<ProfileDetailsScreen />);

        fireEvent.press(getByText('New Password'));

        fireEvent.changeText(getByPlaceholderText('New Password'), 'mypassword');
        fireEvent.changeText(getByPlaceholderText('Confirm New Password'), 'mypassword');

        fireEvent.press(getByText('Save Changes'));

        await waitFor(() => {
            expect(SecureStore.setItemAsync).toHaveBeenCalledWith('code', 'mypassword');
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
            expect(SecureStore.setItemAsync).not.toHaveBeenCalledWith('name', expect.anything());
            expect(SecureStore.setItemAsync).not.toHaveBeenCalledWith('email', expect.anything());
        });
    });
});