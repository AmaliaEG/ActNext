import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const GenderPickerInput = ({ value, onChange }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Select Gender</Text>
            <Picker
                selectedValue={value}
                onValueChange={(newValue) => {
                    if (newValue !== undefined) {
                        onChange(newValue);
                    }
                }}
                style={styles.picker}
                testID="gender-picker"
            >
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Non-binary" value="Non-binary" />
                <Picker.Item label="Prefer not to say" value="Prefer not to say" />
                <Picker.Item label="Other" value="Other" />
            </Picker>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    picker: {
        height: 50,
        width: '100%',
    },
});

export default GenderPickerInput;