import { render, fireEvent } from "@testing-library/react-native";
import GenderPickerInput from '../src/screens/burgermenu/GenderPickerInput';

describe('GenderPickerInput', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    it('renders the label', () => {
        const { getByText } = render (
            <GenderPickerInput value="male" onChange={mockOnChange} />
        );

        expect(getByText('Select Gender')).toBeTruthy();
        // expect(getByText('Male')).toBeTruthy();
        // expect(getByText('Female')).toBeTruthy();
        // expect(getByText('Non-binary')).toBeTruthy();
        // expect(getByText('Prefer not to say')).toBeTruthy();
        // expect(getByText('Other')).toBeTruthy();
    });

    it('calls onChange when a new gender is selected', () => {
        const { getByTestId } = render (
            <GenderPickerInput value="male" onChange={mockOnChange} />
        );

        fireEvent(getByTestId('gender-picker'), 'valueChange', 'Other');

        expect(mockOnChange).toHaveBeenCalledWith('Other');
    });

    it('does not change gender if no new is selected', () => {
        const { getByTestId } = render (
            <GenderPickerInput value="male" onChange={mockOnChange} />
        );

        fireEvent(getByTestId('gender-picker'), 'valueChange', undefined);
        expect(mockOnChange).not.toHaveBeenCalled();
    });
});