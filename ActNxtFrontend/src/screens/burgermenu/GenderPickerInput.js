import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, FlatList, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
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

const GenderPickerInput = ({ value, onChange }) => {
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';

    // Colors for the box
    const boxBgColor = isDarkMode ? '#1E1E1E' : '#FFFFFF';
    const boxTextColor = value ? (isDarkMode ? '#FFFFFF' : '#000000') : (isDarkMode ? '#AAAAAA' : '#666666') ;
    const boxBorderColor = isDarkMode ? '#444444' : '#CCCCCC';
    const arrowColor = isDarkMode ? '#AAA' : '#555';
    
    // Colors for the dropdown sheet
    const sheetBg = isDarkMode ? '#2A2A2A' : '#FFFFFF';
    const sheetTextColor = isDarkMode ? '#FFFFFF' : '#000000';
    const sheetBorderColor = isDarkMode ? '#444444' : '#DDDDDD';
    const dividerColor = isDarkMode ? '#333333': '#EEEEEE';

    const [modalVisible, setModalVisible] = useState(false);

    // Render a single row in the sheet
    const _renderItem = ({ item }) => {
        const isSelected = item.value === value;

        return (
            <TouchableOpacity
                onPress={() => {
                    onChange(item.value);
                    setModalVisible(false);
                }}
                style={[
                    styles.row,
                    { borderBottomColor: dividerColor },
                ]}
                testID={`gender-option-${item.value || 'placeholder'}`}
            >
                <Text style={[styles.rowText, { color: sheetTextColor }]}>
                    {item.label}
                </Text>
                {isSelected && (
                    <MaterialIcons name="check" size={20} color={sheetTextColor} />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.wrapper}>
            <Text style={[styles.label, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Select Gender</Text>
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={[styles.picker, { backgroundColor: boxBgColor, borderColor: boxBorderColor }]}>
                    <Text style={{ color: boxTextColor, flex: 1 }}>
                        {value ? value : '-- Select Gender --'}
                    </Text>
                    <MaterialIcons name="keyboard-arrow-down" size={20} color={arrowColor} />
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
                        <View style={[styles.sheetContainer, { backgroundColor: sheetBg, borderColor: sheetBorderColor }]}>
                            <FlatList
                                data={GENDERS}
                                keyExtractor={(item) => item.value + item.label}
                                renderItem={_renderItem}
                                ItemSeparatorComponent={() => (
                                    <View style={{ height: 1, backgroundColor: dividerColor }} />
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