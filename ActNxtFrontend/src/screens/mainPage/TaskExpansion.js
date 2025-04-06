import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const TaskExpansion = ({ route }) => {
    const { item } = route.params;
    const navigation = useNavigation();

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
          <Text style = {styles.contentText} >Lorem ipsum dolor sit amet, 
            consectetur adipiscing elit. Curabitur gravida maximus erat, 
            laoreet varius mi eleifend a. Suspendisse sollicitudin at mauris at tempus. 
            Donec nunc urna, laoreet id purus vel, malesuada facilisis ipsum. 
            Aliquam ac nisi dignissim, interdum enim non, commodo dui. 
            Duis lacinia dolor non est feugiat, sed aliquet massa finibus.
          </Text>
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
    contentText: {
      fontSize: 16,
      lineHeight: 24,
      color: 'black',
    }
});

export default TaskExpansion;



