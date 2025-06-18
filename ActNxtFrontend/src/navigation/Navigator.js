/**
 * @file Navigator.js
 * @description
 * Sets up the app's main navigation structure using a Drawer navigator.
 * Wraps the entire navigation in a ThemeProvider and Auth0Provider, and defines a custom drawer content component (CustomDrawerContent)
 * that renders the app logo, navigation links, and a settings modal.
 * 
 * @module Navigator
 * @author s224837
 * @since 2025-17-03
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import LoginPage from '../screens/Pages/LoginPage'; 
import Feed from '../screens/Pages/Feed'; 
import AboutACTNXTAppScreen from '../screens/burgermenu/settingComponents/AboutACTNXTAppScreen';
import ProfileDetailsScreen from '../screens/burgermenu/settingComponents/ProfileDetailsScreen';
import SettingsScreen from '../screens/burgermenu/SettingsScreen';
import TaskExpansion from '../screens/Pages/TaskExpansion';
import ThemesScreen from '../screens/burgermenu/settingComponents/ThemesScreen';
import StarredTasks from '../screens/Pages/StarredTasks';
import ArchivedTasks from '../screens/Pages/ArchivedTasks';
import { Auth0Provider} from 'react-native-auth0';
import { useTheme, ThemeProvider } from '../Themes/ThemeContext';
import { Styles } from '../screens/Pages/Styles';

const Drawer = createDrawerNavigator();

/**
 * Custom drawer content component - renders the app logo, navigation items (Insights, Favorites and Archive),
 * and a settings button that toggles a modal with the SettingsScreen.
 * 
 * @component
 * @param {object} props - Props inserted by the Drawer navigator. 
 * @param {object} props.navigation - Navigation object for screen transitions.
 * @returns {JSX.Element}
 */

const CustomDrawerContent = (props) => {
  // Get the resolved theme
  const { theme } = useTheme();
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [activeSettingScreen, setActiveSettingScreen] = useState(null);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: theme.colors.background }}>
        {/* Header with logo and name */}
        <View style={[Styles.drawerHeader, { borderBottomColor: theme.colors.borderColor }]}>
          <Image source={require('../../assets/icon.png')} style={Styles.drawerLogo} resizeMode="contain" />
          <Text style={[Styles.drawerTitle, { color: theme.colors.itemTextColor }]}>
            <Text style={[Styles.drawerTitleAct, { color: theme.colors.itemTextColor }]}>act</Text>
            <Text style={[Styles.drawerTitleNxt, { color: theme.colors.itemTextColor }]}>nxt</Text>
          </Text>
        </View>

        <DrawerItem label="Insights" labelStyle={{ color: theme.colors.itemTextColor }} onPress={() => props.navigation.navigate('Feed')}/>
        <DrawerItem label="Favorites" labelStyle={{ color: theme.colors.itemTextColor }} onPress={() => props.navigation.navigate('StarredTasks')}/>
        <DrawerItem label="Archive" labelStyle={{ color: theme.colors.itemTextColor }} onPress={() => props.navigation.navigate('ArchivedTasks')}/>
      </DrawerContentScrollView>

      <View style={Styles.gearWrapper}>
        <TouchableOpacity
          onPress={() => {
            setSettingsModalVisible(true);
            setActiveSettingScreen(null); // Reset screen
          }}
          style={[Styles.gearButton, {backgroundColor: theme.colors.gearBg, shadowColor: theme.isDark}]}
          testID='settings-button'
        >
          <MaterialIcons name="settings" size={24} color={theme.colors.gearIconColor} testID="icon-settings"/>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={settingsModalVisible}
        onBackdropPress={() => setSettingsModalVisible(false)}
        style={{ margin: 0, justifyContent: 'flex-end' }}
      >
        <View style={[Styles.modalContainer, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.borderColor }]}>
            <SettingsScreen props={props} closeModal={() => setSettingsModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

/**
 * Main Navigator component - Wraps the app in ThemeProvider and Auth0Provider, then sets up a drawer navigatorwith all the screens:
 * Home/Login, Feed, Details, Settings, Stared and Archived.
 * 
 * @component
 * @returns {JSX.Element}
 * @author S235251
 */
const Navigator = () => {
  return (
    <ThemeProvider>
    <Auth0Provider domain={"dev-actnxt.eu.auth0.com"} clientId={"7PV7PugpQ9TR2pYdHjYpvjiQC85rUb5J"} >
       {/* <- Add this around NavigationContainer */}
        <NavigationContainer>
          <Drawer.Navigator
            screenOptions={{ drawerType: 'slide', drawerStyle: { width: '75%' }, headerShown: false }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
          >
            <Drawer.Screen name="Home" component={LoginPage} />
            <Drawer.Screen name="Feed" component={Feed} options={{ headerShown: false }} />
            <Drawer.Screen name="Details" component={TaskExpansion} />
            <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
            <Drawer.Screen name="StarredTasks" component={StarredTasks} />
            <Drawer.Screen name="ArchivedTasks" component={ArchivedTasks} />
          </Drawer.Navigator>
        </NavigationContainer>
       {/* <- Close it here */}
    </Auth0Provider>
    </ThemeProvider>
  );
};


export { CustomDrawerContent };
export default Navigator;