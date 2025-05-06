import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { ThemeContext } from './ThemeContext'; 
import useSettingsStore from '../../store/useSettingsStore';

// const colors = {
//   light: '#FFFFFF',  
//   dark: '#000000',   
// };

const Themes = () => {
  const { updateTheme } = useContext(ThemeContext);
  const { theme } = useSettingsStore(); // get theme from Zustand

  const getButtonColor = (mode) => {
    return theme.mode === mode ? '#007AFF' : '#CCCCCC';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.mode === 'dark' ? '#121212' : '#FFFFFF' }]} testID='themes-container'>
      <Text style={[styles.title, { color: theme.mode === 'dark' ? '#FFFFFF' : '#000000'}]}>Theme Settings</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Light" 
          // icon="lightbulb-on"
          onPress={() => updateTheme({ mode: 'light' })}
          color={getButtonColor('light')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button 
            title="Dark" 
            // icon="weather-night"
            onPress={() => updateTheme({ mode: 'dark' })}
            color={getButtonColor('dark')}
        />
      </View>
      <View style={styles.buttonContainer}>
      <Button 
        title="System" 
        onPress={() => updateTheme({ mode: 'system' })}
        color={getButtonColor('system')}
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
  },
  buttonContainer: {
    marginBottom: 10, 
    width: '60%', 
  },
});

export default Themes;
