import React, { useContext, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { ThemeContext } from './ThemeContext'; 
import { Appearance } from 'react-native';

const colors = {
  light: '#FFFFFF',  
  dark: '#000000',   
};

const Themes = () => {
  const { theme, updateTheme } = useContext(ThemeContext);

  
  let activeColor = colors[theme.mode] || colors.light; 
  const [isActive, setIsActive] = useState(theme.mode === 'dark');

  const handleSwitch = () => {
    updateTheme();
    setIsActive(previousState => !previousState);
  };

  return (
    <View style={[styles.container, { backgroundColor: activeColor }]}>
      <Text style={styles.title}>Theme Settings</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Light" 
          onPress={() => updateTheme({ mode: 'light' })}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button 
          title="Dark" 
          onPress={() => updateTheme({ mode: 'dark' })}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button 
          title="System" 
          onPress={() => updateTheme({ mode: true })}
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
