import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Styles, GroupColours } from './Styles';
import { useTheme } from '../../Themes/ThemeContext';

const TaskCard = ({ item, navigation }) => {
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
      </View>
    </Pressable>
  );
};

export default TaskCard;
