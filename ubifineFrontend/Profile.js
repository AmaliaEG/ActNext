import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ScrollView
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import React, { use, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const Stack = createStackNavigator();

const ProfileHomeScreen = ({ navigation }) => {
    // Array containing profile menu options
    const menuItems = [
        { title: 'Profile', screen: 'ProfileDetails' },
        { title: 'Language', screen: 'Language' },
        { title: 'Notifications', screen: 'Notifications' },
        { title: 'Storage and Data', screen: 'StorageAndData' },
        { title: 'About UBIFINE App', screen: 'AboutUBIFINEApp' },
    ];

    // A button is created for each item in menuItems containing a label, arrow and
    // a onPress handler that navigates to the screen of the corresponding item.
    return (
        <View style={styles.container}>
            {menuItems.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.menuItem}
                    onPress={() => navigation.navigate(item.screen)}
                >
                    <Text style={styles.menuText}>{item.title}</Text>
                    <AntDesign name="right" size={20} color="#000" />
                </TouchableOpacity>
            ))}
        </View>
    );
};

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
        </ScrollView>
    )
};

const LanguageScreen = () => {
    <View style={styles.container}>
        <Text>Language Settings</Text>
    </View>
};

const NotificationsScreen = () => {
    <View style={styles.container}>
        <Text>Notification Settings</Text>
    </View>
};

const StorageAndDataScreen = () => {
    <View style={styles.container}>
        <Text>Storage and Data Settings</Text>
    </View>
};

const AboutUBIFINEAppScreen = () => {
    <View style={styles.container}>
        <Text>About UBIFINE App</Text>
    </View>
};

// Defines the available profile screens
export const ProfileStack = () => {
    return (
        <Stack.Navigator initialRouteName="ProfileHome">
            <Stack.Screen name="ProfileHome" component={ProfileHomeScreen} options={{ title: 'Profile' }} />
            <Stack.Screen name="ProfileDetails" component={ProfileDetailsScreen} options={{ title: 'Profile Details' }} />
            <Stack.Screen name="Language" component={LanguageScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="StorageAndData" component={StorageAndDataScreen} />
            <Stack.Screen name="AboutUBIFINEApp" component={AboutUBIFINEAppScreen} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    menuText: {
        fontSize: 16,
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