import { render, fireEvent, act } from "@testing-library/react-native";
import App from "../src/screens/demo menu/App"
import { useAuth0 as mockUseAuth0 } from "react-native-auth0";
import React from "react";


// MOCKS
jest.mock('react-native-auth0', () => ({
    useAuth0: jest.fn(),
}));


jest.mock('../src/store/useAuthStore', () => ({
    __esModule: true,
    default: () => ({
        setAuth: jest.fn(),
        logout: jest.fn(),
        user: null,
    }),
}));

const mockAuthorize = jest.fn();
const mockClearSession = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuth0.mockReturnValue({
        authorize: mockAuthorize,
        clearSession: mockClearSession,
        user: null,
        isLoading: false,
        error: null
    });
});


// TESTS FOR App
describe("App", () => {
    it('renders buttons correctly', () => {
        const navigation = { navigate: jest.fn() }; // Needed when navigation is used

        const { getByText } = render(<App navigation={navigation} />);

        // Checking if a button or other known element appears
        expect(getByText('Show Settings')).toBeTruthy();
        expect(getByText('Feed')).toBeTruthy();
        expect(getByText('Button 4')).toBeTruthy();
    });
});
