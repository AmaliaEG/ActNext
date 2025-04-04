import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TaskExpansion = ({ task, onLike, onDislike, onStar, onComplete }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isStarred, setIsStarred] = useState(task.isStarred || false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setIsDisliked(false);
    onLike && onLike(task.id, !isLiked);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    setIsLiked(false);
    onDislike && onDislike(task.id, !isDisliked);
  };

  const handleStar = () => {
    const newStarredState = !isStarred;
    setIsStarred(newStarredState);
    onStar && onStar(task.id, newStarredState);
  };

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete && onComplete(task.id);
  };

  return (
    <View style={styles.container}>
      {/* Task Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.description}>{task.description}</Text>
        
        {task.group && (
          <View style={[
            styles.groupTag,
            task.group === 'aboutToLeave' && styles.aboutToLeave,
            task.group === 'shopOften' && styles.shopOften,
            task.group === 'newShoppers' && styles.newShoppers
          ]}>
            <Text style={styles.groupText}>
              {task.group === 'aboutToLeave' ? 'About to Leave' : 
               task.group === 'shopOften' ? 'Frequent Shopper' : 'New Shopper'}
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
          <Ionicons 
            name={isLiked ? "thumbs-up" : "thumbs-up-outline"} 
            size={24} 
            color={isLiked ? "#4CAF50" : "#666"} 
          />
          <Text style={styles.actionText}>Useful</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDislike} style={styles.actionButton}>
          <Ionicons 
            name={isDisliked ? "thumbs-down" : "thumbs-down-outline"} 
            size={24} 
            color={isDisliked ? "#F44336" : "#666"} 
          />
          <Text style={styles.actionText}>Not Useful</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleStar} style={styles.actionButton}>
          <Ionicons 
            name={isStarred ? "star" : "star-outline"} 
            size={24} 
            color={isStarred ? "#FFC107" : "#666"} 
          />
          <Text style={styles.actionText}>Star</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleComplete} 
          style={[styles.completeButton, isCompleted && styles.completedButton]}
          disabled={isCompleted}
        >
          <Text style={styles.completeButtonText}>
            {isCompleted ? 'Completed' : 'Mark Complete'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contentContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  groupTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  aboutToLeave: {
    backgroundColor: '#FFEBEE',
  },
  shopOften: {
    backgroundColor: '#E8F5E9',
  },
  newShoppers: {
    backgroundColor: '#E3F2FD',
  },
  groupText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  actionButton: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  completeButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  completedButton: {
    backgroundColor: '#E0E0E0',
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default TaskExpansion;