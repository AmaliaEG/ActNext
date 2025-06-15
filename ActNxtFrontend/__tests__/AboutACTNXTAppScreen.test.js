import React from 'react';
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert, Linking } from 'react-native';
import AboutACTNXTAppScreen from '../src/screens/burgermenu/AboutACTNXTAppScreen';

// MOCKS
jest.mock('../src/Themes/ThemeContext', () => ({
    useTheme: () => ({
        theme: {
            colors: {
                background: '#E9E9E9',
                boxBg: '#FFFFFF',
                boxBorder: '#CCCCCC',
                text: '#000000',
                buttonText: '#FFFFFF',
                primary: '#007AFF',
            },
        },
    }),
}));

// mock for linking
Linking.openURL = jest.fn();
Linking.canOpenURL = jest.fn();

jest.spyOn(Alert, 'alert');

const SUPPORT_URL = 'https://actnxt.com/';


// TESTS
describe('AboutACTNXTAppScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders title, description and version', () => {
        const { getByText } = render(<AboutACTNXTAppScreen />);

        expect(getByText('About ActNxt')).toBeTruthy();
        expect(getByText(/Version 1\.0\.0/i)).toBeTruthy();
        // A short substring is enough to prove that the description text is there
        expect(getByText(/Lorem ipsum dolor sit amet/i)).toBeTruthy();
    });

    it('opens the support URL when available', async () => {
        Linking.canOpenURL.mockResolvedValue(true);

        const { getByText } = render(<AboutACTNXTAppScreen />);

        fireEvent.press(getByText('CONTACT SUPPORT'));

        await waitFor(() => {
            expect(Linking.canOpenURL).toHaveBeenCalledWith(SUPPORT_URL);
            expect(Linking.openURL).toHaveBeenCalledWith(SUPPORT_URL);
            expect(Alert.alert).not.toHaveBeenCalled();
        });
    });

    it('alerts the user when the URL cannot be opened', async () => {
        Linking.canOpenURL.mockResolvedValue(false);

        const { getByText } = render(<AboutACTNXTAppScreen />);

        fireEvent.press(getByText('CONTACT SUPPORT'));

        await waitFor(() => {
            expect(Linking.openURL).not.toHaveBeenCalled();
            expect(Alert.alert).toHaveBeenCalledWith(
                'Cannot Open Link',
                'Your device is unable to open this link at the moment.'
            );
        });
    });
});