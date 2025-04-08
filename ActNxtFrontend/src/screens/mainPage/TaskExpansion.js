import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const TaskExpansion = ({ route }) => {
  const { item } = route.params;
  const navigation = useNavigation();
  const targetGroup = {
    name: "About to leave",
    color: "#FF5252"
  }
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
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
        <TouchableOpacity
          onPress={() => navigation.navigate('Feed')}
          style={styles.backButton}
        >
          <Ionicons name = "arrow-back" size = {24} color = "black" />
        </TouchableOpacity>
        <Text style={styles.title}>{item.title ||"Task title"}</Text>
        <View style={styles.rightSpacer} /> {/*Balances header*/}
      </View>

      {/*Main content */}
      <View style = {styles.contentContainer}>
        {/* Target Group Row*/}
        <View style={styles.targetGroupContainer}>
          <View style={[styles.colorCircle, {backgroundColor: targetGroup.color}]}/>
          <Text style={styles.groupNameText}>{targetGroup.name}</Text>
        </View>

        {/* Detailed description of task*/}
        <Text style = {styles.contentText} >
          Lorem ipsum dolor sit amet, 
          consectetur adipiscing elit. Curabitur gravida maximus erat, 
          laoreet varius mi eleifend a. Suspendisse sollicitudin at mauris at tempus. 
          Donec nunc urna, laoreet id purus vel, malesuada facilisis ipsum. 
          Aliquam ac nisi dignissim, interdum enim non, commodo dui. 
          Duis lacinia dolor non est feugiat, sed aliquet massa finibus.
        </Text>

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



