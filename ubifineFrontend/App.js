import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AI from './AI';
import SettingsPage from './Settings'; // Your settings page

const Stack = createStackNavigator();
import { ProfileStack } from './Profile';


const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.buttonContainer}>
          <Button
            title="Show Settings"
            onPress={() => navigation.navigate('Settings')} // Navigate to SettingsPage
          />
        </View>
        <View style={styles.buttonContainer}>
        <Button
            title="AI"
            onPress={() => navigation.navigate('AI')} // Navigate to AI
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.buttonContainer}>
          <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Button 4" onPress={() => alert('Button 4 pressed')} />
        </View>
      </View>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileStack} options={{ headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  buttonContainer: {
    margin: 10, // Adjust the margin as needed
    alignItems: 'center',
  },
  button: {
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default App;