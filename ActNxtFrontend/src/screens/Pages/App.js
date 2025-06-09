import { Pressable, StyleSheet, Text, View, ActivityIndicator, Dimensions,  Animated,  StatusBar, } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { BlurView } from '@react-native-community/blur';
import { useAuth0 } from 'react-native-auth0';
import { useTheme } from '../../Themes/ThemeContext';
import useAuthStore from '../../store/useAuthStore';
import useSettingsStore from '../../store/useSettingsStore';
import useProfileStore from '../../store/useProfileStore';
import useInsightsStore from '../../store/useInsightsStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const { width, height } = Dimensions.get('window');

const IMAGES = [
  'https://picsum.photos/800/600?random=1',
  'https://picsum.photos/800/600?random=2',
  'https://picsum.photos/800/600?random=3',
  'https://picsum.photos/800/600?random=4',
  'https://picsum.photos/800/600?random=5',
];

const BackgroundAnimation = ({ 
  children, 
  images = IMAGES, 
  duration = 8000,
  zoomDuration = 8000,
  fadeDuration = 1000,
  initialScale = 1.15,
  overlayOpacity = 0.2
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(initialScale)).current;
  const nextFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the zoom out animation immediately when component mounts or image changes
    startZoomOutAnimation();
    
    const timeout = setTimeout(() => {
      animateTransition();
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentIndex]);

  const startZoomOutAnimation = () => {
    // Reset scale to zoomed in position
    scaleAnim.setValue(initialScale);
    
    // Slowly zoom out over the entire duration
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: zoomDuration,
      useNativeDriver: true,
    }).start();
  };

  const animateTransition = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    
    // Fade out current image (keep final zoom state)
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: fadeDuration,
      useNativeDriver: true,
    }).start();

    // Fade in next image and start its zoom out
    Animated.timing(nextFadeAnim, {
      toValue: 1,
      duration: fadeDuration,
      useNativeDriver: true,
    }).start(() => {
      // Reset animations for next cycle
      setCurrentIndex(nextIndex);
      fadeAnim.setValue(1);
      nextFadeAnim.setValue(0);
    });
  };

  const currentImage = images[currentIndex];
  const nextImage = images[(currentIndex + 1) % images.length];

  return (
    <View style={styles.container}>
      {/* Current Image */}
      <Animated.Image
        source={{ uri: currentImage }}
        style={[
          styles.backgroundImage,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        resizeMode="cover"
      />
      
      {/* Next Image (for smooth transition) */}
      <Animated.Image
        source={{ uri: nextImage }}
        style={[
          styles.backgroundImage,
          styles.nextImage,
          {
            opacity: nextFadeAnim,
            transform: [{ scale: initialScale }],
          },
        ]}
        resizeMode="cover"
      />
      
      {/* Overlay for better content visibility */}
      <View style={[styles.overlay ]}>
        {children}
      </View>
    </View>
  );
};

const App = ({ navigation }) => {

  //theme 
  const { resolvedTheme } = useTheme();
  // Zustand Hydration
  const { loadAuth, hydrated: authHydrated, login, user: zustandUser, isLoggedIn  } = useAuthStore();
  const { loadSettings, hydrated: settingsHydrated } = useSettingsStore();
  const { loadProfile, hydrated: profileHydrated } = useProfileStore();
  const { loadInsights, hydrated: insightsHydrated } = useInsightsStore();

  //Auth0 access
  const { authorize, user: auth0User, error, isLoading } = useAuth0();

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

    //behavior when user login is detected
    if (auth0User ) {
      login(auth0User); //populate the zustand store with user information
      navigation.navigate('Feed');
    }
  }, [auth0User, isLoggedIn, login, navigation]);

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
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      </GestureHandlerRootView>
    );
  }
  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BackgroundAnimation>
        <View style={styles.buttonContainer} key="login-button-container">
          <LoginButton 
            onLoginPress={authorize} //auth0 login
            error={error}
            isLoading={isLoading}
            currentUser={zustandUser || auth0User}
            navigation={navigation}
          />
        </View>
      </BackgroundAnimation>
    </GestureHandlerRootView>
  );
};

const LoginButton = ({ onLoginPress, error, isLoading, currentUser, navigation }) => {

  const navigateToFeed = () => {
    navigation.navigate('Feed');
  };

  if (isLoading) {
    return (
      <View style={styles.loginButtonWrapper}>
        <Pressable style={styles.transparentButton} onPress={navigateToFeed}>
         <Text style={styles.buttonText}>auth0 error, navigate to Feed</Text>
        </Pressable>
      </View>
    );
  }

  return (

    <View style={styles.loginButtonWrapper}>
      {error && <Text style={styles.errorText}>{error.message}</Text>}
      {currentUser && (
        <Text style={styles.loggedInText}>Logged in as {currentUser.name}</Text>
      )}

      <BlurView
        style={styles.blurButton}
        blurType="dark"
        blurAmount={10}
        reducedTransparencyFallbackColor="rgba(0,0,0,0.3)"
      >
        <Pressable style={styles.pressableArea} onPress={onLoginPress}>
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>
      </BlurView>

    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    left: 0,
  },
  nextImage: {
    zIndex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  loginButtonWrapper: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '55%', // slightly below center
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 8, // for Android shadow
  },
  blurButton: {
    width: 250,
    height: 60,
    borderRadius: 20,
    overflow: 'hidden', // ensures blur stays within border
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  loggedInText: {
    color: '#fff',
    marginBottom: 10,
    fontSize: 16,
  },
});

export default App;
export { LoginButton };