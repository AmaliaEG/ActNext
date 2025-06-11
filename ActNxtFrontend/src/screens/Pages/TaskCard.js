// components/TaskCard.js
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Styles, GroupColours } from './Styles';
import { useTheme } from '../../Themes/ThemeContext';


const TaskCard = ({ 
  item, 
  navigation,
  backgroundColor,
  textColor,
  subTextColor,
  shadowColor,
  shadowOpacity,
  showUnarchive = false,
  onUnarchive = null
}) => {
  const { theme } = useTheme();
  return (
    <Pressable onPress={() => navigation.navigate('Details', { taskId: item.Id })}>
      <View style={[
        Styles.item, 
        { 
          shadowColor: shadowColor, 
          shadowOpacity: shadowOpacity, 
          backgroundColor: backgroundColor
        }
      ]}>
        <View style={Styles.info}>
          <View style={[Styles.colorDot, { backgroundColor: GroupColours[item.SalesAnalysisId] }]} />
          <Text style={[Styles.CompanyNameText, { color: theme.colors.text }]}>{item.CompanyName}</Text>
        </View>
        
        <Text style={[Styles.text, { color: theme.colors.text }]}>{item.Title}</Text>
        <Text style={[Styles.descriptionText, { color: theme.colors.subText }]}>
          {item.firstSentence || item.Description.split('.')[0].trim() + '.'}
        </Text>
        <Text style={[Styles.dateText, { color: theme.colors.subText }]}>
          Due: {new Date(item.dateAssigned).toLocaleDateString()}
        </Text>

        {item.isOverdue && (
          <View style={Styles.warningContainer}>
            <Ionicons name="warning" size={20} color="yellow" />
            <Text style={Styles.warningText}>Overdue!</Text>
          </View>
        )}

        {showUnarchive && onUnarchive && (
          <Pressable
            onPress={() => onUnarchive(item.Id)}
            style={[
              Styles.unarchiveButton,
              {
                backgroundColor: theme.colors.backgroundColor,
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