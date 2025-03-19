import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './App'; // Your main screen with the buttons
import SettingsPage from './Settings'; // Your settings page
import AI from './AI'; // Your AI page
import { ProfileHomeScreen, ProfileDetailsScreen, LanguageScreen, NotificationsScreen, StorageAndDataScreen, AboutUBIFINEAppScreen } from './Profile';

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsPage} />
        <Stack.Screen name="AI" component={AI} />
        <Stack.Screen name="ProfileHome" component={ProfileHomeScreen} options={{ title: 'Profile' }} />
        <Stack.Screen name="ProfileDetails" component={ProfileDetailsScreen} options={{ title: 'Profile Details' }} />
        <Stack.Screen name="Language" component={LanguageScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="StorageAndData" component={StorageAndDataScreen} />
        <Stack.Screen name="AboutUBIFINEApp" component={AboutUBIFINEAppScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;