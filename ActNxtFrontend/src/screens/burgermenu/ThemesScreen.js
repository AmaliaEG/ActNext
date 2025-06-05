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

  const backgroundColor = theme.mode === 'dark' ? '#1E1E1E' : '#FFFFFF';
  const textColor = theme.mode === 'dark' ? '#FFFFFF' : '#000000';

  return (
    <View style={[styles.container, { backgroundColor }]} testID='themes-container'>
      <Text style={[styles.title, { color: textColor }]}>Theme Settings</Text>
      
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
  // centered: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  title: {
    fontSize: 24,
    marginBottom: 30,
  },
  buttonContainer: {
    marginBottom: 12, 
    width: '60%', 
  },
});

export default Themes;
