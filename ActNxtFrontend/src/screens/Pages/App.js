import { Button, Stylesheet, Text, View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import React from 'react';
import { useAuth0 } from 'react-native-auth0';
import { useTheme } from '../../Themes/ThemeContext';
import useAuthStore from '../../store/useAuthStore';
import useSettingsStore from '../../store/useSettingsStore';
import useProfileStore from '../../store/useProfileStore';
import useInsightsStore from '../../store/useInsightsStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Styles, GroupColours } from './Styles';

const App = ({ navigation }) => {

  //theme 
  const { resolvedTheme } = useTheme();
  // Zustand Hydration
  const { loadAuth, hydrated: authHydrated, isLoggedIn ,user: zustandUser, login  } = useAuthStore();
  const { loadSettings, hydrated: settingsHydrated } = useSettingsStore();
  const { loadProfile, hydrated: profileHydrated } = useProfileStore();
  const { loadInsights, hydrated: insightsHydrated } = useInsightsStore();

  const {user: auth0User} = useAuth0();

  // Fallback mechanism just in case
  // Will get removed once Zustand is confirmed to work
  const currentUser = zustandUser || auth0User;

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

    const pageLoad =
    navigation.addListener('focus', () => {
      
        login(currentUser);
        navigation.navigate('Feed');
      
    });

    return pageLoad;
  }, [allHydrated, isLoggedIn, currentUser, navigation]);

  const allHydrated = authHydrated && settingsHydrated && profileHydrated && insightsHydrated;

  if (!allHydrated) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={Styles.centered}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[Styles.container, { backgroundColor: resolvedTheme === 'dark' ? '#000' : '#fff' }]}>
        {/* Buttons and UI */}
        <View style={Styles.row}>
          <View style={Styles.buttonContainer}>
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

export default App;
export { LoginButton };