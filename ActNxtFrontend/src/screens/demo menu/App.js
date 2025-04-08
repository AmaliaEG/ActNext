import { Button, StyleSheet, Text, View, Platform } from 'react-native';
import React from 'react';
import {useAuth0, Auth0Provider} from 'react-native-auth0';

const App = ({ navigation }) => {
  return (
    <Auth0Provider domain={"dev-actnxt.eu.auth0.com"} clientId={"7PV7PugpQ9TR2pYdHjYpvjiQC85rUb5J"} redirectUri={Platform.OS === 'ios' ? 'com.anonymous.actnxtfrontend.auth0://dev-actnxt.eu.auth0.com/ios/com.anonymous.actnxtfrontend/callback' : 'com.anonymous.actnxtfrontend.auth0://dev-actnxt.eu.auth0.com/android/com.anonymous.actnxtfrontend/callback'}>
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.buttonContainer}>
           <LoginButton/>
          </View>
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
     </Auth0Provider>
  );
};

const LoginButton = () => {
  const {authorize} = useAuth0();

  const onPress = async () => {
      try {
          await authorize();
      } catch (e) {
          console.log(e);
      }
  };

  return <Button onPress={onPress} title="Log in" />
}


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