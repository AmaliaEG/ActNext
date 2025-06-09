import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Mock from './JSON_Mockdata.json'; // Import JSON data
import useInsightsStore from '../../store/useInsightsStore';
import { useTheme } from '../../Themes/ThemeContext';

const GroupColours = {
  1: '#E862AE', // Light salmon for Win Back
  2: '#F8CF46', // Gold for Regain Performance
  3: '#5CD2CD'  // Pale green for Growth
};

const Feed = () => {
  const navigation = useNavigation();
  const { insights, setInsights, hydrated } = useInsightsStore();

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
      
      setInsights(processedTasks.slice(0, 3));
    }
  }, [hydrated]);

  if (!hydrated) {
      return (
        <View style={[styles.centered, { backgroundColor }]}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={{ color: textColor, marginTop: 8 }}>Loading insights...</Text>
        </View>
      );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.menuContainer}>
        <Pressable onPress={() => navigation.openDrawer()} style={styles.menuButton} testID='burger-menu'>
          <Ionicons name="menu" size={30} color={textColor} />
        </Pressable>
        <Text style={[styles.screenTitle, { color: textColor }]}>Insights</Text>
      </View>

      <FlatList
        keyExtractor={(item) => item.Id.toString()}
        data={insights.filter(task => !task.isArchived).slice(0, 3)}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('Details', {taskId: item.Id})}>
            <View style={[styles.item, { backgroundColor: insightBackground, shadowColor: shadowColor, shadowOpacity: shadowOpacity }]}>
              <View style={styles.info}>
                <View style={[styles.colorDot, { backgroundColor: GroupColours[item.SalesAnalysisId] }]} />
                <Text style={[styles.CompanyNameText, { color: textColor }]}>{item.CompanyName}</Text>
              </View>
              
              <Text style={[styles.text, { color: textColor }]}>{item.Title}</Text>
              <Text style={[styles.descriptionText, { color: subTextColor }]}>{item.firstSentence}</Text>
              <Text style={[styles.dateText, { color: subTextColor }]}>Due: {new Date(item.dateAssigned).toLocaleDateString()}</Text>

              {item.isOverdue && (
                <View style={styles.warningContainer}>
                  <Ionicons name="warning" size={20} color="yellow" />
                  <Text style={styles.warningText}>Overdue!</Text>
                </View>
              )}
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  info: {
    padding: 5,
  },
  colorDot: {
    position: 'absolute',
    marginLeft: -5,
    width: 15,
    height: 15,
    borderRadius: 50,
  },
  CompanyNameText: {
    marginLeft: 15,
    marginTop: -7,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20, 
  },
  dateText: {
    fontSize: 12,
    marginTop: 5,
    marginLeft: 20, 
  },
  menuContainer: {
    marginBottom: 10,
  },
  menuButton: {
    padding: 10,
    marginTop: 20,
  },
  warningContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
  },
  warningText: {
    color: 'yellow',
    marginLeft: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 12,
    marginTop: 5,
    marginLeft: 20, 
    fontStyle: 'italic', 
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default Feed;