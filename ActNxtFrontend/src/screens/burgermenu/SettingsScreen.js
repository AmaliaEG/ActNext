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
import { useTheme } from '../../Themes/ThemeContext';

// Screens
import ProfileDetailsScreen from "./ProfileDetailsScreen";
import ThemesScreen from "./ThemesScreen";
import AboutACTNXTAppScreen from "./AboutACTNXTAppScreen";

const SettingsScreen = ({ props, closeModal }) => {
    const {
        language,
        setLanguage,
        notificationsEnabled,
        toggleNotifications,
        hydrated
    } = useSettingsStore();

    const [activeScreen, setActiveScreen] = useState(null);
    const [langOpen, setLangOpen] = useState('en');
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
            subColor={theme.colors.screen}
            border={theme.colors.border}
          />

          {/* Language */}
        <TouchableOpacity style={[styles.row, { borderBottomColor: theme.colors.border }]} onPress={() => setLangOpen(o => !o)}>
            <Text style={[styles.label, { color: theme.colors.inputText }]}>Language</Text>
            <View style={styles.valueContainer}>
              <Text style={[styles.value, { backgroundColor: theme.colors.inputBg }]}>{language.toUpperCase()}</Text>
              <AntDesign name={langOpen ? 'down' : 'right'} size={18} color={theme.colors.inputTexta} />
            </View>
      </TouchableOpacity>

      {langOpen && (
        <View style={[styles.nested, {
          borderBottomColor: theme.colors.border,
          backgroundColor: theme.colors.inputBg,
          color: theme.colors.inputText,

        }]}>
          <Picker
            selectedValue={language}
            onValueChange={(val) => {
              setLanguage(val);
              setLangOpen(false);
            }}
            style={[
              styles.picker,
              {
                color: theme.colors.inputText,
                backgroundColor: theme.colors.inputBg,
              }
            ]}
            dropdownIconColor={theme.colors.inputText}
            itemStyle={{ color: theme.colors.inputText }}
          >
            <Picker.Item label="English" value="en" backgroundColor={theme.colors.background}/>
            <Picker.Item label="Danish" value="da"   />
            <Picker.Item label="Lorem Ipsum" value="li" />
          </Picker>
        </View>
      )}

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
            subColor={theme.colors.screen}
            border={theme.colors.border}
          />
        </ScrollView>
    );
};

function Row({ title, value, onPress, color, subColor, borderColor }) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity style={[styles.row, { borderBottomColor: theme.colors.border }]} onPress={onPress}>
      <Text style={[styles.label, { color }]}>{title}</Text>
      <View style={styles.valueContainer}>
        {value != null && (
          <Text style={[styles.value, { color: theme.colors.subColor }]}>{value}</Text>
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