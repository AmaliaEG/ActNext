import { Button, StyleSheet, Text, View } from 'react-native';
import React from 'react';

const App = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.buttonContainer}>
          <Button
            title="Show Settings"
            onPress={() => navigation.navigate('SettingsScreen')} 
          />
        </View>
        <View style={styles.buttonContainer}>
        <Button
            title="Feed"
            onPress={() => navigation.navigate('Feed')}
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.buttonContainer}>
          <Button title="Button 4" onPress={() => alert('Button 4 pressed')} />
        </View>
      </View>
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  buttonContainer: {
    margin: 10, 
    alignItems: 'center',
  },
  button: {
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default App;