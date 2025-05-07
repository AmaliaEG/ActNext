import { Button, StyleSheet, Text, View, Platform } from 'react-native';
import { useState } from 'react';
import React from 'react';
import { useAuth0 } from 'react-native-auth0';
import { ThemeContext } from '@react-navigation/native';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import useProfileStore from '../../store/useProfileStore';
import useSettingsStore from '../../store/useSettingsStore';
import useInsightStore from '../../store/useInsightsStore';


const App = ({ navigation }) => {
    const profileReady = useProfileStore((state) => state._hasHydrated);
    const settingsReady = useSettingsStore((state) => state._hasHydrated);
    const insightsReady = useInsightStore((state) => state._hasHydrated);
    const authReady = useAuthStore((state) => state._hasHydrated);

    console.log('Hydration states:', {
      authReady,
      insightsReady,
      profileReady,
      settingsReady,
    });
    
    const allHydrated = profileReady && settingsReady && insightsReady && authReady;

    useEffect(() => {
      const resetStorage = async () => {
        try {
          // await AsyncStorage.clear();
          // const result = await AsyncStorage.getItem('zustand-test-key');
          console.log('[Zustand] Cleared AsyncStorage for fresh start.');
        } catch (error) {
          console.error('[Zustand] Clear error:', error)
        }
      };

      resetStorage();
    },[]);

    useEffect(() => {
      const checkAsyncStorage = async () => {
        try {
          // await AsyncStorage.clear();
          const storedSettings = await AsyncStorage.getItem('app-settings');
          console.log('[AsyncStorage] Raw app-settings value:', storedSettings);
        } catch (error) {
          console.error('[AsyncStorage] Read error:', error)
        }
      };

      checkAsyncStorage();
    },[]);

    const [theme, setTheme] = useState('light');
  
    const updateTheme = (newTheme) => {
      let mode;
      if (!newTheme) {
        mode = theme.mode == 'dark' ? 'light' : 'dark';
        newTheme = { mode };
    } else {
      if (newTheme.system){
        const systemColorScheme = Appearance.getColorScheme();
        mode = systemColorScheme === 'dark' ? 'dark' : 'light';

        newTheme = {...newTheme, mode };
      } else {
        newTheme = {...newTheme, system: false};
      }
    }
    setTheme(newTheme);
    };

    if (!allHydrated) {
      return <Text>Loading stores...</Text>
    };

    return (
      <ThemeContext.Provider value={{ theme, updateTheme }}>
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
      </ThemeContext.Provider>
    );
  };

  const LoginButton = () => {
    // Auth0 hooks
    const { authorize, user: auth0User, error, isLoading, clearSession } = useAuth0();

    // Zustand store
    const { setAuth, logout, user: zustandUser } = useAuthStore();

    // Fallback mechanism just in case
    // Will get removed once Zustand is confirmed to work
    const currentUser = zustandUser || auth0User;

    const onLogin = async () => {
      try {
        const credentials = await authorize();
        if (credentials) {
          setAuth(credentials.accessToken, credentials.user);
        }
      } catch (error) {
        console.error('Login failed:', error);
      }
    };

  const onLogout = async () => {
    try {
      await clearSession();
      logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      {isLoading && <Text>Loading...</Text>}
      {error && <Text>{error.message}</Text>}
      {currentUser && (
        <Text>Logged in as {currentUser.name}</Text>
      )}
      {currentUser ? (
        <Button onPress={onLogout} title="Log out" />
      ) : (
        <Button onPress={onLogin} title="Log in" />
      )}
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
export { LoginButton };