import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/demo menu/App'; // Your main screen with the buttons
import SettingsPage from '../screens/Settings/Settings'; // Your settings page
import Feed from '../screens/mainPage/Feed'; // Your Feed page
import LanguageScreen from '../screens/burgermenu/LanguageScreen';
import NotificationsScreen from '../screens/burgermenu/NotificationsScreen';
import StorageAndDataScreen from '../screens/burgermenu/StorageAndDataScreen';
import AboutACTNXTAppScreen from '../screens/burgermenu/AboutACTNXTAppScreen';
import ProfileDetailsScreen from '../screens/burgermenu/ProfileDetailsScreen';
import BurgerMenuScreen from '../screens/burgermenu/BurgerMenuScreen';
import DetailsScreen from '../screens/mainPage/DetailsScreen';

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsPage} />
        <Stack.Screen name="Feed" component={Feed} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Menu" component={BurgerMenuScreen} options={{ title: 'Menu' }} />
        <Stack.Screen name="ProfileDetails" component={ProfileDetailsScreen} options={{ title: 'Profile Details' }} />
        <Stack.Screen name="Language" component={LanguageScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="StorageAndData" component={StorageAndDataScreen} />
        <Stack.Screen name="AboutACTNXTApp" component={AboutACTNXTAppScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;