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
import { Picker } from "@react-native-picker/picker";
import useSettingsStore from "../../store/useSettingsStore";

// Screens
import ProfileDetailsScreen from "./ProfileDetailsScreen";
import ThemesScreen from "./ThemesScreen";
import AboutACTNXTAppScreen from "./AboutACTNXTAppScreen";

const SettingsScreen = ({ props, closeModal }) => {
    const {
        theme,
        updateTheme,
        language,
        setLanguage,
        notificationsEnabled,
        toggleNotifications,
        hydrated
    } = useSettingsStore();

    const [activeScreen, setActiveScreen] = useState(null);
    const [langOpen, setLangOpen] = useState('en');

    if (!hydrated) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text>Loading settings...</Text>
            </View>
        )
    }

    const isDarkMode = theme.mode === 'dark';
    const bgColor = isDarkMode ? '#121212' : '#FFFFFF';
    const textColor = isDarkMode ? '#FFFFFF' : '#000000';
    const screens = isDarkMode ? '#AAAAAA' : "#666666";
    const borderColor = isDarkMode ? '#333333' : '#CCCCCC';

    const Header = ({ title }) => (
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setActiveScreen(null)}>
          <Text style={[styles.backText, { color: textColor }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>{title}</Text>
      </View>
    );

    if (activeScreen === "Profile") {
      return (
        <View style={[styles.screen, { backgroundColor: bgColor }]}>
          <Header />
          <ScrollView contentContainerStyle={styles.subContainer}>
            <ProfileDetailsScreen navigation={props.navigation} closeModal={closeModal} />
          </ScrollView>
        </View>
      );
    }

    if (activeScreen === "Themes") {
      return (
        <View style={[styles.screen, { backgroundColor: bgColor }]}>
          <Header />
          <ScrollView contentContainerStyle={styles.subContainer}>
            <ThemesScreen />
          </ScrollView>
        </View>
      );
    }
    
    if (activeScreen === "About") {
      return (
        <View style={[styles.screen, { backgroundColor: bgColor }]}>
          <Header />
          <ScrollView contentContainerStyle={styles.subContainer}>
            <AboutACTNXTAppScreen />
          </ScrollView>
        </View>
      );
    }

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: bgColor }]}>
          <Text style={[styles.title, { color: textColor }]}>Settings</Text>
          
          {/* Profile */}
          <Row 
            title="Profile"
            value={null}
            onPress={() => setActiveScreen("Profile")}
            color={textColor}
            subColor={screens}
            border={borderColor}
          />

          {/* Themes */}
          <Row 
            title="Themes"
            value={theme.mode.charAt(0).toUpperCase() + theme.mode.slice(1)}
            onPress={() => setActiveScreen("Themes")}
            color={textColor}
            subColor={screens}
            border={borderColor}
          />

          {/* Language */}
          <TouchableOpacity style={[styles.row, { borderBottomColor: borderColor }]} onPress={() => setLangOpen(o => !o)}>
            <Text style={[styles.label, { color: textColor }]}>Language</Text>
            <View style={styles.valueContainer}>
              <Text style={[styles.value, { color: screens }]}>{language.toUpperCase()}</Text>
              <AntDesign name={langOpen ? 'down' : 'right'} size={18} color={textColor} />
            </View>
          </TouchableOpacity>

          {langOpen && (
            <View style={[styles.nested, { borderBottomColor: borderColor }]}>
              <Picker
                selectedValue={language}
                onValueChange={(val) => {
                  setLanguage(val);
                  setActiveScreen(false);
                }}
                style={styles.picker}
                dropdownIconColor={textColor}
              >
                <Picker.Item label="English" value="en" />
                <Picker.Item label="Danish" value="da" />
                <Picker.Item label="Lorem Ipsum" value="li" />
              </Picker>
            </View>
          )}

          {/* Notifications */}
          <View style={[styles.row, { borderBottomColor: borderColor }]}>
            <Text style={[styles.label, { color: textColor }]}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: isDarkMode ? '#444444' : '#CCCCCC', true: isDarkMode ? '#81b0ff' : '#007AFF' }} thumbColor="#FFFFFF" />
          </View>

          {/* About ActNxt */}
          <Row 
            title="About ActNxt App"
            value={null}
            onPress={() => setActiveScreen("About")}
            color={textColor}
            subColor={screens}
            border={borderColor}
          />
        </ScrollView>
    );
};

function Row({ title, value, onPress, color, subColor, borderColor }) {
  return (
    <TouchableOpacity style={[styles.row, { borderBottomColor: borderColor }]} onPress={onPress}>
      <Text style={[styles.label, { color }]}>{title}</Text>
      <View style={styles.valueContainer}>
        {value != null && (
          <Text style={[styles.value, { color: subColor }]}>{value}</Text>
        )}
        <AntDesign name="right" size={18} color={color} />
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