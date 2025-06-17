import React, { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../../../Themes/ThemeContext';

/**
 * A React Native input component for selecting date using a native date picker.
 * 
 * The selected date is displayed in a formatted text input field (DD/MM/YYYY).
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.value - The currently selected date as a string.
 * @param {function} props.onChange - Callback to update the selected date.
 * @example
 * <DateTimePickerInput
 *    value={localEdits.birthDate}
 *    onChange={(date) => 
 *        setLocalEdits({ ...localEdits, birthDate: date })
 *    } 
 * />
 */

const DateTimePickerInput = ({ value, onChange }) => {
    const { theme } = useTheme();
    const [show, setShow] = useState(false);

    /**
     * Handles the change event from the native date picker.
     * 
     * @param {Object} event - The event object from the date picker. 
     * @param {Date} selectedDate - The date selected by the user.
     */

    const handleChange = (event, selectedDate) => {
        setShow(false);
        if (selectedDate) {
            const formattedDate = selectedDate.toLocaleDateString('en-GB');
            onChange(formattedDate);
        }
    };

    return (
        <View>
            <TouchableOpacity onPress={() => setShow(true)} testID="datepicker-button" >
                <TextInput
                    style={[styles.input, { 
                        backgroundColor: theme.colors.boxBg, 
                        color: theme.colors.text, 
                        borderColor: theme.colors.border }]}
                    value={value || ''}
                    editable={false}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor={theme.colors.placeholder}
                />
            </TouchableOpacity>

            { show && (
                <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleChange}
                    // The mimimum date gets updated each year
                    // Maximum age is set to 120 years old
                    minimumDate={new Date(new Date().getFullYear() - 120, 0, 1)}
                    maximumDate={new Date()}
                    testID="datepicker"
                />
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
});

export default DateTimePickerInput;