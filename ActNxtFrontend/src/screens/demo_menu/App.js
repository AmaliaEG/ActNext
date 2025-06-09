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

  // Theme 
  const { resolvedTheme } = useTheme();
  // Zustand Hydration
  const { loadAuth, hydrated: authHydrated  } = useAuthStore();
  const { loadSettings, hydrated: settingsHydrated } = useSettingsStore();
  const { loadProfile, hydrated: profileHydrated } = useProfileStore();
  const { loadInsights, hydrated: insightsHydrated } = useInsightsStore();

  //loading all stored data from zustand
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
            <LoginButton navigation={navigation}/>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};



const LoginButton = ({navigation}) => {
  
  // Auth0 hooks
  const { authorize, user: auth0User, error, isLoading } = useAuth0();

  // Zustand store
  const { login,  user: zustandUser, isLoggedIn } = useAuthStore();

  // Fallback mechanism just in case
  // Will get removed once Zustand is confirmed to work
  const currentUser = zustandUser || auth0User;

  const onLogin = async () => {
    try {
      await authorize();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  useEffect(() => {
    if (auth0User && !isLoggedIn) {
      login(auth0User);
      // Navigate to Feed after successful login
      navigation.navigate('Feed');
    }
  }, [auth0User, isLoggedIn, login, navigation]);

  const navigateToFeed =  () => {
    navigation.navigate('Feed');
  };

  if (isLoading) {
    return (
    <View>
      <Button onPress={navigateToFeed } title="auth0 error, navigate to Feed"/>
    </View>
    // <></>
    );
  }

  return (
    <View>
      {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
      
      {currentUser && (
        <Text style={{ color: '#000' }}>Logged in as {currentUser.name}</Text>
      )}
      
      <Button onPress={onLogin} title="Log in" />
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
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