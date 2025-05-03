import { render, fireEvent, act } from "@testing-library/react-native";
import App, { LoginButton } from "../src/screens/demo menu/App"
import { useAuth0 as mockUseAuth0 } from "react-native-auth0";
import React from "react";

/* 
Due to the App calling the constant useAuth0, it makes it difficult to run isolated tests.
Therefore, we use some mock values, where:

    user: We pretend that it is logged in
    loginWithRedirect: Simulates the login action
    logout: Simulates the logout action
    isLoading: Controls whether the Auth0 is still loading
    error: Simulates any Auth0-related error messages

In other words, the test will behave as if the user is already logged in.

For easier readability we therefore use mockUseAuth0 instead of useAuth0.
*/

jest.mock('react-native-auth0', () => ({
    useAuth0: jest.fn(),
}));

describe("App", () => {
    it('renders buttons correctly', () => {
        const navigationMock = { navigate: jest.fn() }; // Needed when navigation is used

        mockUseAuth0.mockReturnValue({
            user: null,
            loginWithRedirect: jest.fn(),
            logout: jest.fn(),
            isLoading: false,
            error: null,
        });

        const { getByText } = render(<App navigation={navigationMock} />);


        // Checking if a button or other known element appears
        expect(getByText('Show Settings')).toBeTruthy();
        expect(getByText('Feed')).toBeTruthy();
        expect(getByText('Button 4')).toBeTruthy();
    });
});


describe("LoginButton", () => {
    it('shows the logout button when user is logged in', () => {
        mockUseAuth0.mockReturnValue({
            user: { name: "Test User" },
            loginWithRedirect: jest.fn(),
            logout: jest.fn(),
            isLoading: false,
            error: null,
        });

        const { getByText } = render(<LoginButton />);
        expect(getByText('Log out')).toBeTruthy();
        expect(getByText("Logged in as Test User")).toBeTruthy();
    });


    it('shows the login button when user is logged out', () => {
        mockUseAuth0.mockReturnValue({
            user: null,
            loginWithRedirect: jest.fn(),
            logout: jest.fn(),
            isLoading: false,
            error: null,
        });
        
        const { getByText } = render(<LoginButton />);
        expect(getByText('Log in')).toBeTruthy();
    });

    it('calls authorize() when Log in is pressed', () => {
        const mockLogin = jest.fn();
        
        mockUseAuth0.mockReturnValue({
            user: null,
            loginWithRedirect: mockLogin,
            logout: jest.fn(),
            isLoading: false,
            error: null,
        });

        const { getByText } = render(<LoginButton />);
        fireEvent.press(getByText("Log in"));

        expect(mockLogin).toHaveBeenCalled();
    });

    it('calls clearSession() when Log out is pressed', () => {
        const mockLogout = jest.fn();
        
        mockUseAuth0.mockReturnValue({
            user: { name: "Test User" },
            loginWithRedirect: jest.fn(),
            logout: mockLogout,
            isLoading: false,
            error: null,
        });

        const { getByText } = render(<LoginButton />);
        fireEvent.press(getByText("Log out"));

        expect(mockLogout).toHaveBeenCalled();
    });
});

