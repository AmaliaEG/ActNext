import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { NavigationContainer, ThemeContext } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import App from '../screens/demo menu/App'; // Your main screen with the buttons
// import SettingsPage from '../screens/Settings/Settings'; // Your settings page
import Feed from '../screens/mainPage/Feed'; // Your Feed page
import LanguageScreen from '../screens/burgermenu/LanguageScreen';
import NotificationsScreen from '../screens/burgermenu/NotificationsScreen';
import AboutACTNXTAppScreen from '../screens/burgermenu/AboutACTNXTAppScreen';
import ProfileDetailsScreen from '../screens/burgermenu/ProfileDetailsScreen';
import SettingsScreen from '../screens/burgermenu/SettingsScreen';
import TaskExpansion from '../screens/mainPage/TaskExpansion';
import {useAuth0, Auth0Provider} from 'react-native-auth0';
import ThemesScreen from '../screens/burgermenu/ThemesScreen';
import { ThemeProvider } from '../screens/burgermenu/ThemeContext'; // Import your ThemeProvider

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
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
            <DrawerItem label="Profile" onPress={() => setActiveSettingScreen('Profile')} />
            <DrawerItem label="Themes" onPress={() => setActiveSettingScreen('Themes')} />
            <DrawerItem label="Language" onPress={() => setActiveSettingScreen('Language')} />
            <DrawerItem label="Notifications" onPress={() => setActiveSettingScreen('Notifications')} />
            <DrawerItem label="About" onPress={() => setActiveSettingScreen('About')} />
          </>
        );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItem label="Filter 1" onPress={() => alert('Filter 1')}/>
        <DrawerItem label="Filter 2" onPress={() => alert('Filter 2')}/>
        <DrawerItem label="Filter 3" onPress={() => alert('Filter 3')}/>
      </DrawerContentScrollView>

      <View style={styles.gearWrapper}>
        <TouchableOpacity
          onPress={() => {
            setSettingsModalVisible(true);
            setActiveSettingScreen(null); // Reset screen
          }}
          style={styles.gearButton}
          testID='settings-button'
        >
          <MaterialIcons name="settings" size={24} color="black" testID="icon-settings"/>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={settingsModalVisible}
        onBackdropPress={() => setSettingsModalVisible(false)}
        style={{ margin: 0, justifyContent: 'flex-end' }}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            {activeSettingScreen ? (
              <TouchableOpacity onPress={() => setActiveSettingScreen(null)}>
                <Text style={styles.backButton}>Back</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.modalTitle}>Settings</Text>
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
    backgroundColor: 'white',
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
    color: '#007AFF'
  },
});


export { CustomDrawerContent };
export default Navigator;