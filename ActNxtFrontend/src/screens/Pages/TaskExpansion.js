/**
 * @file TaskExpansion.js
 * @description
 * Detailed view screen for a single task/insight.
 * Displays full description, target group, reaction buttons (like/dislike), user notes, and a "Finished" button to archive the task.
 * Integrates with Zustand for feedback, comments, star status, and archive management.
 * Fully themed and supports keyboard-safe input on all platforms.
 * 
 * @module TaskExpansion
 * @author s235280
 * @since 2025-03-05
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Stylesheet, ActivityIndicator, TextInput, Platform, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Image} from 'react-native';
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

/**
 * This screen shows the full details of a selected task, allowing users to:
 * - Read the full task description and target group
 * - React with like/dislike
 * - Add or update personal notes
 * - Star the task or mark it as finished (archived)
 * 
 * Uses keyboard-aware layout and react to theme changes.
 * 
 * @component
 * @param {Object} props - Props passed from navigation. 
 * @param {Object} props.route - React Navigation route object containing taskId in `params`. 
 * @returns {JSX.Element} The full task detail screen.
 */
const TaskExpansion = ({ route }) => {
  const { taskId } = route.params;
  const { insights, addFeedback, getFeedback, hydrated, updateTaskComment, getTaskComment, toggleStar, getStarStatus, archiveTask } = useInsightsStore();
  const navigation = useNavigation();
  const [feedback, setFeedback] = useState({liked: false, disliked: false});
  const [comment, setComment] = useState('');
  const [isStarred, setIsStarred] = useState(false);
  const { theme } = useTheme();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef();

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

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
    <View style={[Styles.container, { backgroundColor: theme.colors.background  }]}>
        <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Background Image*/}
      <Image 
        style={Styles.backgroundImage}
        source={require('../../../assets/blur.png')}
        resizeMode="contain"
      />
      {/* Fixed Header (outside ScrollView) */}
      <View style={[Styles.menuContainer, { backgroundColor: theme.colors.cardBg }]}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Feed')} 
          style={Styles.menuButton} 
          testID='back-button'
        >
          <Ionicons 
            name="arrow-back" 
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        <Text style={[Styles.TaskTitle, { color: theme.colors.text }]}>
          {task.Title || "Task title"}
        </Text>
        <View style={Styles.rightSpacer} />
      </View>
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 20,
          }}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          >
          
          {/*Main content */}
          <View style = {[Styles.contentContainer,{backgroundColor: theme.colors.cardBg}]}>
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
                  size={30} 
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
          <View style={[Styles.commentSection, { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 20}]}>
            <View style={Styles.commentHeader}>
                <Text style={[Styles.commentTitle, {color: theme.colors.text}]}>My Notes</Text>
                <View style={Styles.commentInputContainer}>
                  <TextInput
                  style={[Styles.commentInput, { backgroundColor: theme.colors.cardBg, color: theme.colors.text, minHeight: 100, paddingBottom: 10}]}
                  placeholder="Type your notes here..."
                  placeholderTextColor="#999"
                  multiline
                  value={comment}
                  onChangeText={setComment}
                  onSubmitEditing={handleCommentSubmit}
                  blurOnSubmit={false}
                  onFocus={() => {
                    setTimeout(() => {
                      scrollViewRef.current?.scrollToEnd({ animated: true });
                    }, 300);
                  }}
              />
                </View>
                
              <TouchableOpacity
                style={[Styles.saveButton, {opacity: comment.trim() ? 1 : 0.5,backgroundColor: theme.colors.primary || '#2196F3'}]}
                onPress={handleCommentSubmit}
                disabled={!comment.trim()}
              >
                <Text style={[Styles.saveButtonText, {color: theme.colors.text}]}>
                  {getTaskComment(taskId) ? 'Save Notes' : 'Save Notes'}
                </Text>
              </TouchableOpacity>

              {/* Finish button */}
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </View>
  );
};

export default TaskExpansion;


