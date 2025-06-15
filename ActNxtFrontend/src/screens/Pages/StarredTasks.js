import React, { useState, useEffect, useMemo } from 'react';
import { View, FlatList, Text, Pressable, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useInsightsStore from '../../store/useInsightsStore';
import { useTheme } from '../../Themes/ThemeContext';
import { Styles } from './Styles';
import TaskCard from './TaskCard';

const StarredTasks = () => {
  const navigation = useNavigation();
  const { insights, hydrated, getStarStatus } = useInsightsStore();
  const { theme } = useTheme();

  const starredTasks = useMemo(() => {
    if (!hydrated || !insights) return [];
    return insights.filter(task => getStarStatus(task.Id));
  }, [hydrated, insights, getStarStatus]);

  if (!hydrated) {
      return (
        <View style={[Styles.centered, { backgroundColor: theme.colors.background }]}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={{ color: theme.colors.text, marginTop: 8 }}>Loading starred insights...</Text>
        </View>
      );
  }

  return (
    <View style={[Styles.container, { backgroundColor: theme.colors.background  }]}>
      <View style={[Styles.menuContainer, { backgroundColor: theme.colors.cardBg }]}>
        <Pressable 
          onPress={() => navigation.openDrawer()} 
          style={Styles.menuButton} 
          testID='burger-menu'>
          <Ionicons 
            name="menu" 
            size={Styles.menuIcon.size}
            color={theme.colors.text}
          />
        </Pressable>
        <Text style={[Styles.screenTitle, { color: theme.colors.text }]}>Favorites</Text>
      </View>

      <Image style={Styles.backgroundImage}  source={require('../../../assets/icon.png')} resizeMode="contain"/>

      <FlatList
        keyExtractor={(item) => item.Id.toString()}
        data={starredTasks}
        renderItem={({ item }) => (
          <TaskCard 
            item={item}
            navigation={navigation}
            backgroundColor={theme.colors.insightBackground}
            textColor={theme.colors.text}
            subTextColor={theme.colors.subText}
            shadowColor={theme.colors.shadowColor}
            shadowOpacity={theme.colors.shadowOpacity}
          />
        )}
        ListEmptyComponent={
          <Text style={[Styles.descriptionText, { 
            textAlign: 'center', 
            marginTop: 30, 
            color: theme.colors.shadowColor,
          }]}>
            <Text style={[ { color: theme.colors.text }]}>No starred tasks yet.</Text>
          </Text>
        }
      />
    </View>
  );
};

export default StarredTasks;