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
import useAuthStore from '../../store/useAuthStore';
import { useTheme } from '../../Themes/ThemeContext';

/**
 * ProfileDetailsScreen allows the user to view and update their profile information, including name, birth date, gender, email, and password.
 * 
 * It uses custom input components for birth date and gender, and handles both viewing and editing of a secure password.
 * 
 * Furthermore, the initial information is retrieved from the useProfileStore, to which the authentication has persisted there.
 * 
 * @component
 * @param {Object} props - The props passed to the screen.
 * @param {object} props.navigation - Navigation prop for screen transitions.
 * @param {function} [props.closeModal] - Optional callback to close the Modal. 
 * @returns {JSX.Element} A scrollable screen for managing user profile details.
 * 
 * @example
 * <ProfileDetailsScreen
 *    navigation={navigation}
 *    closeModal={() => setModalVisible(false)}
 * />
 */

// State hooks for storing and updating user details
const ProfileDetailsScreen = ({navigation, closeModal}) => {
    const {theme} = useTheme();   

    const { clearSession, user } = useAuth0();
    const { profile, updateProfile, resetProfile, hydrated } = useProfileStore();
    const { logout} = useAuthStore();

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
                name: profile?.name || '',
                birthDate: profile?.birthDate || '',
                gender: profile?.gender || '',
                email: profile?.email || '',
                code: profile?.code || '',
                ...profile
            };
            updateProfile(updatedProfile);
            setLocalEdits(updatedProfile);
        }
    }, [hydrated, user]);

    /**
     * Validates an email address using a regular expression.
     * 
     * @param {string} email - The email address to validate. 
     * @returns {boolean} Returns true if the email format is valid, false otherwise.
     */

    const isValidEmail = (email) => {
        let val = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        return val.test(email);
    };

    /**
     * Saves changes made to the user profile.
     * 
     * Performs validation on email and password confirmation. If valid, it updates the profile using the local edits and clears any
     * temporary password fields.
     * 
     * @async
     * @returns {Promise<void>}
     */

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

    /**
     * Logs the user out of the application.
     * 
     * Clears the Auth0 session, resets the local profile store, logs out from the auth store, navigates to the Home screen, and optionally
     * closes the Modal.
     * 
     * @async
     * @returns {Promise<void>}
     */

    const LogoutFunc= async () => {
        try {
            await clearSession();
            resetProfile();
            logout();
            navigation.navigate('Home')
            closeModal?.();
        } catch (e) {
            console.log(e);
        }
    };

    if (!hydrated) {
        return (
            <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.text} />
                <Text style={{ color: theme.colors.text, marginTop: 8 }}>Loading profile...</Text>
            </View>
        );
    }
    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Profile Details</Text>
            <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Name</Text>
                <TextInput
                    style={[styles.input, {
                        backgroundColor: theme.colors.inputBg,
                        color: theme.colors.inputText,
                        borderColor: theme.colors.border
                    }]}
                    value={localEdits.name}
                    onChangeText={(text) => {
                        const cleaned = text.replace(/[0-9]/g, ''); // Remove digits
                        setLocalEdits({ ...localEdits, name: cleaned });
                    }}
                    placeholder="Enter your name"
                    placeholderTextColor={theme.colors.placeholder}
                />
            </View>
    
            <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Birth Date</Text>
                <DateTimePickerInput
                    value={localEdits.birthDate}
                    onChange={(date) => setLocalEdits({ ...localEdits, birthDate: date })}
                    mode="date"
                    textStyle={{ color: theme.colors.inputText }}
                    placeholderTextColor={theme.colors.placeholder}
                />
            </View>
    
                <View style={styles.inputContainer}>
                    <GenderPickerInput
                        value={localEdits.gender}
                        onChange={(gender) => setLocalEdits({...localEdits, gender})}
                        textStyle={{ color: theme.colors.inputText }}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>Email</Text>
                    <TextInput
                        style={[styles.input, {
                            backgroundColor: theme.colors.inputBg,
                            color: theme.colors.inputText,
                            borderColor: theme.colors.border
                        }]}
                        value={localEdits.email}
                        onChangeText={(text) => setLocalEdits({ ...localEdits, email: text })}
                        placeholder="Enter your email"
                        placeholderTextColor={theme.colors.placeholder}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
        
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Code</Text>
                <View style={[styles.codeContainer, {
                    backgroundColor: theme.colors.inputBg,
                    borderColor: theme.colors.border
                }]}>
                    <TextInput
                        testID="password-input"
                        style={[styles.codeInput, {
                            backgroundColor: theme.colors.inputBg,
                            borderColor: theme.colors.border,
                            color: theme.colors.inputText
                        }]}
                        value={showCode ? (isEditingPassword ? localEdits.code : profile.code) : '*'.repeat((profile.code || '').length)}
                        onChangeText={(text) => setLocalEdits({ ...localEdits, code: text })}
                        editable={isEditingPassword}
                        secureTextEntry={!showCode}
                        placeholder="******"
                        placeholderTextColor={theme.colors.placeholder}
                    />
                    <TouchableOpacity
                        testID="eye-icon"
                        style={styles.eyeIcon}
                        onPress={() => setShowCode(!showCode)}
                    >
                        <Feather name={showCode ? 'eye-off' : 'eye'} size={20} color={theme.colors.inputText} />
                    </TouchableOpacity>
                </View>
            </View>

                <TouchableOpacity
                    style={[styles.newPasswordSection, {
                        backgroundColor: theme.colors.inputBg, 
                        borderColor: theme.colors.border }]}
                    onPress={() => setIsEditingPassword(!isEditingPassword)}
                >
                    <Text style={[styles.newPasswordLabel, { color: theme.colors.text }]}>New Password</Text>
                    {isEditingPassword && (
                        <>
                            <View style={styles.inputContainer}>
                                <Text style={[styles.label, { color: theme.colors.text }]}>New Password</Text>
                                <TextInput
                                    style={[styles.input, { 
                                        backgroundColor: theme.colors.inputBg, 
                                        color: theme.colors.inputText, 
                                        borderColor: theme.colors.border }]}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry
                                    placeholder='New Password'
                                    placeholderTextColor={theme.colors.placeholder}
                                />
                            </View>
    
                            <View style={styles.inputContainer}>
                                <Text style={[styles.label, { color: theme.colors.text }]}>Confirm New Password</Text>
                                <TextInput
                                    style={[styles.input, { 
                                        backgroundColor: theme.colors.inputBg, 
                                        color: theme.colors.inputText, 
                                        borderColor: theme.colors.border }]}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                    placeholder='Confirm New Password'
                                    placeholderTextColor={theme.colors.placeholder}
                                />
                            </View>
                        </>
                    )}
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.saveButton, { 
                    backgroundColor: theme.colors.primary, 
                    borderColor: theme.colors.buttonBorder }]}
                    onPress={handleSaveChanges}>
                    <Text style={[styles.saveButtonText, { color: theme.colors.buttonText }]}>Save Changes</Text>
                </TouchableOpacity>
                
                <View>
                    {user ? (
                        <>
                            <TouchableOpacity
                                style={[styles.saveButton, { 
                                    backgroundColor: theme.colors.primary, 
                                    borderColor: theme.colors.buttonBorder, 
                                    marginTop: 12 }]}
                                onPress={LogoutFunc}
                            >
                            <Text style={[styles.saveButtonText, { color: theme.colors.buttonText }]}>Log Out</Text>
                            </TouchableOpacity>
                        </>
                    ):(
                        <>
                            <Text style={{ color: theme.colors.text, marginTop: 12 }}> Not logged in to any user </Text>
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