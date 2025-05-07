import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ScrollView,
    Alert
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth0 } from 'react-native-auth0';
import DateTimePickerInput from './DateTimePickerInput';
import GenderPickerInput from './GenderPickerInput';
import useProfileStore from '../../store/useProfileStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// State hooks for storing and updating user details
const ProfileDetailsScreen = ({navigation, closeModal}) => {
    const { logout, user } = useAuth0();
    const { profile, updateProfile, resetProfile, _hasHydrated: isHydrated } = useProfileStore();

    if (!isHydrated) {
        return (
            <View style={styles.centered}>
            <Text>Loading profile details...</Text>
            </View>
        );
    }

    // Code and password is the same
    // Called different things to know which is shown on the profile description,
    // and which is used to change the code.
    const [localEdits, setLocalEdits] = useState({ ...profile });
    const [showCode, setShowCode] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // When the Profile Details Screen loads, previous stored data gets retrieved from SecureStore ONCE.
    // Updates the state, so previous data is displayed.
    useEffect(() => {
        if (user) {
            const updatedProfile = {
                name: user.name || '',
                email: user.email || '',
                ...profile
            };
            updateProfile(updatedProfile);
            setLocalEdits(updatedProfile);
        }
    }, [user]);

    useEffect(() => {
        const checkStorage = async () => {
            const current = await AsyncStorage.getItem('user-profile');
            console.log('Current storage:', current);
        };
        checkStorage();
    }, [profile]);

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
            Alert.alert('Success', 'Profile updated successfully');
            if (newPassword) {
                setNewPassword('');
                setConfirmPassword('');
            }
            const updated = await AsyncStorage.getItem('user-profile');
            console.log('Verified storage:', updated);
        } else {
            Alert.alert('Error', 'Failed to save profile');
        }
    };

    const LogoutButton = async () => {
        try {
            await logout()
            resetProfile();
            navigation.navigate('Home')
            closeModal?.();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.sectionTitle}>Profile Details</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        value={localEdits.name}
                        onChangeText={(text) => {
                            const cleaned = text.replace(/[0-9]/g, ''); // Removes all digits
                            setLocalEdits({...localEdits, name: cleaned});
                        }}
                        placeholder="Enter your name"
                    />
                </View>
    
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Birth Date</Text>
                    <DateTimePickerInput
                        value={localEdits.birthDate}
                        onChange={(date) => setLocalEdits({...localEdits, birthDate: date})}
                    />
                </View>
    
                <View style={styles.inputContainer}>
                    <GenderPickerInput
                        value={localEdits.gender}
                        onChange={(gender) => setLocalEdits({...localEdits, gender})}
                    />
                </View>
    
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={localEdits.email}
                        onChangeText={(text) => setLocalEdits({...localEdits, email: text})}
                        placeholder='Enter your email'
                    />
                </View>
    
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Code</Text>
                    <View style={styles.codeContainer}>
                        <TextInput
                            testID='password-input'
                            style={styles.codeInput}
                            value={showCode ? 
                                (isEditingPassword ? localEdits.code : profile.code)
                                 : '*'.repeat(profile.code.length)
                            }
                            onChangeText={(text) => setLocalEdits({...localEdits, code: text})}
                            editable={isEditingPassword}
                            secureTextEntry={!showCode}
                        />
                        <TouchableOpacity 
                            testID='eye-icon'
                            style={styles.eyeIcon}
                            onPress={() => setShowCode(!showCode)}
                        >
                            <Feather name={showCode ? 'eye-off' : 'eye'} size={20} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>
    
                <TouchableOpacity
                    style={styles.newPasswordSection}
                    onPress={() => setIsEditingPassword(!isEditingPassword)}
                >
                    <Text style={styles.newPasswordLabel}>New Password</Text>
                    {isEditingPassword && (
                        <>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>New Password</Text>
                                <TextInput
                                    style={styles.input}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry
                                    placeholder='New Password'
                                />
                            </View>
    
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Confirm New Password</Text>
                                <TextInput
                                    style={styles.input}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                    placeholder='Confirm New Password'
                                />
                            </View>
                        </>
                    )}
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={LogoutButton}>
                <Text style={styles.saveButtonText}>Log Out</Text>
                </TouchableOpacity>
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
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    codeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    codeInput: {
        flex: 1,
        fontSize: 16,
    },
    eyeIcon: {
        padding: 5,
    },
    newPasswordSection: {
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    newPasswordLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    saveButton: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#007BFF',
    },
    saveButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileDetailsScreen;