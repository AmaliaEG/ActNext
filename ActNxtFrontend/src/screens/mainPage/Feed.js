import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
//import Mock from './MockTasks.json'; // Import JSON data
import Mock from './JSON_Mockdata.json'; // Import JSON data
import useInsightsStore from '../../store/useInsightsStore';

const GroupColours = {
  1: '#E862AE', // Light salmon for Win Back
  2: '#F8CF46', // Gold for Regain Performance
  3: '#5CD2CD'  // Pale green for Growth
};

const Feed = () => {
  const navigation = useNavigation();
  const { insights, setInsights, hydrated } = useInsightsStore();

  const getTheFirstSentence = (description) => {
    if (!description) return '';
    const sentences = description.split('.');
    return sentences[0].trim() + (sentences.length > 1 ? '.' : '');
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
        <View style={styles.centered}>
            <ActivityIndicator size="large" />
            <Text>Loading insights...</Text>
        </View>
      );
  }

  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        <Pressable onPress={() => navigation.openDrawer()} style={styles.menuButton} testID='burger-menu'>
          <Ionicons name="menu" size={30} color="black" />
        </Pressable>
      </View>

      <FlatList
        keyExtractor={(item) => item.Id.toString()}
        data={insights}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('Details', {taskId: item.Id})}>
            <View style={styles.item}>
              <View style={styles.info}>
                <View style={[styles.colorDot, { backgroundColor: GroupColours[item.SalesAnalysisId] }]} />
                <Text style={styles.CompanyNameText}>{item.CompanyName}</Text>
              </View>
              
              <Text style={styles.text}>{item.Title}</Text>
              <Text style={styles.descriptionText}>{item.firstSentence}</Text>
              <Text style={styles.dateText}>Due: {new Date(item.dateAssigned).toLocaleDateString()}</Text>

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
    backgroundColor: '#f5f5f5',
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
    backgroundColor: 'white',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20, 
  },
  dateText: {
    color: 'gray',
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
    color: 'gray',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 20, 
    fontStyle: 'italic', 
  },
});

export default Feed;