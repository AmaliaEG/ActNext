import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, FlatList, Dimensions } from 'react-native';
import { useTheme } from '../../Themes/ThemeContext';
import { MaterialIcons } from "@expo/vector-icons";

const GENDERS = [
    {label: "-- Select Gender --", value: ""},
    {label: "Male", value: "Male"},
    {label: "Female", value: "Female"},
    {label: "Non-binary", value: "Non-binary"},
    {label: "Prefer not to say", value: "Prefer not to say"},
    {label: "Other", value: "Other"},
];

/**
 * GenderPickerInput is another custom React Native component that allows users to select their gender from a predefined list using a 
 * modal-based dropdown.
 * 
 * The selected gender is then displayed in a touchable field. When pressed, a modal opens showing all gender options. Selecting one updates
 * the selected value and closes the modal.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.value - The currently selected gender value.
 * @param {function} props.onChange - Callback to update gender.
 * @returns {JSX.Element} A gender picker input component with modal dropdown.
 * 
 * @example 
 * <GenderPickInput 
 *    value={localEdits.gender}
 *    onChange={(selected) =>
 *        setLocalEdits({ ...localEdits, gender: selected })
 *    }
 * />
 */

const GenderPickerInput = ({ value, onChange }) => {
    const { theme } = useTheme();

    const [modalVisible, setModalVisible] = useState(false);

    /**
     * Renders a single gender option row inside the modal list.
     * 
     * @param {Object} item - The gender option to render.
     * @param {string} item.label - The label shown to the user.
     * @param {string} item.value - The gender value. 
     * @returns {JSX.Element} A row with the gender label and optional checkmark.
     */

    const _renderItem = ({ item }) => {
        const isSelected = item.value === value;

        return (
            <TouchableOpacity
                onPress={() => {
                    setModalVisible(false);
                    if (item.value && item.value !== value) {
                        onChange(item.value);
                    }
                }}
                style={[
                    styles.row,
                    { borderBottomColor: theme.colors.divider},
                ]}
                testID={`gender-option-${item.value || 'placeholder'}`}
            >
                <Text style={[styles.rowText, { color: theme.colors.sheetText }]}>
                    {item.label}
                </Text>
                {isSelected && (
                    <MaterialIcons name="check" size={20} color={theme.colors.sheetBg} />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.wrapper}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Select Gender</Text>
            <TouchableOpacity
                testID='gender-picker-button'
                onPress={() => setModalVisible(true)}
                style={[styles.picker, { 
                    backgroundColor: theme.colors.boxBg,
                     borderColor: theme.colors.boxBorder, }]}>
                    <Text style={{ color: theme.colors.text, flex: 1 }}>
                        {value ? value : '-- Select Gender --'}
                    </Text>
                    <MaterialIcons name="keyboard-arrow-down" size={20} color={theme.colors.arrow} />
                </TouchableOpacity>

                <Modal
                    transparent={true}
                    visible={modalVisible}
                    animationType='fade'
                    onRequestClose={() => setModalVisible(false)}
                >
                    <Pressable
                        style={styles.backdrop}
                        onPress={() => setModalVisible(false)}
                    />

                    <View style={styles.centeredView}>
                        <View style={[styles.sheetContainer, { 
                            backgroundColor: theme.colors.sheetBg, 
                            borderColor: theme.colors.sheetBorder }]}>
                            <FlatList
                                data={GENDERS}
                                keyExtractor={(item) => item.value + item.label}
                                renderItem={_renderItem}
                                ItemSeparatorComponent={() => (
                                    <View style={{ height: 1, backgroundColor: theme.colors.sheetBg }} />
                                )}
                                ListFooterComponent={<View style={{ height: 8 }} />}
                                style={{ width: '100%' }}
                            />
                        </View>
                    </View>
                </Modal>
        </View>
    );
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
    sheetContainer: {
        width: SCREEN_WIDTH * 0.8, 
        maxHeight: '60%',
        borderRadius: 8,
        borderWidth: 1,
        overflow: 'hidden',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    wrapper: {
        marginBottom: 5,
    },
    label: {
        fontSize: 16,
        paddingBottom: 5
    },
    picker: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 5,
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    centeredView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
    },
    rowText: {
        fontSize: 16,
    },
});

export default GenderPickerInput;