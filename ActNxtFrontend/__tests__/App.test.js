import { render, waitFor } from "@testing-library/react-native";
import App from "../src/screens/demo_menu/App"
import { useAuth0 as mockUseAuth0 } from "react-native-auth0";


// MOCKS
jest.mock('react-native-auth0', () => ({
    useAuth0: jest.fn(),
}));

const makeZustandMock = (extra = {}) => () => ({
    hydrated: true,
    loadAuth: jest.fn(),
    loadSettings: jest.fn(),
    loadProfile: jest.fn(),
    loadInsights: jest.fn(),
    ...extra,
});

jest.mock('../src/store/useAuthStore', () => ({
    __esModule: true,
    default: makeZustandMock({
        setAuth: jest.fn(),
        logout: jest.fn(),
        user: null,
    }),
}));

jest.mock('../src/store/useSettingsStore', () => ({
    __esModule: true,
    default: makeZustandMock(),
}));

jest.mock('../src/store/useProfileStore', () => ({
    __esModule: true,
    default: makeZustandMock(),
}));

jest.mock('../src/store/useInsightsStore', () => ({
    __esModule: true,
    default: makeZustandMock(),
}));


// TESTS FOR App
describe("App", () => {
    beforeEach(() => {
        mockUseAuth0.mockReturnValue({
            authorize: jest.fn(),
            clearSession: jest.fn(),
            user: null,
            isLoading: false,
            error: null
        });
    });

    it('renders buttons correctly', async () => {
        const navigation = { navigate: jest.fn() }; // Needed when navigation is used
        const { getByText } = render(<App navigation={navigation} />);

        await waitFor(() => {
            expect(getByText('Show Settings')).toBeTruthy();
        });

        // Checking if a button or other known element appears
        expect(getByText('Feed')).toBeTruthy();
        expect(getByText('Button 4')).toBeTruthy(); 
    });
});
