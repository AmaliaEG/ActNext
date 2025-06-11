import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Pressable, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Mock from './JSON_Mockdata.json'; // Import JSON data
import useInsightsStore from '../../store/useInsightsStore';
import { useTheme } from '../../Themes/ThemeContext';
import { Styles } from './Styles';
import TaskCard from './TaskCard';

const Feed = () => {
  const navigation = useNavigation();
  const { insights, setInsights, hydrated } = useInsightsStore();
  const { theme } = useTheme();

  const getTheFirstSentence = (description) => {
    if (!description) return '';
    const sentences = description.split('.');
    return sentences[0].trim() + (sentences.length > 1 ? '.' : '');
  };  

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await useInsightsStore.getState().clearInsights(); // clear AsyncStorage
    await useInsightsStore.getState().loadInsights();  // reload mock data
    setRefreshing(false);
  };

  useEffect(() => {
    if (hydrated && insights.length === 0) {
      const currentDate = new Date();
      const processedTasks = Mock.map((task) => {
        const dateAssigned = new Date(task.DtCreate);
        return {
          ...task,
          dateAssigned,
          isOverdue: dateAssigned < currentDate,
          firstSentence: getTheFirstSentence(task.Description),
        };
      // Sorts by date (earliest first)
      }).sort((a, b) => a.dateAssigned - b.dateAssigned);
    }
  }, [hydrated]);

  if (!hydrated) {
      return (
        <View style={[Styles.centered, { backgroundColor: theme.colors.background }]}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={{ color: theme.colors.text, marginTop: 8 }}>Loading insights...</Text>
        </View>
      );
  }

  return (
    <View style={[Styles.container, { backgroundColor: theme.colors.background  }]}>
      <View style={[Styles.menuContainer, { backgroundColor: theme.colors.insightBackground }]}>
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