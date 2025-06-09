import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useInsightsStore from '../../store/useInsightsStore';
import { useTheme } from '../../Themes/ThemeContext';


  const GroupColours = {
    1: '#E862AE', // Light salmon for Win Back
    2: '#F8CF46', // Gold for Regain Performance
    3: '#5CD2CD'  // Pale green for Growth
  };

  const ArchivedTasks = () => {
    const { theme } = useTheme();
    const backgroundColor = theme.colors.background;
    const textColor = theme.colors.text;
    const subTextColor = theme.colors.subText;
    const insightBackground = theme.colors.insightBackground;
    const shadowColor = theme.colors.shadow;
    const shadowOpacity = theme.colors.shadowOpacity;
    const borderColor = theme.colors.border; 

    const navigation = useNavigation();
    const { insights, hydrated, unarchiveTask } = useInsightsStore();
    const [starredTasks, setStarredTasks] = useState([]);

    
  const getTheFirstSentence = (description) => {
    if (!description) return '';
    const sentences = description.split('.');
    return sentences[0].trim() + (sentences.length > 1 ? '.' : '');
  }; 

  useEffect(() => {
    if (hydrated) {
      const filtered = insights.filter(task => task.isArchived);
      setStarredTasks(filtered);
    }
  }, [hydrated, insights]);

  if (!hydrated) {
      return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={{ color: textColor, marginTop: 8 }}>Loading archived insights...</Text>
        </View>
      );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.menuContainer,{backgroundColor:insightBackground}]}>
        <Pressable onPress={() => navigation.openDrawer()} style={styles.menuButton} testID='burger-menu'>
          <Ionicons name="menu" size={30} color={textColor} />
        </Pressable>
        <Text style={[styles.screenTitle, { color: textColor }]}>Archive</Text>
      </View>

      <FlatList
        keyExtractor={(item) => item.Id.toString()}
        data={starredTasks}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('Details', {taskId: item.Id})}>
            <View style={[styles.item, { backgroundColor: insightBackground, shadowColor: shadowColor, shadowOpacity: shadowOpacity }]}>
              <View style={styles.info}>
                <View style={[styles.colorDot, { backgroundColor: GroupColours[item.SalesAnalysisId] }]} />
                <Text style={[styles.CompanyNameText, { color: textColor }]}>{item.CompanyName}</Text>
              </View>
              
              <Text style={[styles.text, { color: textColor }]}>{item.Title}</Text>
              <Text style={[styles.descriptionText, { color: subTextColor }]}>{getTheFirstSentence(item.Description)}</Text>
              <Text style={[styles.dateText, { color: subTextColor }]}>Due: {new Date(item.dateAssigned).toLocaleDateString()}</Text>

              {/* Unarchive Button */}
              <Pressable
                onPress={ async () => {
                    const success = await unarchiveTask(item.Id);
                    if (success) {
                        console.log('Unarchived:', item.Id);
                    }
                }}
                style={[
                    styles.unarchiveButton,
                    {
                      backgroundColor: insightBackground,
                      borderColor: borderColor,
                      borderWidth: 1,
                    },
                  ]}
            >
                <Text style={[styles.unarchiveButtonText, { color: textColor }]}>Unarchive</Text>
            </Pressable>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={[{ textAlign: 'center', marginTop: 30 }, { color: textColor }]}>No archived tasks yet.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 25,
    borderRadius: 10,
    position: 'relative',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  info: {
    padding: 5,
  },
  colorDot: {
    position: 'absolute',
    marginLeft: -5,
    width: 15,
    height: 15,
    borderRadius: 50,
  },
  CompanyNameText: {
    marginLeft: 15,
    marginTop: -7,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20, 
  },
  dateText: {
    fontSize: 12,
    marginTop: 5,
    marginLeft: 20, 
  },
  descriptionText: {
    fontSize: 12,
    marginTop: 5,
    marginLeft: 20, 
    fontStyle: 'italic', 
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 10,
    padding:25,
    paddingTop:55,
  },
  menuButton: {
    padding: 1,
  },
  unarchiveButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  unarchiveButtonText: {
    fontWeight: 'bold',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ArchivedTasks;