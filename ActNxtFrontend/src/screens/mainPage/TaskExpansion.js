import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import mockTasks from './MockTasks.json'; // Import JSON data

// Target group dictionary
const Groups = {
  1: {
    name: "Win Back Plan", 
    color: "#E862AE"
  },
  2: {
    name: "Regain Performance Plan",
    color: "#F8CF46"
  },
  3: {
    name: "Growth Plan",
    color: "#5CD2CD"
  }
}

const TaskExpansion = ({ route }) => {
  const { taskId } = route.params;
  const navigation = useNavigation();
  const [task, setTask] = useState(null);
  
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  useEffect(() => {
    const foundTask = mockTasks.find(t => t.id === taskId);
    if (foundTask) {
      setTask({
        ...foundTask,
        dateAssigned: new Date(foundTask.dateAssigned)
      });
    }
  }, [taskId]);

  if (!task) return <View style={styles.container}><Text>Loading...</Text></View>;

  const targetGroup = Groups[task.group] || Groups[1]; // Fallback to group 1

  // Like system
  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };
  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  return (
    <View style={styles.container}>
      {/* Head bar */}
      <View style = {styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Feed')} style={styles.backButton}>
          <Ionicons name = "arrow-back" size = {24} color = "black" />
        </TouchableOpacity>
        <Text style={styles.title}>{taskId.title ||"Task title"}</Text>
        <View style={styles.rightSpacer} /> 
      </View>

      {/*Main content */}
      <View style = {styles.contentContainer}>
        {/* Target Group Row*/}
        <View style={styles.targetGroupContainer}>
          <View style={[styles.colorCircle, {backgroundColor: targetGroup.color}]}/>
          <Text style={styles.groupNameText}>{targetGroup.name}</Text>
        </View>

        {/* Detailed description of task*/}
        <Text style={styles.contentText}>{task.description}</Text>

        {/* Like/Dislike Buttons*/}
        <View style={styles.rightAlignedButtonContainer}>
          <TouchableOpacity
            style={[styles.button, liked && styles.likedButton]}
            onPress={handleLike}
          >
            <Ionicons
              name={liked ? "thumbs-up" : "thumbs-up-outline"}
              size={20}
              color={liked ? "white" : "#666"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, disliked && styles.dislikedButton]}
            onPress={handleDislike}
          >
            <Ionicons
              name = {disliked ? "thumbs-down" : "thumbs-down-outline"}
              size={20}
              color={disliked ? "white" : "#666"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Finish button */}
      <View style={styles.finishedButtonContainer}>
        <TouchableOpacity
          style={styles.finishedButton}
          onPress={() => navigation.navigate('Feed')}
        >
          <Text style={styles.finishedButtonText}>Finished</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "white",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    right: 16,
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
      fontSize: 18,
      alignItems: 'center',
      color: "Black",
  },
  contentContainer:{
    padding: 25,
    margin: 16,
    marginTop: 60,
    borderLeftWidth: 1, 
    borderLeftColor: 'black',
    alignSelf: 'flex-start',
    width: 'auto',
    flexGrow: 0,
    flexShrink: 1,
  },
  targetGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -10,
    marginBottom: 12,
  },
  colorCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  groupNameText: {
    fontSize: 16,
    color: '#333',
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 16,
    borderTopColor: '#eee',
  },
  rightAlignedButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 20,
      paddingTop: 16,
  },
  button: {
    width: 40, // Fixed width for circular buttons
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  likedButton: {
      backgroundColor: '#4CAF50',
      borderColor: '#4CAF50',
  },
  dislikedButton: {
      backgroundColor: '#F44336',
      borderColor: '#F44336',
  },
  buttonText: {
      marginLeft: 8,
      color: '#666',
      fontWeight: '500',
  },
  likedText: {
      color: 'white',
  },
  dislikedText: {
      color: 'white',
  },
  finishedButtonContainer: {
    position: 'absolute',
    bottom: 170,
    left: 20,
    right: 20,
  },
  finishedButton: {
      backgroundColor: '#2196F3',
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
  },
  finishedButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
  },
});

export default TaskExpansion;



