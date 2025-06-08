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

  //theme 
  const { resolvedTheme } = useTheme();
  // Zustand Hydration
  const { loadAuth, hydrated: authHydrated, isLoggedIn } = useAuthStore();
  const { loadSettings, hydrated: settingsHydrated } = useSettingsStore();
  const { loadProfile, hydrated: profileHydrated } = useProfileStore();
  const { loadInsights, hydrated: insightsHydrated } = useInsightsStore();

  const {user} = useAuth0();

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

  useEffect(() => {
    if (allHydrated && isLoggedIn && user && navigation) {
      navigation.navigate('Feed');
    }
  }, [allHydrated, isLoggedIn, user, navigation]);

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
        </View>
      </View>
    </GestureHandlerRootView>
  );
};



const LoginButton = () => {
  
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

  const populateStores = async () => {
    if(!isLoggedIn && currentUser){
      login(currentUser);
    }
  }
  

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      {error && <Text>{error.message}</Text>}
      {/*currentUser && (<Text style={{ color: resolvedTheme === 'dark' ? '#fff' : '#000' }}>Logged in as {currentUser.name}</Text>)*/}
      
      {currentUser && 
      (<Text style={{ color:  '#000' }}>Logged in as {currentUser.name}</Text>) 
      }
      {currentUser && 
      populateStores()
      }
      {currentUser ? (
        <></>
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