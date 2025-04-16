import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Feed = () => {
  const navigation = useNavigation();

  const allTasks = [
    { id: '1', colour: 'red', description: 'task1', dateAssigned: '04/30/2025' },
    { id: '2', colour: 'blue', description: 'task2', dateAssigned: '04/19/2025' },
    { id: '3', colour: 'green', description: 'task3', dateAssigned: '04/25/2025' },
    { id: '4', colour: 'black', description: 'task4', dateAssigned: '05/05/2025' },
    { id: '5', colour: 'purple', description: 'task5', dateAssigned: '04/10/2025' },
    { id: '6', colour: 'orange', description: 'task6', dateAssigned: '05/08/2025' },
    { id: '7', colour: 'pink', description: 'task7', dateAssigned: '06/01/2025' },
    { id: '8', colour: 'brown', description: 'task8', dateAssigned: '06/02/2025' },
  ];

  const [userTasks, setUserTasks] = useState([]);

  useEffect(() => {
    assignTasks();
  }, []);

  /*
 * Assigns the next three tasks based on their assigned date.
 * 
 * This function does the following:
 * 1. Gets the current date.
 * 2. Converts the dateAssigned string from each task into a Date object.
 * 3. Determines if each task is overdue (if its date is before the current date).
 * 4. Sorts all tasks in ascending order based on their assigned date.
 * 5. Selects the first three tasks from the sorted list.
 * 6. Updates the state to display these three tasks.
 */
  const assignTasks = () => {
    const currentDate = new Date();
  
    
    const sortedTasks = allTasks
      .map((task) => {
        const [month, day, year] = task.dateAssigned.split('/');
        const taskDate = new Date(year, month - 1, day);
  
        return {
          ...task,
          dateAssigned: taskDate,
          isOverdue: taskDate < currentDate,
        };
      })
      .sort((a, b) => a.dateAssigned - b.dateAssigned); 
  
    const tasksToAdd = sortedTasks.slice(0, 3);
    setUserTasks(tasksToAdd);
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        <Pressable onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Ionicons name="menu" size={30} color="black" />
        </Pressable>
      </View>

      <FlatList
  keyExtractor={(item) => item.id}
  data={userTasks}
  renderItem={({ item }) => (
    <Pressable onPress={() => navigation.navigate('Details', { item })}>
      <View style={[styles.item, { backgroundColor: item.colour }]}>
        <Text style={styles.text}>{item.description}</Text>
        <Text style={styles.dateText}>Due: {item.dateAssigned.toLocaleDateString()}</Text> /* gives us the date in a readable format */

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
  item: {
    padding: 50,
    marginVertical: 8,
    borderRadius: 10,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
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
  
});

export default Feed;
