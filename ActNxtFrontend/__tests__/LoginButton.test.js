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

// Mock additional dependencies for integration tests
jest.mock('../src/Themes/ThemeContext', () => ({
    useTheme: () => ({
        resolvedTheme: 'light'
    })
}));

jest.mock('react-native-gesture-handler', () => ({
    GestureHandlerRootView: ({ children }) => {
        const { View } = require('react-native');
        return <View>{children}</View>;
    }
}));

jest.mock('../src/screens/Pages/Styles', () => ({
    Styles: {
        centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
        buttonContainer: { marginTop: 20 }
    }
}));

jest.mock('../src/store/useSettingsStore', () => ({
    __esModule: true,
    default: () => ({
        loadSettings: jest.fn().mockResolvedValue({}),
        hydrated: true
    })
}));

jest.mock('../src/store/useProfileStore', () => ({
    __esModule: true,
    default: () => ({
        loadProfile: jest.fn().mockResolvedValue({}),
        hydrated: true,
        updateProfile: jest.fn()
    })
}));

jest.mock('../src/store/useInsightsStore', () => ({
    __esModule: true,
    default: () => ({
        loadInsights: jest.fn().mockResolvedValue({}),
        hydrated: true
    })
}));

// Mock BlurView since it's a native component
jest.mock('@react-native-community/blur', () => ({
    BlurView: ({ children, ...props }) => {
        const { View } = require('react-native');
        return <View {...props}>{children}</View>;
    }
}));

// Mock expo-asset for image preloading
jest.mock('expo-asset', () => ({
    Asset: {
        loadAsync: jest.fn().mockResolvedValue({}),
    }
}));

// Make Asset available globally for the component
global.Asset = {
    loadAsync: jest.fn().mockResolvedValue({})
};

// Mock react-native components for tests
jest.mock('react-native', () => ({
    Pressable: 'Pressable',
    StyleSheet: {
        create: (styles) => styles,
        flatten: (style) => style,
    },
    Text: 'Text',
    View: 'View',
    ActivityIndicator: 'ActivityIndicator',
    Button: ({ title, onPress, ...props }) => {
        const { Pressable, Text } = require('react-native');
        return (
            <Pressable onPress={onPress} {...props}>
                <Text>{title}</Text>
            </Pressable>
        );
    },
    Image: 'Image',
    Dimensions: {
        get: jest.fn(() => ({ width: 375, height: 812 }))
    },
    Animated: {
        Value: jest.fn(() => ({
            setValue: jest.fn(),
            interpolate: jest.fn(),
        })),
        timing: jest.fn(() => ({
            start: jest.fn((callback) => callback && callback()),
        })),
        Image: 'AnimatedImage',
    },
}));


// TESTS FOR LoginButton
const mockUseAuthStore = require('../src/store/useAuthStore').default;
const mockAuthorize = jest.fn();
const mockClearSession = jest.fn();
const mockLogin = jest.fn();
const mockLogout = jest.fn();
const mockNavigation = {
    navigate: jest.fn()
};
const mockOnLoginPress = require('../src/screens/Pages/LoginPage').onLoginPress;

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
        const { getByText } = render(<LoginButton 
                onLoginPress={jest.fn()} 
                error={null} 
                isLoading={false} 
                currentUser={null} 
                navigation={mockNavigation} 
            />);
        expect(getByText('Login')).toBeTruthy();
        expect (mockAuthorize).not.toHaveBeenCalled();
    });

    it('calls onLoginPress when login button is pressed', async () => {
        const mockOnLoginPress = jest.fn();
        
        const { getByTestId } = render(
            <LoginButton 
                onLoginPress={mockOnLoginPress} 
                error={null} 
                isLoading={false} 
                currentUser={null} 
                navigation={mockNavigation} 
            />
        );
        
        fireEvent.press(getByTestId('login-button'));
        
        expect(mockOnLoginPress).toHaveBeenCalled();
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

    it('shows loading state during authorization', () => {
        const { getByText } = render(<LoginButton 
                onLoginPress={jest.fn()} 
                error={null} 
                isLoading={true} 
                currentUser={null} 
                navigation={mockNavigation} 
            />);
        expect(getByText('auth0 error, navigate to Feed')).toBeTruthy();
    });

    it('navigates to Feed when error button is pressed during loading', () => {
        const { getByText } = render(
            <LoginButton 
                onLoginPress={jest.fn()} 
                error={null} 
                isLoading={true} 
                currentUser={null} 
                navigation={mockNavigation} 
            />
        );
        
        fireEvent.press(getByText('auth0 error, navigate to Feed'));
        expect(mockNavigation.navigate).toHaveBeenCalledWith('Feed');
    });
});

// INTEGRATION TESTS - Testing the full login flow from LoginPage
describe("LoginPage Integration", () => {
    beforeEach(() => {
        // Update the auth store mock for integration tests
        mockUseAuthStore.mockReturnValue({
            loadAuth: jest.fn().mockResolvedValue({}),
            hydrated: true,
            login: mockLogin,
            user: null,
            isLoggedIn: false,
            token: null
        });
    });

    it('calls authorize() and login() on successful authentication', async () => {
        mockAuthorize.mockResolvedValue({
            accessToken: 'test-token'
        });

        // Import LoginPage after all mocks are set up
        const LoginPage = require('../src/screens/Pages/LoginPage').default;
        
        const { getByTestId } = render(<LoginPage navigation={mockNavigation} />);
        
        // Find and press the login button
        const loginButton = getByTestId('login-button');
        fireEvent.press(loginButton);

        await waitFor(() => {
            expect(mockAuthorize).toHaveBeenCalled();
            expect(mockLogin).toHaveBeenCalledWith('test-token');
        });
    });

    it('handles authorize returning undefined', async () => {
        mockAuthorize.mockResolvedValue(undefined);

        const LoginPage = require('../src/screens/Pages/LoginPage').default;
        
        const { getByTestId } = render(<LoginPage navigation={mockNavigation} />);
        
        fireEvent.press(getByTestId('login-button'));

        await waitFor(() => {
            expect(mockAuthorize).toHaveBeenCalled();
            expect(mockLogin).not.toHaveBeenCalled();
        });
    });
});