import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Stylesheet, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import App from '../screens/Pages/App'; // Your main screen with the buttons
import Feed from '../screens/Pages/Feed'; // Your Feed page
import AboutACTNXTAppScreen from '../screens/burgermenu/AboutACTNXTAppScreen';
import ProfileDetailsScreen from '../screens/burgermenu/ProfileDetailsScreen';
import SettingsScreen from '../screens/burgermenu/SettingsScreen';
import TaskExpansion from '../screens/Pages/TaskExpansion';
import ThemesScreen from '../screens/burgermenu/ThemesScreen';
import StarredTasks from '../screens/Pages/StarredTasks';
import ArchivedTasks from '../screens/Pages/ArchivedTasks';
import {useAuth0, Auth0Provider} from 'react-native-auth0';
import { ThemeProvider, useTheme } from '../Themes/ThemeContext';
import { Styles, GroupColours } from '../screens/Pages/Styles';

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

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: bgColor }}>
        {/* Header with logo and name */}
        <View style={[Styles.drawerHeader, { borderBottomColor: borderColor }]}>
          <Image source={require('../../assets/icon.png')} style={Styles.drawerLogo} resizeMode="contain" />
          <Text style={[Styles.drawerTitle, { color: itemTextColor }]}>
            <Text style={[Styles.drawerTitleAct, { color: itemTextColor }]}>act</Text>
            <Text style={[Styles.drawerTitleNxt, { color: itemTextColor }]}>nxt</Text>
          </Text>
        </View>

        <DrawerItem label="Insights" labelStyle={{ color: itemTextColor }} onPress={() => props.navigation.navigate('Feed')}/>
        <DrawerItem label="Starred" labelStyle={{ color: itemTextColor }} onPress={() => props.navigation.navigate('StarredTasks')}/>
        <DrawerItem label="Archive" labelStyle={{ color: itemTextColor }} onPress={() => props.navigation.navigate('ArchivedTasks')}/>
      </DrawerContentScrollView>

      <View style={Styles.gearWrapper}>
        <TouchableOpacity
          onPress={() => {
            setSettingsModalVisible(true);
            setActiveSettingScreen(null); // Reset screen
          }}
          style={[Styles.gearButton, {backgroundColor: gearBg, shadowColor: isDarkMode ? '#000' : '#CCC'}]}
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
        <View style={[Styles.modalContainer, { backgroundColor: modalBg, borderTopColor: borderColor }]}>
            <SettingsScreen props={props} closeModal={() => setSettingsModalVisible(false)} />
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


export { CustomDrawerContent };
export default Navigator;