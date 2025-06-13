import React from 'react';
import { render, fireEvent } from "@testing-library/react-native";
import DateTimePickerInput from '../src/screens/burgermenu/DateTimePickerInput';

jest.mock('@react-native-community/datetimepicker', () => {
    const React = require('react');
    return ({ testID, onChange }) => 
        React.createElement('View', {
            testID,
            onChange,
        });
});

jest.mock('../src/Themes/ThemeContext', () => ({
    useTheme: () => ({
        theme: {
            colors: {
                boxBg: '#FFFFFF',
                text: '#000000',
                placeholder: '#666666',
                border: '#CCCCCC'
            },
        },
    }),
}));

describe('DateTimePickerInput', () => {
    const mockValue = "01/01/2000";
    const mockOnChange = jest.fn();

    beforeEach(() => {
        // Ensures that previous calls don't interfere (prevents false positives)
        mockOnChange.mockClear();
    });
    
    it('renders the input value correctly', () => {
        const { getByDisplayValue } = render(
            <DateTimePickerInput value={mockValue} onChange={mockOnChange}/>
        );
        expect(getByDisplayValue(mockValue)).toBeTruthy();
    });

    it('shows DateTimePicker when pressed', () => {
        const { queryByTestId } = render(
            <DateTimePickerInput value={mockValue} onChange={mockOnChange}/>
        );
        expect(queryByTestId('datepicker')).toBeNull();
        fireEvent.press(queryByTestId('datepicker-button'));
        expect(queryByTestId('datepicker')).toBeTruthy();
    });

    it('updates date to the selected date', () => {
        const { getByTestId } = render(
            <DateTimePickerInput value={mockValue} onChange={mockOnChange}/>
        );
        fireEvent.press(getByTestId('datepicker-button'));

        const newDate = new Date(2020, 0, 1);
        const expectedDate = newDate.toLocaleDateString('en-GB');

        fireEvent(getByTestId('datepicker'), 'onChange', null, newDate);

        expect(mockOnChange).toHaveBeenCalledWith(expectedDate);
    });

    it('does not update date if no date is selected', () => {
        const { getByTestId } = render(
            <DateTimePickerInput value={mockValue} onChange={mockOnChange}/>
        );
        fireEvent.press(getByTestId('datepicker-button'));
        fireEvent(getByTestId('datepicker'), 'onChange', null, undefined);
        expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('applies the theme colors', () => {
        const { getByTestId } = render(
            <DateTimePickerInput value={mockValue} onChange={mockOnChange} />
        );
        const input = getByTestId('datepicker-button').findByType('TextInput');

        expect(input).toHaveStyle({
            backgroundColor: '#FFFFFF',
            color: '#000000',
            borderColor: '#CCCCCC',
        });

        // Check placeholder value
        expect(input.props.placeholderTextColor).toBe('#666666');
    });
});