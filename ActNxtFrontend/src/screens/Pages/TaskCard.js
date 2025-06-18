/**
 * @file TaskCard.js
 * @description
 * Reusable component that renders a single task/insight card, including the company name, title, a short description,
 * due date, and optional status indicators such as "Overdue" and "Unarchive".
 * Navigates to the TaskExpansion ("Details") screen when pressed.
 * The card adapts to the current theme and displays a color dot based on the SalesAnalysisId group.
 * @module TaskCard
 * @author s235280
 * @since 2025-09-06
 */


import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Styles, GroupColours } from './Styles';
import { useTheme } from '../../Themes/ThemeContext';

/**
 * TaskCard component displays summary information about a task.
 * Includes companu name, title, first sentence of the description, assigned date, and visual indicators.
 * Optionally renders an "Unarchive" button if `showUnarchive` is true and `onUnarchive` is provided.
 * 
 * @component
 * @param {Object} props - Component props. 
 * @param {Object} props.item - The task object containing insight data.
 * @param {Object} props.navigation - React Navigation object for navigation to details screen.
 * @param {boolean} [props.showUnarchive=false] - Whether to display the unarchive button.
 * @param {function} [props.onUnarchive=null] - Callback function when unarchive is pressed. Receives the task ID.
 * @returns {JSX.Element} A themed, pressable card representing a task.
 */
const TaskCard = ({ item, navigation, showUnarchive = false, onUnarchive = null }) => {
  const { theme } = useTheme();

  return (
    <Pressable onPress={() => navigation.navigate('Details', { taskId: item.Id })}>
      <View style={[
        Styles.item,
        {
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.borderColor,
          color: theme.colors.subText
         
        }
      ]}>
        <View style={Styles.info}>
          <View style={[Styles.colorDot, { backgroundColor: GroupColours[item.SalesAnalysisId] }]} />
          <Text style={[Styles.CompanyNameText, { color: theme.colors.text }]}>{item.CompanyName}</Text>
        </View>

        <Text style={[Styles.text, { color: theme.colors.text, fontWeight: 'bold' }]}>{item.Title}</Text>
        <Text style={[Styles.descriptionText, { color: theme.colors.subText, fontStyle: 'italic' }]}>
          {item.firstSentence || item.Description.split('.')[0].trim() + '.'}
        </Text>
        <Text style={[Styles.dateText, { color: theme.colors.subText }]}>
          Due: {new Date(item.dateAssigned).toLocaleDateString()}
        </Text>

        {item.isOverdue && (
          <View style={Styles.warningContainer}>
            <Ionicons name="warning" size={18} color="yellow" />
            <Text style={Styles.warningText}>Overdue!</Text>
          </View>
        )}

        {showUnarchive && onUnarchive && (
          <Pressable
            onPress={() => onUnarchive(item.Id)}
            style={[
              Styles.unarchiveButton,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.subText,
                borderWidth: 1,
              },
            ]}
          >
            <Text style={[Styles.unarchiveButtonText, { color: theme.colors.text }]}>Unarchive</Text>
          </Pressable>
        )}
        
      </View>
    </Pressable>
  );
};

export default TaskCard;
