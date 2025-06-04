import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
//import mockTasks from './MockTasks.json'; // Import JSON data
import mockTasks from './JSON_Mockdata.json'; // Import JSON data
import useInsightsStore from '../../store/useInsightsStore';

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
  const { insights, addFeedback, getFeedback, hydrated, updateTaskComment, getTaskComment, toggleStar, getStarStatus, archiveTask } = useInsightsStore();
  const navigation = useNavigation();
  const [feedback, setFeedback] = useState({liked: false, disliked: false});
  const [comment, setComment] = useState('');
  const [isStarred, setIsStarred] = useState(false);

  useEffect(() => {
    if (hydrated) {
      setFeedback(getFeedback(taskId));
      const taskComment = getTaskComment(taskId);
      setComment(taskComment);
      setIsStarred(getStarStatus(taskId));
    }
  }, [taskId, hydrated, insights]);

  if (!hydrated || !insights.find(t => t.Id === taskId)) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading task...</Text>
      </View>
    );
  }

  const handleReaction = (type) => {
    // Optimistic UI update
    setFeedback(prev => {
      const newState = type === 'like' 
        ? { liked: !prev.liked, disliked: false }
        : { disliked: !prev.disliked, liked: false };
      return newState;
    });
    
    // Update in store
    addFeedback(taskId, type);
  };

  const handleCommentSubmit = async () => {
    await updateTaskComment(taskId, comment);
  };

  const handleStarPress = async () => {
    const newStarStatus = !isStarred;
    setIsStarred(newStarStatus);
    await toggleStar(taskId, newStarStatus);
  };

  const task = insights.find(t => t.Id === taskId);
  const targetGroup = Groups[task.SalesAnalysisId] || Groups[1];// Fallback to group 1

  return (
    <View style={styles.container}>
      {/* Head bar */}
      <View style = {styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Feed')} style={styles.backButton}>
          <Ionicons name = "arrow-back" size = {24} color = "black" />
        </TouchableOpacity>
        <Text style={styles.Title}>{task.Title ||"Task title"}</Text>
        <View style={styles.rightSpacer} /> 
      </View>

      {/*Main content */}
      <View style = {styles.contentContainer}>
        <View style={styles.companyRow}>
          {/*Company name*/}
          <View style={styles.companyNameContainer}>
            <Text style={styles.companyName}>{task.CompanyName}</Text>
          </View>
          {/*Star*/}
          <TouchableOpacity onPress={handleStarPress} style={styles.starButton}>
            <Ionicons 
              name={isStarred ? "star" : "star-outline"} 
              size={24} 
              color={isStarred ? "#FFD700" : "#666"} 
            />
          </TouchableOpacity>
        </View>
        
        
        {/* Target Group Row*/}
        <View style={styles.targetGroupContainer}>
          <View testID='color-circle' style={[styles.colorCircle, {backgroundColor: targetGroup.color}]}/>
          <Text style={styles.groupNameText}>{targetGroup.name}</Text>
        </View>

        {/* Detailed description of task*/}
        <Text style={styles.contentText}>{task.Description}</Text>

        {/* Like/Dislike Buttons*/}
        <View style={styles.rightAlignedButtonContainer}>
          <TouchableOpacity
            testID='like-button'
            style={[styles.button, feedback.liked && styles.likedButton]}
            onPress={() => handleReaction('like')}
          >
            <Ionicons
              name={feedback.liked ? "thumbs-up" : "thumbs-up-outline"}
              size={20}
              color={feedback.liked ? "white" : "#666"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            testID='dislike-button'
            style={[styles.button, feedback.disliked && styles.dislikedButton]}
            onPress={() => handleReaction('dislike')}
          >
            <Ionicons
              name = {feedback.disliked ? "thumbs-down" : "thumbs-down-outline"}
              size={20}
              color={feedback.disliked ? "white" : "#666"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Comment Section - integrated with the input */}
      <View style={styles.commentSection}>
        <Text style={styles.commentTitle}>My Notes</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Type your notes here..."
          placeholderTextColor="#999"
          multiline
          value={comment}
          onChangeText={setComment}
          onSubmitEditing={handleCommentSubmit}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleCommentSubmit}
          disabled={!comment.trim()}
        >
          <Text style={styles.saveButtonText}>
            {getTaskComment(taskId) ? 'Update Notes' : 'Save Notes'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Finish button */}
      <View style={styles.finishedButtonContainer}>
        <TouchableOpacity
          style={styles.finishedButton}
          onPress={ async () => {
            const success = await archiveTask(taskId);
            if (success) {
              console.log('Task archived successfully');
              navigation.navigate('Feed');
            } else {
              console.warn('Archiving failed');
            }
          }}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginLeft: -8,
  },
  Title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
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
  companyRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: 10,
  },
  companyNameContainer: {
    borderWidth: 1,
    borderColor: '#f2f4f5', // Light gray border
    borderRadius: 6,
    padding: 3,
    backgroundColor: '#f2f4f5',
    alignSelf: 'flex-start',
    width: 'auto',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'regular',
    marginBottom: 3,
  },
  starButton: {
    padding: 8,
    marginRight: -8,
  },
  targetGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
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
  commentSection: {
    marginTop: 30,
    marginHorizontal: 25,
    marginBottom: 20,
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    fontSize: 15,
    lineHeight: 22,
  },
  commentHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    fontStyle: 'italic',
  },
  finishedButtonContainer: {
    position: 'absolute',
    bottom: 100,
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



