import { Button, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import React from 'react';
import { useAuth0 } from 'react-native-auth0';
import { useTheme } from '../../Themes/ThemeContext';
import useAuthStore from '../../store/useAuthStore';
import useSettingsStore from '../../store/useSettingsStore';
import useProfileStore from '../../store/useProfileStore';
import useInsightsStore from '../../store/useInsightsStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = ({ navigation }) => {
    const { resolvedTheme } = useTheme();

    // Zustand Hydration
    const { loadAuth, hydrated: authHydrated } = useAuthStore();
    const { loadSettings, hydrated: settingsHydrated } = useSettingsStore();
    const { loadProfile, hydrated: profileHydrated } = useProfileStore();
    const { loadInsights, hydrated: insightsHydrated } = useInsightsStore();

    useEffect(() => {
      const hydrateAll = async () => {
        await Promise.all([
          loadAuth(),
          loadSettings(),
          loadProfile(),
          loadInsights()
        ]);
      };

      hydrateAll();
    }, []);

    const allHydrated = authHydrated && settingsHydrated && profileHydrated && insightsHydrated;

    if (!allHydrated) {
      return (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#007BFF" />
          </View>
        </GestureHandlerRootView>
      );
    }

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={[styles.container, { backgroundColor: resolvedTheme === 'dark' ? '#000' : '#fff' }]}>
          {/* Buttons and UI */}
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
        </View>
      </GestureHandlerRootView>
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
      {error && <Text>{error.message}</Text>}
      {currentUser && (<Text style={{ color: resolvedTheme === 'dark' ? '#fff' : '#000' }}>Logged in as {currentUser.name}</Text>)}
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
  centered: {
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