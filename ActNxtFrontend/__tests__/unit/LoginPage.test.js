import { render, waitFor } from "@testing-library/react-native";
import LoginPage from "../../src/screens/Pages/LoginPage"
import { useAuth0 as mockUseAuth0 } from "react-native-auth0";

// Mock react-native components properly
jest.mock('react-native', () => ({
    Pressable: ({ children, onPress, ...props }) => {
        const MockPressable = 'Pressable';
        return <MockPressable onPress={onPress} {...props}>{children}</MockPressable>;
    },
    StyleSheet: {
        create: (styles) => styles,
        flatten: (style) => style,
    },
    Text: 'Text',
    View: 'View',
    ActivityIndicator: 'ActivityIndicator',
    Button: ({ title, onPress, ...props }) => {
        const MockButton = 'Button';
        return <MockButton onPress={onPress} {...props}>{title}</MockButton>;
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

// Mock BlurView since it's a native component
jest.mock('@react-native-community/blur', () => ({
    BlurView: ({ children, ...props }) => {
        return <div {...props}>{children}</div>;
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

// Mock gesture handler
jest.mock('react-native-gesture-handler', () => ({
    GestureHandlerRootView: ({ children, ...props }) => {
        return <div {...props}>{children}</div>;
    }
}));

// Mock the Styles import
jest.mock('../../src/screens/Pages/Styles', () => ({
    Styles: {
        centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
        buttonContainer: { marginTop: 20 }
    }
}));

// MOCKS
jest.mock('react-native-auth0', () => ({
    useAuth0: jest.fn(),
}));

const makeZustandMock = (extra = {}) => () => ({
    hydrated: true,
    loadAuth: jest.fn().mockResolvedValue({}),
    loadSettings: jest.fn().mockResolvedValue({}),
    loadProfile: jest.fn().mockResolvedValue({}),
    loadInsights: jest.fn().mockResolvedValue({}),
    ...extra,
});

jest.mock('../../src/store/useAuthStore', () => ({
    __esModule: true,
    default: makeZustandMock({
        login: jest.fn(),
        logout: jest.fn(),
        user: null,
        isLoggedIn: false,
        token: null,
    }),
}));

jest.mock('../../src/store/useSettingsStore', () => ({
    __esModule: true,
    default: makeZustandMock(),
}));

jest.mock('../../src/store/useProfileStore', () => ({
    __esModule: true,
    default: makeZustandMock({
        updateProfile: jest.fn(),
    }),
}));

jest.mock('../../src/store/useInsightsStore', () => ({
    __esModule: true,
    default: makeZustandMock(),
}));

jest.mock('../../src/Themes/ThemeContext', () => ({
    useTheme: () => ({
        resolvedTheme: 'light'
    })
}));

// TESTS FOR LoginPage
describe("LoginPage", () => {
    const mockNavigation = { navigate: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        
        mockUseAuth0.mockReturnValue({
            authorize: jest.fn(),
            clearSession: jest.fn(),
            user: null,
            isLoading: false,
            error: null
        });
    });

    it('renders login page correctly when not authenticated', async () => {
        const { getByText } = render(<LoginPage navigation={mockNavigation} />);

        // Wait for the component to fully render and hydrate
        await waitFor(() => {
            // Check for the Login button text
            expect(getByText('Login')).toBeTruthy();
        });
    });

    it('navigates to Feed when user is already authenticated', async () => {
        // Mock Auth0 returning a user
        mockUseAuth0.mockReturnValue({
            authorize: jest.fn(),
            clearSession: jest.fn(),
            user: { name: 'Test User', email: 'test@example.com' },
            isLoading: false,
            error: null
        });

        render(<LoginPage navigation={mockNavigation} />);

        // Should navigate to Feed when auth0User is present
        await waitFor(() => {
            expect(mockNavigation.navigate).toHaveBeenCalledWith('Feed');
        });
    });
});