import React from 'react';
import { View, StyleSheet } from 'react-native';
import SettingsList from './SettingsList';

const Settings = () => {
  // Define any number of settings with names, functions and types (right now just switch and dropdown)
  const settings = [
    {
      name: 'Enable Notifications',
      function: (value) => console.log('Notifications:', value),
      type: 'switch',
    },
    {
      name: 'Language',
      function: (value) => console.log('Selected Language:', value),
      type: 'dropdown',
      options: ['English', 'Danish', 'Lorem Ipsum'],
    },
    {
      name: 'Help and Support',
      function: () => console.log('Button Pressed'),
      type: 'button',
      options: 'Contact Support',
    },
    {
      name: 'Username',
      function: (value) => console.log('Username:', value),
      type: 'textinput',
    },
    {
      name: 'Agree to Terms',
      function: (value) => console.log('Checkbox:', value),
      type: 'checkbox',
    },
    {
      name: 'Gender',
      function: (value) => console.log('Selected Gender:', value),
      type: 'radio',
      options: [
        { id: '1', label: 'Male', value: 'male' },
        { id: '2', label: 'Female', value: 'female' },
      ],
    },
    {
      name: 'Volume',
      function: (value) => console.log('Volume:', value),
      type: 'slider',
    },
    {
      name: 'Enable Notifications',
      function: (value) => console.log('Notifications:', value),
      type: 'switch',
    },
    {
      name: 'Language',
      function: (value) => console.log('Selected Language:', value),
      type: 'dropdown',
      options: ['English', 'Danish', 'Lorem Ipsum'],
    },
    {
      name: 'Help and Support',
      function: () => console.log('Button Pressed'),
      type: 'button',
      options: 'Contact Support',
    },
    {
      name: 'Username',
      function: (value) => console.log('Username:', value),
      type: 'textinput',
    },
    {
      name: 'Agree to Terms',
      function: (value) => console.log('Checkbox:', value),
      type: 'checkbox',
    },
    {
      name: 'Gender',
      function: (value) => console.log('Selected Gender:', value),
      type: 'radio',
      options: [
        { id: '1', label: 'Male', value: 'male' },
        { id: '2', label: 'Female', value: 'female' },
      ],
    },
    {
      name: 'Volume',
      function: (value) => console.log('Volume:', value),
      type: 'slider',
    },
  ];

  return (
    <View style={styles.container}>
      <SettingsList settings={settings} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});

export default Settings;