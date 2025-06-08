import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import App from '../screens/demo_menu/App'; // Your main screen with the buttons
import Feed from '../screens/mainPage/Feed'; // Your Feed page
import LanguageScreen from '../screens/burgermenu/LanguageScreen';
import NotificationsScreen from '../screens/burgermenu/NotificationsScreen';
import AboutACTNXTAppScreen from '../screens/burgermenu/AboutACTNXTAppScreen';
import ProfileDetailsScreen from '../screens/burgermenu/ProfileDetailsScreen';
import SettingsScreen from '../screens/burgermenu/SettingsScreen';
import TaskExpansion from '../screens/mainPage/TaskExpansion';
import ThemesScreen from '../screens/burgermenu/ThemesScreen';
import StarredTasks from '../screens/burgermenu/StarredTasks';
import ArchivedTasks from '../screens/burgermenu/ArchivedTasks';
import {useAuth0, Auth0Provider} from 'react-native-auth0';
import { ThemeProvider, useTheme } from '../Themes/ThemeContext';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  // Get the resolved theme
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  // Colors
  const bgColor = isDarkMode ? '#121212' : '#FFFFFF';
  const itemTextColor = isDarkMode ? '#FFFFFF' : '#000000';
  const borderColor = isDarkMode ? '#333333' : '#CCCCCC';
  const rightArrowColor = isDarkMode ? '#BBBBBB' : '#333333';
  const gearBg = isDarkMode ? '#2A2A2A' : '#EEEEEE';
  const gearIconColor = isDarkMode ? '#FFFFFF' : '#000000';
  const modalBg = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const modalText = isDarkMode ? '#FFFFFF' : '#000000';
  const backTextColor = isDarkMode ? '#BBBBBB' : '#007AFF';

  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [activeSettingScreen, setActiveSettingScreen] = useState(null);

  // Returns the correct component for inline rendering
  const renderSettingComponent = () => {
    switch (activeSettingScreen) {
      case 'Profile':
        return <ProfileDetailsScreen navigation={props.navigation} closeModal={() => setSettingsModalVisible(false)}/>;
      case 'Themes':
        return <ThemesScreen />;
      case 'Language':
        return <LanguageScreen />;
      case 'Notifications':
        return <NotificationsScreen />;
      case 'About':
        return <AboutACTNXTAppScreen />;
      default:
        return (
          <>
            <DrawerItem label="Profile" labelStyle={{ color: itemTextColor }} onPress={() => setActiveSettingScreen('Profile')} />
            <DrawerItem label="Themes" labelStyle={{ color: itemTextColor }} onPress={() => setActiveSettingScreen('Themes')} />
            <DrawerItem label="Language" labelStyle={{ color: itemTextColor }} onPress={() => setActiveSettingScreen('Language')} />
            <DrawerItem label="Notifications" labelStyle={{ color: itemTextColor }} onPress={() => setActiveSettingScreen('Notifications')} />
            <DrawerItem label="About" labelStyle={{ color: itemTextColor }} onPress={() => setActiveSettingScreen('About')} />
          </>
        );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: bgColor }}>
        {/* Header with logo and name */}
        <View style={[styles.drawerHeader, { borderBottomColor: borderColor }]}>
          <Image source={require('../../assets/icon.png')} style={styles.drawerLogo} resizeMode="contain" />
          <Text style={[styles.drawerTitle, { color: itemTextColor }]}>
            <Text style={[styles.drawerTitleAct, { color: itemTextColor }]}>act</Text>
            <Text style={[styles.drawerTitleNxt, { color: itemTextColor }]}>nxt</Text>
          </Text>
        </View>

        <DrawerItem label="Insights" labelStyle={{ color: itemTextColor }} onPress={() => props.navigation.navigate('Feed')}/>
        <DrawerItem label="Starred" labelStyle={{ color: itemTextColor }} onPress={() => props.navigation.navigate('StarredTasks')}/>
        <DrawerItem label="Archive" labelStyle={{ color: itemTextColor }} onPress={() => props.navigation.navigate('ArchivedTasks')}/>
      </DrawerContentScrollView>

      <View style={styles.gearWrapper}>
        <TouchableOpacity
          onPress={() => {
            setSettingsModalVisible(true);
            setActiveSettingScreen(null); // Reset screen
          }}
          style={[styles.gearButton, {backgroundColor: gearBg, shadowColor: isDarkMode ? '#000' : '#CCC'}]}
          testID='settings-button'
        >
          <MaterialIcons name="settings" size={24} color={gearIconColor} testID="icon-settings"/>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={settingsModalVisible}
        onBackdropPress={() => setSettingsModalVisible(false)}
        style={{ margin: 0, justifyContent: 'flex-end' }}
      >
        <View style={[styles.modalContainer, { backgroundColor: modalBg, borderTopColor: borderColor }]}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            {activeSettingScreen ? (
              <TouchableOpacity onPress={() => setActiveSettingScreen(null)}>
                <Text style={[styles.backButton, { color: backTextColor }]}>Back</Text>
              </TouchableOpacity>
            ) : (
              <Text style={[styles.modalTitle, { color: modalText }]}>Settings</Text>
            )}
            {renderSettingComponent()}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

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
            <Drawer.Screen name="Home" component={App} />
            <Drawer.Screen name="Feed" component={Feed} options={{ headerShown: false }} />
            <Drawer.Screen name="Details" component={TaskExpansion} />
            <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
            <Drawer.Screen name="Themes" component={ThemesScreen} />
            <Drawer.Screen name="ProfileDetails" component={ProfileDetailsScreen} />
            <Drawer.Screen name="Language" component={LanguageScreen} />
            <Drawer.Screen name="Notifications" component={NotificationsScreen} />
            <Drawer.Screen name="AboutACTNXTApp" component={AboutACTNXTAppScreen} />
            <Drawer.Screen name="StarredTasks" component={StarredTasks} />
            <Drawer.Screen name="ArchivedTasks" component={ArchivedTasks} />
          </Drawer.Navigator>
        </NavigationContainer>
       {/* <- Close it here */}
    </Auth0Provider>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  gearWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  gearButton: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 30,
    elevation: 4,
  },
  modalContainer: {
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  backButton: {
    fontSize: 16,
    marginBottom: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 30,
    gap: 14,
    borderBottomWidth: 1,
    marginBottom: 10,
    // paddingBottom: 30,
  },
  drawerLogo: {
    width: 48,
    height: 48,
  },
  drawerTitle: {
    fontSize: 30,
    flexDirection: 'row',
  },
  drawerTitleAct: {
    fontWeight: 'bold',
  },
  drawerTitleNxt: {
    fontWeight: 'normal',
  },
});


export { CustomDrawerContent };
export default Navigator;