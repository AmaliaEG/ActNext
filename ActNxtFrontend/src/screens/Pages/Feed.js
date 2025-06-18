/**
 * @description
 * Displays a feed of insights with pull-to-refresh functionality.
 * Uses `useInsightsStore` for state management and `useTheme` for theming.
 * @file Feed.js
 * @module Feed
 * @returns {JSX.Element} A screen with a list of the 4 most recent insights, a menu button, and pull-to-refresh functionality.
 * @component
 * @author s235224 and s235280
 * @since 2025-04-03
 * )
 */

import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Pressable, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useInsightsStore from '../../store/useInsightsStore';
import { useTheme } from '../../Themes/ThemeContext';
import { Styles } from './Styles';
import TaskCard from './TaskCard';


const Feed = () => {
  const navigation = useNavigation();
  const { insights, hydrated } = useInsightsStore();
  const { theme } = useTheme();


/**
 * Triggers when the user pulls down to refresh is pulled to refresh.
 * @type {boolean}
 * @default false
 * @description Indicates whether the feed is currently refreshing.
 * @function onRefresh
 * @author s235224

 */
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await useInsightsStore.getState().clearInsights(); // clear AsyncStorage
    await useInsightsStore.getState().loadInsights();  // reload mock data
    setRefreshing(false);
  };

  useEffect(() => {
    if (hydrated && insights.length === 0) {
    }
  }, [hydrated]);

  if (!hydrated) {
      return (
        <View style={[Styles.centered, { backgroundColor: theme.colors.background }]}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={{ color: theme.colors.subText, marginTop: 8 }}>Loading insights...</Text>
        </View>
      );
  }
  
  return (
    <View style={[Styles.container, { backgroundColor: theme.colors.background  }]}>
      <View style={[Styles.menuContainer, { backgroundColor: theme.colors.cardBg }]}>
        <Pressable onPress={() => navigation.openDrawer()} style={Styles.menuButton} testID='burger-menu'>
          <Ionicons 
            name="menu" 
            size={Styles.menuIcon.size}
            color={theme.colors.text}
          />
        </Pressable>
        <Text style={[Styles.screenTitle, { color: theme.colors.text }]}>Insights</Text>
      </View>

      <Image style={Styles.backgroundImage}  source={require('../../../assets/icon.png')} resizeMode="contain"/>

      <FlatList
        keyExtractor={(item) => item.Id.toString()}
        data={insights.filter(task => !task.isArchived).slice(0, 4)}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          <TaskCard 
            item={item}
            navigation={navigation}
            backgroundColor={theme.colors.cardBg}
            textColor={theme.colors.text}
            subTextColor={theme.colors.subText}
            shadowColor={theme.colors.shadowColor}
            shadowOpacity={theme.colors.shadowOpacity}
          />
        )}
      />
    </View>
  );
};

export default Feed;