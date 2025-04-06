import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import App from '../screens/demo menu/App'; // Your main screen with the buttons
// import SettingsPage from '../screens/Settings/Settings'; // Your settings page
import Feed from '../screens/mainPage/Feed'; // Your Feed page
import LanguageScreen from '../screens/burgermenu/LanguageScreen';
import NotificationsScreen from '../screens/burgermenu/NotificationsScreen';
import StorageAndDataScreen from '../screens/burgermenu/StorageAndDataScreen';
import AboutACTNXTAppScreen from '../screens/burgermenu/AboutACTNXTAppScreen';
import ProfileDetailsScreen from '../screens/burgermenu/ProfileDetailsScreen';
import SettingsScreen from '../screens/burgermenu/SettingsScreen';
import DetailsScreen from '../screens/mainPage/TaskExpansion';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [activeSettingScreen, setActiveSettingScreen] = useState(null);

  // Returns the correct component for inline rendering
  const renderSettingComponent = () => {
    switch (activeSettingScreen) {
      case 'Profile':
        return <ProfileDetailsScreen />;
      case 'Language':
        return <LanguageScreen />;
      case 'Notifications':
        return <NotificationsScreen />;
      case 'Storage & Data':
        return <StorageAndDataScreen />;
      case 'About':
        return <AboutACTNXTAppScreen />;
      default:
        return (
          <>
            <DrawerItem label="Profile" onPress={() => setActiveSettingScreen('Profile')} />
            <DrawerItem label="Language" onPress={() => setActiveSettingScreen('Language')} />
            <DrawerItem label="Notifications" onPress={() => setActiveSettingScreen('Notifications')} />
            <DrawerItem label="Storage & Data" onPress={() => setActiveSettingScreen('Storage & Data')} />
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
        >
          <MaterialIcons name="settings" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={settingsModalVisible}
        onBackdropPress={() => setSettingsModalVisible(false)}
        style={{ margin: 0, justifyContent: 'flex-end' }}
      >
        <View style={styles.modalContent}>
          {activeSettingScreen ? (
            <TouchableOpacity onPress={() => setActiveSettingScreen(null)}>
              <Text style={styles.backButton}>Back</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.modalTitle}>Settings</Text>
          )}
          {renderSettingComponent()}
        </View>
      </Modal>
    </View>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        // initialRouteName="Feed"
        screenOptions={{ drawerType: 'slide', drawerStyle: { width: '75%' }, headerShown: false }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="Home" component={App} />
        <Drawer.Screen name="Feed" component={Feed} options={{ headerShown: false }} />
        <Drawer.Screen name="Details" component={DetailsScreen} />
        <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
        <Drawer.Screen name="ProfileDetails" component={ProfileDetailsScreen} />
        <Drawer.Screen name="Language" component={LanguageScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
        <Drawer.Screen name="StorageAndData" component={StorageAndDataScreen} />
        <Drawer.Screen name="AboutACTNXTApp" component={AboutACTNXTAppScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
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
  modalContent: {
    height: '80%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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


export default Navigator;