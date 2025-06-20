/**
 * @file ArchivedTasks.js
 * @description
 * This screen displays all insights that the user has marked as archived. If no insights are archived, a fallback message is shown.
 * The screen includes drawer navigation and supports dynamic theming.
 * State is managed globally via Zustand.
 * @module ArchivedTasks
 * @author s224837 and s235280
 * @since 2025-04-06
 */

import React, { useMemo } from 'react';
import { View, FlatList, Text, Pressable, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useInsightsStore from '../../store/useInsightsStore';
import { useTheme } from '../../Themes/ThemeContext';
import { Styles } from './Styles';
import TaskCard from './TaskCard';


/**
 * ArchivedTasks displays all insights that have been marked as archived (finished) by the user.
 * It allows unarchiving tasks using Zustand actions and adapts styling using the active theme.
 * 
 * @component
 * @returns {JSX.Element} A screen displaying archived tasks in a scrollable list. If none exist, it shows an empty-state message.
 */
const ArchivedTasks = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { insights, hydrated, unarchiveTask } = useInsightsStore();

  /**
   * Filters insights to include only those marked as archived.
   * Uses Zustand hydration and `task.isArchived` flag.
   * @author s235280
   */
  const archivedTasks = useMemo(() => {
      if (!hydrated || !insights) return [];
      return insights.filter(task => task.isArchived);
    }, [hydrated, insights]);

  if (!hydrated) {
      return (
        <View style={Styles.centered}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={{ color: theme.colors.text, marginTop: 8 }}>Loading archived insights...</Text>
        </View>
      );
  }

  return (
    <View style={[Styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[Styles.menuContainer,{backgroundColor: theme.colors.cardBg}]}>
        <Pressable onPress={() => navigation.openDrawer()} style={Styles.menuButton} testID='burger-menu'>
          <Ionicons 
            name="menu" 
            size={Styles.menuIcon.size}
          />
        </Pressable>
        <Text style={[Styles.screenTitle, { color: theme.colors.text }]}>Archive</Text>
      </View>

      <Image style={Styles.backgroundImage}  source={require('../../../assets/icon.png')} resizeMode="contain"/>

      <FlatList
        keyExtractor={(item) => item.Id.toString()}
        data={archivedTasks}
        renderItem={({ item }) => (
          <TaskCard 
            item={item}
            navigation={navigation}
            backgroundColor={theme.colors.insightBackground}
            textColor={theme.colors.text}
            subTextColor={theme.colors.subText}
            shadowColor={theme.colors.shadow}
            shadowOpacity={theme.colors.shadowOpacity}
            showUnarchive={true}
            onUnarchive={unarchiveTask}
          />
        )}
        ListEmptyComponent={
          <Text style={[{ textAlign: 'center', marginTop: 30 }, { color: theme.colors.text }]}>No archived tasks yet.</Text>
        }
      />
    </View>
  );
};

export default ArchivedTasks;