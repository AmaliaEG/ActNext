import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useInsightsStore from '../../store/useInsightsStore';
import { useTheme } from '../../Themes/ThemeContext';
import { Styles } from './Styles';
import TaskCard from './TaskCard';

const StarredTasks = () => {
  const navigation = useNavigation();
  const { insights, hydrated, getStarStatus } = useInsightsStore();
  const [starredTasks, setStarredTasks] = useState([]);

  const { theme } = useTheme();
  const {
    backgroundColor,
    insightBackground,
    textColor,
    subTextColor,
    shadowColor,
    shadowOpacity,
  } = theme.colors;


  const getTheFirstSentence = (description) => {
    if (!description) return '';
    const sentences = description.split('.');
    return sentences[0].trim() + (sentences.length > 1 ? '.' : '');
  }; 

  useEffect(() => {
    if (hydrated) {
      const filtered = insights.filter(task => getStarStatus(task.Id));
      setStarredTasks(filtered);
    }
  }, [hydrated, insights]);

  if (!hydrated) {
      return (
        <View style={[Styles.centered, { backgroundColor }]}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={{ color: textColor, marginTop: 8 }}>Loading starred insights...</Text>
        </View>
      );
  }

  return (
    <View style={[Styles.container, { backgroundColor }]}>
      <View style={[Styles.menuContainer, { backgroundColor: insightBackground }]}>
        <Pressable 
          onPress={() => navigation.openDrawer()} 
          style={Styles.menuButton} 
          testID='burger-menu'>
          <Ionicons name="menu" size={30} color={textColor} />
        </Pressable>
        <Text style={[Styles.screenTitle, { color: textColor }]}>Starred</Text>
      </View>

      <FlatList
        keyExtractor={(item) => item.Id.toString()}
        data={starredTasks}
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
        ListEmptyComponent={
          <Text style={[Styles.descriptionText, { 
            textAlign: 'center', 
            marginTop: 30, 
            color: subTextColor 
          }]}>
            No starred tasks yet.
          </Text>
        }
      />
    </View>
  );
};

export default StarredTasks;