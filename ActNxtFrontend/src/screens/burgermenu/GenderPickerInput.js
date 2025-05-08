import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const GenderPickerInput = ({ value, onChange }) => {
    return (
        <View style={styles.wrapper}>
            <Text style={styles.label}>Select Gender</Text>
            <View style={styles.container}>
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
                    <Picker.Item label="-- Select Gender --" value="" />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Non-binary" value="Non-binary" />
                    <Picker.Item label="Prefer not to say" value="Prefer not to say" />
                    <Picker.Item label="Other" value="Other" />
                </Picker>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    wrapper: {
        marginBottom: 5,
    },
    label: {
        fontSize: 16,
        paddingBottom: 5
    },
    picker: {
        height: 50,
        width: '100%',
    },
});

export default GenderPickerInput;