import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import App from '../screens/demo menu/App'; // Your main screen with the buttons
// import SettingsPage from '../screens/Settings/Settings'; // Your settings page
import Feed from '../screens/mainPage/Feed'; // Your Feed page
import LanguageScreen from '../screens/burgermenu/LanguageScreen';
import NotificationsScreen from '../screens/burgermenu/NotificationsScreen';
import StorageAndDataScreen from '../screens/burgermenu/StorageAndDataScreen';
import AboutACTNXTAppScreen from '../screens/burgermenu/AboutACTNXTAppScreen';
import ProfileDetailsScreen from '../screens/burgermenu/ProfileDetailsScreen';
import SettingsScreen from '../screens/burgermenu/SettingsScreen';
import DetailsScreen from '../screens/mainPage/DetailsScreen';

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={App} />
        {/* <Stack.Screen name="Settings" component={SettingsPage} /> */}
        <Stack.Screen name="Feed" component={Feed} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: 'Settings' }} />
        <Stack.Screen name="ProfileDetails" component={ProfileDetailsScreen} options={{ title: 'Profile Details' }} />
        <Stack.Screen name="Language" component={LanguageScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="StorageAndData" component={StorageAndDataScreen} />
        <Stack.Screen name="AboutACTNXTApp" component={AboutACTNXTAppScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Settings"
        onPress={() => props.navigation.navigate('SettingsScreen')}
      />
    </DrawerContentScrollView>
  );
};

export default Navigator;