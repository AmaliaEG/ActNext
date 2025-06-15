import { Pressable, StyleSheet, Text, View, ActivityIndicator, Dimensions,  Animated,  Button, Image } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { BlurView } from '@react-native-community/blur';
import { useAuth0 } from 'react-native-auth0';
import { useTheme } from '../../Themes/ThemeContext';
import useAuthStore from '../../store/useAuthStore';
import useSettingsStore from '../../store/useSettingsStore';
import useProfileStore from '../../store/useProfileStore';
import useInsightsStore from '../../store/useInsightsStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Styles } from './Styles';


const { width, height } = Dimensions.get('window');

const IMAGES = [
  require('../../../assets/background1.jpg'),
  require('../../../assets/background2.jpg'),
  require('../../../assets/background3.jpg'),
  require('../../../assets/background4.jpg'),
  require('../../../assets/background5.jpg'),
  require('../../../assets/background6.jpg'),
  require('../../../assets/background7.jpg'),
];

const BackgroundAnimation = ({ 
  children, 
  images = IMAGES, 
  duration = 10000,
  zoomDuration = 12000,
  fadeDuration = 1000,
  initialScale = 1.15,
  overlayOpacity = 0.5
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(initialScale)).current;
  const nextFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Preload all images when component mounts
    const preloadImages = async () => {
      await Promise.all(images.map(img => Asset.loadAsync(img)));
    };
    preloadImages();
    // Start the zoom out animation immediately when component mounts or image changes
    startZoomOutAnimation();
    
    const timeout = setTimeout(() => {
      animateTransition();
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentIndex, images]);

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
        source={ currentImage }
        style={[
          styles.backgroundImage,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        resizeMode="cover"
        pointerEvents="none"
      />
      
      {/* Next Image (for smooth transition) */}
      <Animated.Image
        source={ nextImage }
        style={[
          styles.backgroundImage,
          styles.nextImage,
          {
            opacity: nextFadeAnim,
            transform: [{ scale: initialScale }],
          },
        ]}
        resizeMode="cover"
        pointerEvents="none"
      />
      
      {/* Overlay for better content visibility */}
      <View style={[styles.content ]}>
        {children}
      </View>
    </View>
  );
};

const LoginPage = ({ navigation }) => {

  //theme 
  const { resolvedTheme } = useTheme();
  // Zustand Hydration
  const { loadAuth, hydrated: authHydrated, login, user: zustandUser, isLoggedIn, token  } = useAuthStore();
  const { loadSettings, hydrated: settingsHydrated } = useSettingsStore();
  const { loadProfile, hydrated: profileHydrated, updateProfile } = useProfileStore();
  const { loadInsights, hydrated: insightsHydrated } = useInsightsStore();

  //Auth0 access
  const { authorize, user: auth0User, error, isLoading } = useAuth0();

  //loading all stored data from zustand
  useEffect(() => {
    const hydrateAll = async () => {
      await Promise.all([
        loadAuth(),
        loadSettings(),
        loadProfile(auth0User),
        loadInsights()
      ]);
    };

    hydrateAll();  

    //behavior when user login is detected
    if (auth0User ) {
      //updateProfile(auth0User);
      navigation.navigate('Feed');
    }
  }, [auth0User, isLoggedIn, login, navigation]);

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

  const onLoginPress = async () => {
    try{
      const token = await authorize();
      if (token){
        login(token.accessToken);
      }
    } catch (e){
      console.error('Login failed', e);
    }
  };
  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BackgroundAnimation>
        <Logo/>
        <View style={Styles.buttonContainer} key="login-button-container">
          <LoginButton 
            onLoginPress={onLoginPress} //auth0 login
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

const Logo = () => {
  const tintColor = "rgba(0, 0, 0, 0.25)";
  return(
    <View style={styles.logo}>
            <Image 
              source={require('../../../assets/icon.png')}
              style={{
                  position: 'absolute',
                  tintColor: tintColor, // outline color
                  transform: [{ translateX: -2 }, { translateY: -2 }],
              }}
              resizeMode="contain"
          />
          <Image 
              source={require('../../../assets/icon.png')}
              style={{
                  position: 'absolute',
                  tintColor: tintColor,
                  transform: [{ translateX: 2 }, { translateY: -2 }],
              }}
              resizeMode="contain"
          />
          <Image 
              source={require('../../../assets/icon.png')}
              style={{
                  position: 'absolute',
                  tintColor: tintColor,
                  transform: [{ translateX: -2 }, { translateY: 2 }],
              }}
              resizeMode="contain"
          />
          <Image 
              source={require('../../../assets/icon.png')}
              style={{
                  position: 'absolute',
                  tintColor: tintColor,
                  transform: [{ translateX: 2 }, { translateY: 2 }],
              }}
              resizeMode="contain"
          />
          
          {/* Original image on top */}
          <Image 
              source={require('../../../assets/icon.png')}
              resizeMode="contain"
          />
          {/* <Image source={require('../../../assets/icon.png')} style={styles.imageOutline}  resizeMode="contain" /> */}
    </View>
  );
};

const LoginButton = ({ onLoginPress, error, isLoading, currentUser, navigation }) => {

  const navigateToFeed = () => {
    navigation.navigate('Feed');
  };

  if (isLoading) {
    return (
      <View style={styles.loginButtonWrapper}>
        <View style={styles.blurContainer}>
          <Button onPress={navigateToFeed} title='auth0 error, navigate to Feed'/>
        </View>
      </View>
    );
  }

  return (

    <View style={styles.loginButtonWrapper}>
    <View style={styles.blurContainer}>
      <BlurView
        style={styles.blurButton}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.3)"
      >
        <Pressable style={styles.pressableArea} onPress={onLoginPress}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </BlurView>
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

  //BACKGROUND
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
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    top:'-10%',
    flex: 1,
    zIndex: 2,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },

  //BUTTON
  loginButtonWrapper: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '55%', // slightly below center
    left: 0,
    right: 0,
  },
  blurContainer: {
    borderRadius: 50,
    overflow: 'hidden',
    width: 250,
    height: 80,
    // Outline styling
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.15)',
  },
  blurButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressableArea: {
    width: 250,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'rgba(0, 0, 0, 0.51)',
    fontSize: 24,
    fontWeight: 'bold',
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

export default LoginPage;
export { LoginButton };