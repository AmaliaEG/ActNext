import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useInsightsStore from '../../store/useInsightsStore';

const GroupColours = {
  1: '#E862AE', // Light salmon for Win Back
  2: '#F8CF46', // Gold for Regain Performance
  3: '#5CD2CD'  // Pale green for Growth
};

const StarredTasks = () => {
  const navigation = useNavigation();
  const { insights, hydrated, getStarStatus } = useInsightsStore();
  const [starredTasks, setStarredTasks] = useState([]);

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
        <View style={styles.centered}>
            <ActivityIndicator size="large" />
            <Text>Loading starred insights...</Text>
        </View>
      );
  }

  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        <Pressable onPress={() => navigation.openDrawer()} style={styles.menuButton} testID='burger-menu'>
          <Ionicons name="menu" size={30} color="black" />
        </Pressable>
        <Text style={styles.screenTitle}>Starred</Text>
      </View>

      <FlatList
        keyExtractor={(item) => item.Id.toString()}
        data={starredTasks}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('Details', {taskId: item.Id})}>
            <View style={styles.item}>
              <View style={styles.info}>
                <View style={[styles.colorDot, { backgroundColor: GroupColours[item.SalesAnalysisId] }]} />
                <Text style={styles.CompanyNameText}>{item.CompanyName}</Text>
              </View>
              
              <Text style={styles.text}>{item.Title}</Text>
              <Text style={styles.descriptionText}>{getTheFirstSentence(item.Description)}</Text>
              <Text style={styles.dateText}>Due: {new Date(item.dateAssigned).toLocaleDateString()}</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 30 }}>No starred tasks yet.</Text>
        }
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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
  descriptionText: {
    color: 'gray',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 20, 
    fontStyle: 'italic', 
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  menuButton: {
    padding: 1,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: 'black'
  },
});

export default StarredTasks;