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

  // Theme colours 
  const { resolvedTheme } = useTheme();
  const backgroundColor = resolvedTheme === 'dark' ? '#000000' : '#FFFFFF';
  const insightBackground = resolvedTheme === 'dark' ? '#1E1E1E' : '#FFFFFF';

  const textColor = resolvedTheme === 'dark' ? '#FFFFFF' : '#000000';
  const subTextColor = resolvedTheme === 'dark' ? '#BBBBBB' : '#666666';

  const shadowColor = resolvedTheme === 'dark' ? '#FFFFFF' : '#000000';
  const shadowOpacity = resolvedTheme === 'dark' ? 0.10 : 0.10;

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
        <View style={[Styles.centered, { backgroundColor }]}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={{ color: textColor, marginTop: 8 }}>Loading insights...</Text>
        </View>
      );
  }

  return (
    <View style={[Styles.container, { backgroundColor }]}>
      <View style={Styles.menuContainer}>
        <Pressable onPress={() => navigation.openDrawer()} style={Styles.menuButton} testID='burger-menu'>
          <Ionicons 
            name="menu" 
            size={Styles.menuIcon.size} 
            color={textColor}
          />
        </Pressable>
        <Text style={[Styles.screenTitle, { color: textColor }]}>Insights</Text>
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
            backgroundColor={insightBackground}
            textColor={textColor}
            subTextColor={subTextColor}
            shadowColor={shadowColor}
            shadowOpacity={shadowOpacity}
          />
        )}
      />
    </View>
  );
};

export default Feed;