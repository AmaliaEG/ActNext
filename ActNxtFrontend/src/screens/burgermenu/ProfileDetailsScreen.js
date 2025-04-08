import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ScrollView
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
import {useAuth0, Auth0Provider} from 'react-native-auth0';

// State hooks for storing and updating user details
const ProfileDetailsScreen = () => {
    const [name, setName] = useState('John Doe');
    const [birthDate, setBirthDate] = useState('DD/MM/YYYY');
    const [gender, setGender] = useState('Male');
    const [email, setEmail] = useState('john.doe@example.com');
    // Code and password is the same
    // Called different things to know which is shown on the profile description,
    // and which is used to change the code.
    const [code, setCode] = useState('123456');
    const [showCode, setShowCode] = useState(false);
    const [isEditindPassword, setIsEditingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const {user, error} = useAuth0();

    // When the Profile Details Screen loads, previous stored data gets retrieved from SecureStore ONCE.
    // Updates the state, so previous data is displayed.
    useEffect(() => {
        const loadProfileData = async () => {
            try {
                const savedName = await SecureStore.getItemAsync('name');
                const savedBirthDate = await SecureStore.getItemAsync('birthDate');
                const savedGender = await SecureStore.getItemAsync('gender');
                const savedEmail = await SecureStore.getItemAsync('email');
                const savedCode = await SecureStore.getItemAsync('code');


                if (savedName) setName(savedName);
                if (savedBirthDate) setBirthDate(savedBirthDate);
                if (savedGender) setGender(savedGender);
                if (savedEmail) setEmail(savedEmail);
                if (savedCode) setCode(savedCode);
            } catch (error) {
                console.error('Failed to load profile data:', error);
            }
        };

        loadProfileData();
    }, []);
    
    const handleSaveChanges = async () => {
        try {
            // Save profile data
            await SecureStore.setItemAsync('name', name);
            await SecureStore.setItemAsync('birthDate', birthDate);
            await SecureStore.setItemAsync('gender', gender);
            await SecureStore.setItemAsync('email', email);

            // Save new password if provided and confirmed
            if (newPassword && newPassword === confirmPassword) {
                await SecureStore.setItemAsync('code', newPassword);
                setCode(newPassword);
                console.log('Password changed Succesfully');
                // Clear the fields after confirmation
                setNewPassword('');
                setConfirmPassword('');
            } else if (newPassword !== confirmPassword) {
                console.error('New password and the confirmed password do not match');
                return;
            }

            console.log('Changes saved:', { name, birthDate, gender, email, code });
        } catch (error) {
            console.error('Failed to save profile data:', error);
        }
    };

    return (
        <>
            {user && <LoggedInDetails/>}
            {!user && <Text>Not logged in</Text>}
            {error && <Text>{error.message}</Text>}
        </>
    )
};

const LoggedInDetails = () => {
    return (
        <Auth0Provider domain={"dev-actnxt.eu.auth0.com"} clientId={"7PV7PugpQ9TR2pYdHjYpvjiQC85rUb5J"}>
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.sectionTitle}>Profile Details</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Birth Date</Text>
                <TextInput
                    style={styles.input}
                    value={birthDate}
                    onChangeText={setBirthDate}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Gender</Text>
                <TextInput
                    style={styles.input}
                    value={gender}
                    onChangeText={setGender}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Code</Text>
                <View style={styles.codeContainer}>
                    <TextInput
                        style={styles.codeInput}
                        value={showCode ? code : '*'.repeat(code.length)}
                        onChangeText={setCode}
                        editable={isEditindPassword}
                        secureTextEntry={!showCode}
                    />
                    <TouchableOpacity 
                        style={styles.eyeIcon}
                        onPress={() => setShowCode(!showCode)}
                    >
                        <Feather name={showCode ? 'eye-off' : 'eye'} size={20} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                style={styles.newPasswordSection}
                onPress={() => setIsEditingPassword(!isEditindPassword)}
            >
                <Text style={styles.newPasswordLabel}>New Password</Text>
                {isEditindPassword && (
                    <>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>New Password</Text>
                            <TextInput
                                style={styles.input}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Confirm New Password</Text>
                            <TextInput
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                            />
                        </View>
                    </>
                )}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <LogoutButton/>
        </ScrollView>
    </Auth0Provider>
    )
}

const LogoutButton = () => {
    const {clearSession} = useAuth0();

    const onPress = async () => {
        try {
            await clearSession();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <TouchableOpacity style={styles.saveButton} onPress={onPress}>
        <Text style={styles.saveButtonText}>Log Out</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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