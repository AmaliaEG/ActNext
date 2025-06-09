// components/TaskCard.js
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Styles, GroupColours } from './Styles';

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
  return (
    <Pressable onPress={() => navigation.navigate('Details', { taskId: item.Id })}>
      <View style={[
        Styles.item, 
        { 
          backgroundColor: backgroundColor, 
          shadowColor: shadowColor, 
          shadowOpacity: shadowOpacity 
        }
      ]}>
        <View style={Styles.info}>
          <View style={[Styles.colorDot, { backgroundColor: GroupColours[item.SalesAnalysisId] }]} />
          <Text style={[Styles.CompanyNameText, { color: textColor }]}>{item.CompanyName}</Text>
        </View>
        
        <Text style={[Styles.text, { color: textColor }]}>{item.Title}</Text>
        <Text style={[Styles.descriptionText, { color: subTextColor }]}>
          {item.firstSentence || item.Description.split('.')[0].trim() + '.'}
        </Text>
        <Text style={[Styles.dateText, { color: subTextColor }]}>
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
                backgroundColor: backgroundColor,
                borderColor: subTextColor,
                borderWidth: 1,
              },
            ]}
          >
            <Text style={[Styles.unarchiveButtonText, { color: textColor }]}>Unarchive</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

export default TaskCard;