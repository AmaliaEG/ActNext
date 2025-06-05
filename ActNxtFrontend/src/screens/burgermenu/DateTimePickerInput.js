import React, { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useTheme } from "./ThemeContext";


const DateTimePickerInput = ({ value, onChange }) => {
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';

    // Colors
    const bgColor = isDarkMode ? '#1E1E1E' : '#FFFFFF';
    const textColor = isDarkMode ? '#FFFFFF' : '#000000';
    const borderColor = isDarkMode ? '#444444' : '#CCCCCC';
    const placeholderColor = isDarkMode ? '#AAAAAA' : '#666666';

    const [show, setShow] = useState(false);

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
                    style={[styles.input, { backgroundColor: bgColor, color: textColor, borderColor: borderColor }]}
                    value={value || ''}
                    editable={false}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor={placeholderColor}
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