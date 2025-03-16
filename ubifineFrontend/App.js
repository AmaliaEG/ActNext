import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsPage from './Settings'; // Your settings page

const Stack = createStackNavigator();


export default function App( {navigation}) {
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
          <Button title="Button 2" onPress={() => alert('Button 2 pressed')} />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.buttonContainer}>
          <Button title="Button 3" onPress={() => alert('Button 3 pressed')} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Button 4" onPress={() => alert('Button 4 pressed')} />
        </View>
      </View>
    </View>
  );
}

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
  },
});
