import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ScrollView,
    Alert,
    ActivityIndicator
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth0 } from 'react-native-auth0';
import DateTimePickerInput from './DateTimePickerInput';
import GenderPickerInput from './GenderPickerInput';
import useProfileStore from '../../store/useProfileStore';
import { useTheme } from './ThemeContext';

// State hooks for storing and updating user details
const ProfileDetailsScreen = ({navigation, closeModal}) => {
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';

    // Colors
    const bgColor = isDarkMode ? '#1E1E1E' : '#FFFFFF';
    const textColor = isDarkMode ? '#FFFFFF' : '#000000';
    const borderColor = isDarkMode ? '#444444' : '#CCCCCC';
    const inputBg = isDarkMode ? '#1E1E1E' : '#F9F9F9';
    const inputTextColor = isDarkMode ? '#FFFFFF' : '#000000';
    const placeholderColor = isDarkMode ? '#AAAAAA' : '#666666';
    const btnBg = isDarkMode ? '#2A2A2A' : '#FFFFFF';
    const btnBorder = isDarkMode ? '#555555' : '#007BFF';
    const btnTextColor = isDarkMode ? '#FFFFFF' : '#007BFF';

    const { logout, user } = useAuth0();
    const { profile, updateProfile, resetProfile, hydrated } = useProfileStore();

    // Code and password is the same
    // Called different things to know which is shown on the profile description,
    // and which is used to change the code.
    const [localEdits, setLocalEdits] = useState({ ...profile });
    const [showCode, setShowCode] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (hydrated && user) {
            const updatedProfile = {
                name: user.name || '',
                birthDate: profile?.birthDate || '',
                gender: profile?.gender || '',
                email: user.email || '',
                code: profile?.code || '',
                ...profile
            };
            updateProfile(updatedProfile);
            setLocalEdits(updatedProfile);
        }
    }, [hydrated, user]);

    const isValidEmail = (email) => {
        let val = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        return val.test(email);
    };

    const handleSaveChanges = async () => {
        // Check for valid email
        if (!isValidEmail(localEdits.email)) {
            Alert.alert('Error','Please enter a valid email address.');
            return;
        }

        if (newPassword && newPassword !== confirmPassword) {
            Alert.alert('Error','Passwords do not match');
            return;
        }

        const success = await updateProfile({
            ...localEdits,
            code: newPassword || profile.code
        });

        if (success) {
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    const LogoutFunc= async () => {
        try {
            await clearSession();
            resetProfile();
            navigation.navigate('Home')
            closeModal?.();
        } catch (e) {
            console.log(e);
        }
    };

    if (!hydrated) {
        return (
            <View style={[styles.centered, { backgroundColor: bgColor }]}>
                <ActivityIndicator size="large" color={textColor} />
                <Text style={{ color: textColor, marginTop: 8 }}>Loading profile...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: bgColor }]}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>Profile Details</Text>
                <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: textColor }]}>Name</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: inputBg, color: inputTextColor, borderColor: borderColor }]}
                        value={localEdits.name}
                        onChangeText={(text) => {
                            const cleaned = text.replace(/[0-9]/g, ''); // Removes all digits
                            setLocalEdits({...localEdits, name: cleaned});
                        }}
                        placeholder="Enter your name"
                        placeholderTextColor={placeholderColor}
                    />
                </View>
    
                <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: textColor }]}>Birth Date</Text>
                    <DateTimePickerInput
                        value={localEdits.birthDate}
                        onChange={(date) => setLocalEdits({...localEdits, birthDate: date})}
                        mode="date"
                        textStyle={{ color: inputTextColor }}
                        placeholderTextColor={placeholderColor}
                    />
                </View>
    
                <View style={styles.inputContainer}>
                    <GenderPickerInput
                        value={localEdits.gender}
                        onChange={(gender) => setLocalEdits({...localEdits, gender})}
                        textStyle={{ color: inputTextColor }}
                    />
                </View>
    
                <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: textColor }]}>Email</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: inputBg, color: inputTextColor, borderColor: borderColor }]}
                        value={localEdits.email}
                        onChangeText={(text) => setLocalEdits({...localEdits, email: text})}
                        placeholder='Enter your email'
                        placeholderTextColor={placeholderColor}
                        keyboardType='email-address'
                        autoCapitalize='none'
                    />
                </View>
    
                <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: textColor }]}>Code</Text>
                    <View style={[styles.codeContainer, { backgroundColor: inputBg, borderColor: borderColor }]}>
                        <TextInput
                            testID='password-input'
                            style={[styles.codeInput, { backgroundColor: inputBg, borderColor: borderColor, color: inputTextColor }]}
                            value={showCode ? 
                                (isEditingPassword ? localEdits.code : profile.code)
                                 : '*'.repeat((profile.code || '').length)
                            }
                            onChangeText={(text) => setLocalEdits({...localEdits, code: text})}
                            editable={isEditingPassword}
                            secureTextEntry={!showCode}
                            placeholder='******'
                            placeholderTextColor={placeholderColor}
                        />
                        <TouchableOpacity 
                            testID='eye-icon'
                            style={styles.eyeIcon}
                            onPress={() => setShowCode(!showCode)}
                        >
                            <Feather name={showCode ? 'eye-off' : 'eye'} size={20} color={inputTextColor} />
                        </TouchableOpacity>
                    </View>
                </View>
    
                <TouchableOpacity
                    style={[styles.newPasswordSection, {backgroundColor: inputBg, borderColor: borderColor }]}
                    onPress={() => setIsEditingPassword(!isEditingPassword)}
                >
                    <Text style={[styles.newPasswordLabel, { color: textColor }]}>New Password</Text>
                    {isEditingPassword && (
                        <>
                            <View style={styles.inputContainer}>
                                <Text style={[styles.label, { color: textColor }]}>New Password</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: inputBg, color: inputTextColor, borderColor: borderColor }]}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry
                                    placeholder='New Password'
                                    placeholderTextColor={placeholderColor}
                                />
                            </View>
    
                            <View style={styles.inputContainer}>
                                <Text style={[styles.label, { color: textColor }]}>Confirm New Password</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: inputBg, color: inputTextColor, borderColor: borderColor }]}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                    placeholder='Confirm New Password'
                                    placeholderTextColor={placeholderColor}
                                />
                            </View>
                        </>
                    )}
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.saveButton, { backgroundColor: btnBg, borderColor: btnBorder }]} onPress={handleSaveChanges}>
                    <Text style={[styles.saveButtonText, { color: btnTextColor }]}>Save Changes</Text>
                </TouchableOpacity>
                
                <View>
                    {user ? (
                        <>
                            <TouchableOpacity
                                style={[styles.saveButton, { backgroundColor: btnBg, borderColor: btnBorder, marginTop: 12 }]}
                                onPress={LogoutFunc}
                            >
                            <Text style={[styles.saveButtonText, { color: btnTextColor }]}>Log Out</Text>
                            </TouchableOpacity>
                        </>
                    ):(
                        <>
                            <Text style={{ color: textColor, marginTop: 12 }}> Not logged in to any user </Text>
                        </>
                    )}
                </View>
            </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    codeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        padding: 0,
        overflow: 'hidden',
    },
    codeInput: {
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 5,
    },
    eyeIcon: {
        padding: 12,
    },
    newPasswordSection: {
        marginBottom: 15,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    newPasswordLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    saveButton: {
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        borderWidth: 1,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileDetailsScreen;