import { render, fireEvent } from '@testing-library/react-native';
import LanguageScreen from '../src/screens/burgermenu/LanguageScreen';

// MOCKS
const mockSetLanguage = jest.fn();

jest.mock('../src/store/useSettingsStore', () => {
    return {
        __esModule: true,
        default: () => ({
            language: 'en',
            setLanguage: mockSetLanguage,
            hydrated: true,
        }),
    };
});

jest.mock('../src/screens/Settings/SettingsList', () => {
    const React = require('react');
    const { Text, TouchableOpacity, View } = require('react-native');
    return ({ settings }) => (
        <View>
            {settings.map((item) => (
                <TouchableOpacity
                    key={item.name}
                    testID={`row-${item.name}`}
                    onPress={() =>
                        // Pick option to simulate a change
                        item.function?.(item.options ? item.options[1] : undefined)
                    }
                >
                    <Text>{item.name}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
});


// TESTS FOR LanguageScreen
describe('LanguageScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the language row', () => {
        const { getByText } = render(<LanguageScreen />);
        expect(getByText('Language')).toBeTruthy();
    });

    it('when row is pressed, it calls setLanguage() with the new value', () => {
        const { getByTestId } = render(<LanguageScreen />);

        fireEvent.press(getByTestId('row-Language'));

        expect(mockSetLanguage).toHaveBeenCalledWith('Danish');
    });
});