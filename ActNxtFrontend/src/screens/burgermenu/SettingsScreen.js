/**
 * @file SettingsScreen.js
 * @description 
 * Displays a settings screen allowing the user to configure:
 * - Profile information
 * - Theme selection (Light, Dark, System)
 * - Language
 * - Notification toggle
 * - About the application
 * @module SettingsScreen
 * @author s224837
 * @since 2025-19-03
 */

import React, { useState } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Switch,
    ActivityIndicator,
    ScrollView,
    StatusBar
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import useSettingsStore from "../../store/useSettingsStore";
import { useTheme } from '../../Themes/ThemeContext';
import LanguagesScreen from "./settingComponents/LanguageScreen";


// Screens
import ProfileDetailsScreen from "./settingComponents/ProfileDetailsScreen";
import ThemesScreen from "./settingComponents/ThemesScreen";
import AboutACTNXTAppScreen from "./settingComponents/AboutACTNXTAppScreen";


/**
 * Main SettingsScreen component
 * Allosws the user to navigate through different settings options.
 * Uses the useSettingsStore for state management and useTheme for theming.
 * @param {Object} props - The component props.
 * @param {Function} closeModal - Function to close the modal.
 * @returns {JSX.Element} The rendered settings screen.
 * @component
 * @example
 * return (
 *   <SettingsScreen closeModal={() => console.log('Modal closed')} />
 * )
 */
const SettingsScreen = ({ props, closeModal }) => {
    const {
        language,
        notificationsEnabled,
        toggleNotifications,
        hydrated
    } = useSettingsStore();

    const [activeScreen, setActiveScreen] = useState(null);
    const {theme} = useTheme();

    if (!hydrated) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text>Loading settings...</Text>
            </View>
        )
    }

    const Header = ({ title }) => (
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setActiveScreen(null)}>
          <Text style={[styles.backText, { color: theme.colors.text }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{title}</Text>
      </View>
    );

    if (activeScreen === "Profile") {
      return (
        <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
          <Header />
          <ScrollView contentContainerStyle={styles.subContainer}>
            <ProfileDetailsScreen navigation={props.navigation} closeModal={closeModal} />
          </ScrollView>
        </View>
      );
    }
    

    if (activeScreen === "Themes") {
      return (
        <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
          <Header />
          <ScrollView contentContainerStyle={styles.subContainer}>
            <ThemesScreen />
          </ScrollView>
        </View>
      );
    }

    if (activeScreen === "Languages") {
      return (
        <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
          <Header title/>
          <ScrollView contentContainerStyle={styles.subContainer}>
            <LanguagesScreen />
          </ScrollView>
        </View>
      );
    }
    
    if (activeScreen === "About") {
      return (
        <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
          <Header />
          <ScrollView contentContainerStyle={styles.subContainer}>
            <AboutACTNXTAppScreen />
          </ScrollView>
        </View>
      );
    }

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
          
          {/* Profile */}
          <Row 
            title="Profile"
            value={null}
            onPress={() => setActiveScreen("Profile")}
            color={theme.colors.text}
            subColor={theme.colors.screen}
            border={theme.colors.border}
          />

          {/* Themes */}
          <Row 
            title="Themes"
            value={theme.mode.charAt(0).toUpperCase() + theme.mode.slice(1)}
            onPress={() => setActiveScreen("Themes")}
            color={theme.colors.text}
            border={theme.colors.border}
            subColor={theme.colors.text}
             
          />
          {/* Language */}
          <Row 
            title="Language"
            value={language.toUpperCase()}
            onPress={() => setActiveScreen("Languages")}
            color={theme.colors.text}
            subColor={theme.colors.text}
            border={theme.colors.text}
        />
          {/* Notifications */}
          <View style={[styles.row, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ 
                false: theme.colors.border,
                true: theme.colors.primary
              }} 
              thumbColor="#FFFFFF" />
          </View>

          {/* About ActNxt */}
          <Row 
            title="About ActNxt App"
            value={null}
            onPress={() => setActiveScreen("About")}
            color={theme.colors.text}
            subColor={theme.colors.text}
            border={theme.colors.border}
          />
        </ScrollView>
    );
};
/**
 * Row component used inside Settings screen to display each setting option.
 * It is a touchable row that displays a title, an optional value, and an arrow icon.
 * @param {object} props - Row props.
 * @param {string} props.title - The label.
 * @param {string} [props.value] - Optional value on the right side.
 * @param {Function} props.onPress - Click handler.
 * @param {string} props.color - Text color.
 * @param {string} props.subColor - Subtext color.
 * @returns {JSX.Element}
 */

function Row({ title, value, onPress, color, subColor }) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity style={[styles.row, { borderBottomColor: theme.colors.border }, {color: theme.colors.text}]} onPress={onPress}>
      <Text style={[styles.label, { color }]}>{title}</Text>
      <View style={styles.valueContainer}>
        {value != null && (
          <Text style={[styles.value, { color: subColor }]}>{value}</Text>
        )}
        <AntDesign name="right" size={18} color={theme.colors.text} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
      padding: 20,
  },
  subContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  screen: {
    flex: 1,
  },
  centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '400',
  },
  row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#CCCCCC',
  },
  backText: {
      fontSize: 16,
      marginRight: 20,
  },
  header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: StatusBar.currentHeight,
      paddingHorizontal: 20,
      marginBottom: 4,
  },
  label: {
      fontSize: 16,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nested: {
    paddingLeft: 20,
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1,
  },
  picker: {
    width: '100%'
  },
});

export default SettingsScreen; 