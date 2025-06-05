import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Pressable,
    FlatList,
    Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';

const OPTIONS = ['English', 'Danish', 'Lorem Ipsum'];

const LanguagePickerInput = ({ value, onChange }) => {
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';

    // Colors
    const boxBg = isDarkMode ? '#1E1E1E' : '#F9F9F9';
    const boxBorder = isDarkMode ? '#333333' : '#CCCCCC';
    const boxText = isDarkMode ? '#FFFFFF' : '#000000';
    const iconColor = isDarkMode ? '#FFFFFF' : '#333333';

    const sheetBg = isDarkMode ? '#1E1E1E' : '#FFFFFF';
    const sheetBorder = isDarkMode ? '#333333' : '#CCCCCC';
    const sheetText = isDarkMode ? '#FFFFFF' : '#000000';
    const dividerColor = isDarkMode ? '#444444' : '#EEEEEE';

    const [modalVisible, setModalVisible] = useState(false);

    const [selectedValue, setSelectedValue] = useState(value);

    useEffect(() => {
        setSelectedValue(value);
    }, [value]);

    const handleSelect = (lang) => {
        setSelectedValue(lang);
        onChange(lang);
        setModalVisible(false);
    };

    const renderItem = ({ item }) => {
        const isSelected = item === selectedValue;
        return (
            <TouchableOpacity
                style={[styles.row, { color: sheetText }]}
                onPress={() => handleSelect(item)}
            >
                <Text style={[styles.rowText, { color: sheetText }]}>
                    {item}
                </Text>
                {isSelected && (
                    <MaterialIcons name='check' size={20} color={sheetText} />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity
                style={[
                    styles.fakePicker,
                    {
                        backgroundColor: boxBg,
                        borderColor: boxBorder,
                    },
                ]}
                onPress={() => setModalVisible(true)}
            >
                <Text style={[styles.fakePickerText, { color: boxText }]}>
                    {selectedValue || 'Select Language'}
                </Text>
                <MaterialIcons
                    name="keyboard-arrow-down"
                    size={24}
                    color={iconColor}
                />
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
                    <View
                        style={[
                            styles.sheetContainer,
                            {
                                backgroundColor: sheetBg,
                                borderColor: sheetBorder,
                            },
                        ]}
                    >
                        <FlatList
                            data={OPTIONS}
                            keyExtractor={(item) => item}
                            renderItem={renderItem}
                            ItemSeparatorComponent={() => (
                                <View style={{ height: 1, backgroundColor: dividerColor }} />
                            )}
                            contentContainerStyle={styles.flatListContent}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 15,
    },
    fakePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 5,
    },
    fakePickerText: {
        flex: 1,
        fontSize: 16,
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
    flatListContent: {
        paddingVertical: 0,
    },
    row: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowText: {
        fontSize: 16,
    },
    pickerWrapper: {
        flex: 1,
        marginLeft: 12,
    },
    picker: {
        width: '100%',
        height: 50,
    },
});

export default LanguagePickerInput;