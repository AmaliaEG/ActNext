import React, { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';


const DateTimePickerInput = ({ value, onChange }) => {
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
            <TouchableOpacity onPress={() => setShow(true)}>
                <TextInput
                    style={styles.input}
                    value={value}
                    editable={false}
                    placeholder="DD/MM/YYYY"
                />
            </TouchableOpacity>

            { show && (
                <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleChange}
                    minimumDate={new Date(1900, 1, 1)}
                    maximumDate={new Date()}
                />
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
});

export default DateTimePickerInput;