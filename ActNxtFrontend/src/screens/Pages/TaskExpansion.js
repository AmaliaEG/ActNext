import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Stylesheet, ActivityIndicator, TextInput, Platform, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useInsightsStore from '../../store/useInsightsStore';
import { Styles } from './Styles';
import { useTheme } from '../../Themes/ThemeContext';

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
  const { theme } = useTheme();

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
      <View style={Styles.centered}>
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardDismissMode="on-drag"
        >
          <View style={[Styles.Taskcontainer,{ backgroundColor: theme.colors.background }]}>
          {/* Head bar */}
          <View style = {[Styles.Taskheader, {backgroundColor: theme.colors.background}]}>
            <TouchableOpacity onPress={() => navigation.navigate('Feed')} style={Styles.backButton}>
              <Ionicons name = "arrow-back" size = {24} color = {theme.colors.text} />
            </TouchableOpacity>
            <Text style={[Styles.TaskTitle, { color: theme.colors.text }]}>
              {task.Title || "Task title"}
            </Text>
            <View style={Styles.rightSpacer} /> 
          </View>

          {/*Main content */}
          <View style = {[Styles.contentContainer,{borderLeftColor: theme.colors.borderLeft}]}>
            <View style={Styles.companyRow}>
              {/*Company name*/}
              <View style={[
                Styles.companyNameContainer, 
                {color: theme.colors.inputText}, 
                {backgroundColor: theme.colors.inputBg}, 
                {borderColor: theme.colors.border}]}>
                <Text style={[Styles.companyName, {color: theme.colors.text}]}>{task.CompanyName} </Text>
              </View>
              {/*Star*/}
              <TouchableOpacity onPress={handleStarPress} style={Styles.starButton}>
                <Ionicons 
                  name={isStarred ? "star" : "star-outline"} 
                  size={24} 
                  color={isStarred ? "#FFD700" : theme.colors.subText}
                />
              </TouchableOpacity>
            </View>
            
            {/* Target Group Row*/}
            <View style={Styles.targetGroupContainer}>
            <View
              testID="color-circle"
              style={[Styles.colorCircle, { backgroundColor: targetGroup.color }]}
            />
            <Text style={[Styles.groupNameText, { color: theme.colors.text }]}>
              {targetGroup.name}
            </Text>
          </View>

            {/* Detailed description of task*/}
            <Text style={[Styles.contentText, {color: theme.colors.text}]}>{task.Description}</Text>
            {/* Like/Dislike Buttons*/}
            <View style={Styles.rightAlignedButtonContainer}>
              <TouchableOpacity
                testID='like-button'
                style={[Styles.button, feedback.liked && Styles.likedButton]}
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
                style={[Styles.button, feedback.disliked && Styles.dislikedButton]}
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
          <View style={Styles.commentSection}>
            <Text style={[Styles.commentTitle, {color: theme.colors.text}]}>My Notes</Text>
            <TextInput
              style={[Styles.commentInput, { backgroundColor: theme.colors.inputBackground, color: theme.colors.text },
              ]}
              placeholder="Type your notes here..."
              placeholderTextColor="#999"
              multiline
              value={comment}
              onChangeText={setComment}
              onSubmitEditing={handleCommentSubmit}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={Styles.saveButton}
              onPress={handleCommentSubmit}
              disabled={!comment.trim()}
            >
              <Text style={Styles.saveButtonText}>
                {getTaskComment(taskId) ? 'Update Notes' : 'Save Notes'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Finish button */}
          <View style={Styles.finishedButtonContainer}>
            <TouchableOpacity
              style={Styles.finishedButton}
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
              <Text style={Styles.finishedButtonText}>Finished</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    
  );
};

export default TaskExpansion;


