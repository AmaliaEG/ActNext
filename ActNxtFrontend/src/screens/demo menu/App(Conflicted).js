import React, { useState, createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, StyleSheet, Text, View, Appearance } from 'react-native';
import { useAuth0 } from 'react-native-auth0';

// Create your own ThemeContext
export const ThemeContext = createContext();

const Stack = createNativeStackNavigator();

const App = () => {
  const [theme, setTheme] = useState({ mode: 'light', system: false });

  const updateTheme = (newTheme) => {
    let mode;
    if (!newTheme) {
      mode = theme.mode === 'dark' ? 'light' : 'dark';
      newTheme = { mode };
    } else {
      if (newTheme.system) {
        const systemColorScheme = Appearance.getColorScheme();
        mode = systemColorScheme === 'dark' ? 'dark' : 'light';
        newTheme = { ...newTheme, mode };
      } else {
        newTheme = { ...newTheme, system: false };
      }
    }
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
          <Stack.Screen name="Feed" component={FeedScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
};

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.buttonContainer}>
          <LoginButton />
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
  );
};

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>
    </View>
  );
};

const FeedScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Feed Screen</Text>
    </View>
  );
};

const LoginButton = () => {
  const { authorize, user, error, isLoading, clearSession } = useAuth0();

  const onLogin = async () => {
    try {
      await authorize();
    } catch (e) {
      console.log(e);
    }
  };

  const onLogout = async () => {
    try {
      await clearSession();
    } catch (e) {
      console.log(e);
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      {user ? (
        <>
          <Text>Logged in as {user.name}</Text>
          <Button onPress={onLogout} title="Log out" />
        </>
      ) : (
        <Button onPress={onLogin} title="Log in" />
      )}
      {error && <Text>{error.message}</Text>}
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
