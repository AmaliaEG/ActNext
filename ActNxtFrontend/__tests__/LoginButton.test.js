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
const mockSetAuth = jest.fn();
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
        setAuth: mockSetAuth,
        logout: mockLogout
    });
});


describe("LoginButton", () => {
    it('shows login button when not authenticated', () => {
        const { getByText } = render(<LoginButton />);
        expect(getByText('Log in')).toBeTruthy();
        expect (mockAuthorize).not.toHaveBeenCalled();
    });

    it('calls authorize() and updates Zustand on login', async () => {
        mockAuthorize.mockResolvedValue({
            accessToken: 'test-token',
            user: { name: 'Test User' }
        });

        const { getByText } = render(<LoginButton />);
        fireEvent.press(getByText('Log in'));

        await waitFor(() => {
            expect(mockAuthorize).toHaveBeenCalled();
            expect(mockSetAuth).toHaveBeenCalledWith('test-token', { name: 'Test User' });
        });
    });

    it('shows logout button when authenticated', () => {
        mockUseAuthStore.mockReturnValue({
            user: { name: 'Test User' },
            setAuth: mockSetAuth,
            logout: mockLogout
        });

        const { getByText } = render(<LoginButton />);
        expect(getByText('Log out')).toBeTruthy();
        expect(getByText('Logged in as Test User')).toBeTruthy();
    });

    it('calls clearSession() and Zustand logout when logout pressed', async () => {
        mockUseAuthStore.mockReturnValue({
            user: { name: 'Test User' },
            setAuth: mockSetAuth,
            logout: mockLogout
        });

        const { getByText } = render(<LoginButton />);
        fireEvent.press(getByText('Log out'));

        await waitFor(() => {
            expect(mockClearSession).toHaveBeenCalled();
            expect(mockLogout).toHaveBeenCalled();
        });
    });

    it('falls back to Auth0 user if Zustand is empty', () => {
        mockUseAuthStore.mockReturnValue({
            user: null,
            setAuth: mockSetAuth,
            logout: mockLogout,
        });

        mockUseAuth0.mockReturnValue({
            user: { name: "Auth0 User" },
            isLoading: false
        });

        const { getByText } = render(<LoginButton />);
        expect(getByText('Logged in as Auth0 User')).toBeTruthy();
    });

    it('handles credentials returning null when calling authorize()', async () => {
        mockAuthorize.mockResolvedValue(null);

        const { getByText } = render(<LoginButton />);
        fireEvent.press(getByText('Log in'));

        await waitFor(() => {
            expect(mockAuthorize).toHaveBeenCalled();
            expect(mockSetAuth).not.toHaveBeenCalled();
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
        expect(getByText('Loading...')).toBeTruthy();
    });

    it('displays Auth0 errors', async () => {
        mockUseAuth0.mockReturnValue({
            isLoading: false,
            authorize: mockAuthorize,
            clearSession: mockClearSession,
            user: null,
            error: { message: 'Network error' }
        });

        const { getByText } = render(<LoginButton />);
        expect(getByText('Network error')).toBeTruthy();
    });
});