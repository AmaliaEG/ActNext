import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Feed from '../mainPage/Feed';
import DetailsScreen from '../mainPage/DetailsScreen';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsPage from '../Settings/Settings'; // Your settings page

const Stack = createStackNavigator();
import { ProfileStack } from '../burgermenu/BurgerMenuScreen';


const App = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.buttonContainer}>
          <Button
            title="Show Settings"
            onPress={() => navigation.navigate('Settings')} 
          />
        </View>
        <View style={styles.buttonContainer}>
        <Button
            title="Feed"
            onPress={() => navigation.navigate('Feed')}
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.buttonContainer}>
          <Button title="BurgerMenu" onPress={() => navigation.navigate('Menu')} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Button 4" onPress={() => alert('Button 4 pressed')} />
        </View>
      </View>
    </View>
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
    margin: 10, 
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