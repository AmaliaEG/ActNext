import { render, fireEvent } from "@testing-library/react-native";
import GenderPickerInput from '../src/screens/burgermenu/GenderPickerInput';

jest.mock('@expo/vector-icons', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        MaterialIcons: (props) => React.createElement(View, props),
    };
});

jest.mock('../src/Themes/ThemeContext', () => ({
    useTheme: () => ({
        theme: {
            colors: {
                boxBg: '#FFFFFF',
                text: '#000000',
                boxBorder: '#CCCCCC',
                sheetBg: '#FFFFFF',
                sheetBorder: '#DDDDDD',
                sheetText: '#000000',
                arrow: '#555555',
                divider: '#EEEEEE',
            },
        },
    }),
}));

describe('GenderPickerInput', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    it('renders the label and current value', () => {
        const { getByText } = render (
            <GenderPickerInput value="Male" onChange={mockOnChange} />
        );

        expect(getByText('Select Gender')).toBeTruthy();
        expect(getByText('Male')).toBeTruthy();
        // expect(getByText('Female')).toBeTruthy();
        // expect(getByText('Non-binary')).toBeTruthy();
        // expect(getByText('Prefer not to say')).toBeTruthy();
        // expect(getByText('Other')).toBeTruthy();
    });

    it('opens the modal with all options when pressed', () => {
        const { getByTestId, queryByTestId } = render(
            <GenderPickerInput value="" onChange={mockOnChange} />
        );

        // These gender-options only occurs when the button is pressed, which means that is shouldn't be
        // visible until then. We can check this by using one of the options.
        expect(queryByTestId('gender-option-Other')).toBeNull();

        // Open options
        fireEvent.press(getByTestId('gender-picker-button'));

        // We should be able to see all options
        expect(getByTestId('gender-option-placeholder')).toBeTruthy();
        expect(getByTestId('gender-option-Male')).toBeTruthy();
        expect(getByTestId('gender-option-Female')).toBeTruthy();
        expect(getByTestId('gender-option-Non-binary')).toBeTruthy();
        expect(getByTestId('gender-option-Prefer not to say')).toBeTruthy();
        expect(getByTestId('gender-option-Other')).toBeTruthy();
    });

    it('calls onChange and closes modal, when an option is selected', () => {
        const { getByTestId, queryByTestId } = render (
            <GenderPickerInput value="" onChange={mockOnChange} />
        );

        fireEvent.press(getByTestId('gender-picker-button'));

        fireEvent.press(getByTestId('gender-option-Other'));

        expect(mockOnChange).toHaveBeenCalledWith('Other');

        // Modal should be closed again
        expect(queryByTestId('gender-option-Other')).toBeNull();
    });

    it('does not update option if no new is selected', () => {
        const { getByTestId } = render (
            <GenderPickerInput value="Other" onChange={mockOnChange} />
        );

        fireEvent.press(getByTestId('gender-picker-button'));

        fireEvent.press(getByTestId('gender-option-Other'));

        expect(mockOnChange).not.toHaveBeenCalled();
    });
});