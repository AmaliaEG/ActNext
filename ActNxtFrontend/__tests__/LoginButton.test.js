import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useAuth0 as mockUseAuth0 } from "react-native-auth0";
import { LoginButton } from "../src/screens/Pages/LoginPage";

// MOCKS
jest.mock('react-native-auth0', () => ({
    useAuth0: jest.fn()
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    __esModule: true,
    default: {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
    }
}));

jest.mock('../src/store/useAuthStore', () => {
    return {
        __esModule: true,
        default: jest.fn()
    }
});


// TESTS FOR LoginButton
const mockUseAuthStore = require('../src/store/useAuthStore').default;
const mockAuthorize = jest.fn();
const mockClearSession = jest.fn();
const mockLogin = jest.fn();
const mockLogout = jest.fn();


beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuth0.mockReturnValue({
        authorize: mockAuthorize,
        clearSession: mockClearSession,
        user: null,
        isLoading: false,
        error: null
    });

    mockUseAuthStore.mockReturnValue({
        user: null,
        login: mockLogin,
        logout: mockLogout
    });
});


describe("LoginButton", () => {
    it('shows login button when not authenticated', () => {
        const { getByText } = render(<LoginButton />);
        expect(getByText('Login')).toBeTruthy();
        expect (mockAuthorize).not.toHaveBeenCalled();
    });

    it('calls authorize() and updates Zustand on login', async () => {
        mockAuthorize.mockResolvedValue({
            accessToken: 'test-token'
        });

        const { getByText } = render(<LoginButton />);
        fireEvent.press(getByText('Login'));

        await waitFor(() => {
            expect(mockAuthorize).toHaveBeenCalled();
            expect(mockLogin).toHaveBeenCalledWith('test-token');
        });
    });

    it('falls back to Auth0 user if Zustand is empty', () => {
        mockUseAuthStore.mockReturnValue({
            user: null,
            login: mockLogin,
            logout: mockLogout,
        });

        mockUseAuth0.mockReturnValue({
            user: { name: "Auth0 User" },
            isLoading: false
        });

        const { getByText } = render(<LoginButton />);
        expect(getByText('Login')).toBeTruthy();
    });

    it('handles credentials returning undefined when calling authorize()', async () => {
        mockAuthorize.mockResolvedValue(undefined);

        const { getByText } = render(<LoginButton />);
        fireEvent.press(getByText('Login'));

        await waitFor(() => {
            expect(mockAuthorize).toHaveBeenCalled();
            expect(mockLogin).not.toHaveBeenCalled();
        });
    });

    it('shows loading state during authorization', () => {
        mockUseAuth0.mockReturnValue({ 
            isLoading: true,
            authorize: mockAuthorize,
            clearSession: mockClearSession,
            user: null,
            error: null,
        });

        const { getByText } = render(<LoginButton />);
        expect(getByText('auth0 error, navigate to Feed')).toBeTruthy();
    });
});