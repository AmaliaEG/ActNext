import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons for the menu icon

const Feed = () => {
  const navigation = useNavigation(); // Access the navigation object using the hook
  const [colors] = useState([
    { id: '1', colour: 'red', description: 'task1' },
    { id: '2', colour: 'blue', description: 'task2' },
    { id: '3', colour: 'green', description: 'task3' },
    { id: '4', colour: 'black', description: 'task4' },
    { id: '5', colour: 'purple', description: 'task5' },
    { id: '6', colour: 'orange', description: 'task6' },
    { id: '7', colour: 'pink', description: 'task7' },
    { id: '8', colour: 'brown', description: 'task8' },
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        <Pressable onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Ionicons name="menu" size={30} color="black" />
        </Pressable>
      </View>

      <FlatList
        keyExtractor={(item) => item.id}
        data={colors}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate('Details', { item }) // Navigate to Details screen and pass the item
            }
          >
            <View style={[styles.item, { backgroundColor: item.colour }]}>
              <Text style={styles.text}>{item.description}</Text>
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
  menuContainer: {
    marginBottom: 10,
  },
  menuButton: {
    padding: 10,
    marginTop: 20,
  },
});

export default Feed;
