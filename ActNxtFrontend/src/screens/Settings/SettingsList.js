import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Switch,
  TextInput,
  Button as RNButton,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import RadioGroup from 'react-native-radio-buttons-group';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsList = ({ settings }) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer} // Add padding to the content
    >
      {settings.map((setting, index) => (
        <View key={index}>
          <SettingItem setting={setting} />
          {index < settings.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
    </ScrollView>
  );
};

const SettingItem = ({ setting }) => {
  const { name, function: onSettingChange, type, options } = setting;

  switch (type) {
    case 'switch':
      return <SwitchSetting name={name} onToggle={onSettingChange} />;
    case 'dropdown':
      return (
        <DropdownSetting
          name={name}
          onSelect={onSettingChange}
          options={options}
        />
      );
    case 'button':
      return <ButtonSetting name={name} onPress={onSettingChange} buttonText={options} />;
    case 'textinput':
      return <TextInputSetting name={name} onChangeText={onSettingChange} />;
    case 'checkbox':
      return <CheckboxSetting name={name} onToggle={onSettingChange} />;
    case 'radio':
      return (
        <RadioSetting
          name={name}
          onSelect={onSettingChange}
          options={options}
        />
      );
    case 'slider':
      return <SliderSetting name={name} onValueChange={onSettingChange} />;
    default:
      return null; // Handle unknown types gracefully
  }
};

// Switch Setting
const SwitchSetting = ({ name, onToggle }) => {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const value = await AsyncStorage.getItem(`setting:${name}`);
        if (value !== null) setIsEnabled(JSON.parse(value));
      } catch (e) {
        console.error(`Failed to load setting: ${name}`, e);
      }
    };
    load();
  }, []);

  const handleToggle = async () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    onToggle(newValue);
    try {
      await AsyncStorage.setItem(`setting:${name}`, JSON.stringify(newValue));
    } catch (e) {
      console.error(`Failed to save setting: ${name}`, e);
    }
  };

  return (
    <View style={styles.settingItem}>
      <Text style={styles.text}>{name}</Text>
      <Switch
        value={isEnabled}
        onValueChange={handleToggle}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
      />
    </View>
  );
};

// Dropdown Setting
const DropdownSetting = ({ name, onSelect, options }) => {
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const value = await AsyncStorage.getItem(`setting:${name}`);
        if (value && options.includes(value)) {
          setSelectedValue(value);
        } else {
          setSelectedValue(options[0]);
        }
      } catch (e) {
        console.error(`Failed to load setting: ${name}`, e);
      }
    };
    load();
  }, []);

  const handleValueChange = async (value) => {
    setSelectedValue(value);
    onSelect(value);
    try {
      await AsyncStorage.setItem(`setting:${name}`, value);
    } catch (e) {
      console.error(`Failed to save dropdownd: ${name}`, e);
    }
  };

  return (
    <View style={styles.settingItem}>
      <Text style={styles.text}>{name}</Text>
      <Picker
        selectedValue={selectedValue}
        onValueChange={handleValueChange}
        style={styles.picker}
        // dropdownIconColor="#000"
      >
        {options.map((option, index) => (
          <Picker.Item key={index} label={option} value={option} />
        ))}
      </Picker>
    </View>
  );
};

// Button Setting
const ButtonSetting = ({ name, onPress, buttonText }) => {
  return (
    <View style={styles.settingItem}>
      <Text style={styles.text}>{name}</Text>
      <RNButton title={buttonText} onPress={onPress} />
    </View>
  );
};

// Text Input Setting
const TextInputSetting = ({ name, onChangeText }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const value = await AsyncStorage.getItem(`setting:${name}`);
        if (value !== null) setText(value);
      } catch (e) {
        console.error(`Failed to load text input: ${name}`, e);
      }
    };
    load();
  }, []);


  const handleTextChange = async (value) => {
    setText(value);
    onChangeText(value);
    try {
      await AsyncStorage.setItem(`setting:${name}`, value);
    } catch (e) {
      console.error(`Failed to sace checkbox`, e);
    }
  };

  return (
    <View style={styles.settingItem}>
      <Text style={styles.text}>{name}</Text>
      <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={handleTextChange}
        placeholder="Enter text"
      />
    </View>
  );
};

// Custom Checkbox Setting
const CheckboxSetting = ({ name, onToggle }) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const value = await AsyncStorage.getItem(`setting:${name}`);
        if (value !== null) setIsChecked(JSON.parse(value));
      } catch (e) {
        console.error(`Failed to load checkbox: ${name}`, e);
      }
    };
    load();
  }, []);

  const handleToggle = async () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onToggle(newValue);
    try {
      await AsyncStorage.setItem(`setting:${name}`, JSON.stringify(newValue));
    } catch (e) {
      console.error(`Failed to sace checkbox: ${name}`, e);
    }
  };

  return (
    <View style={styles.settingItem}>
      <Text style={styles.text}>{name}</Text>
      <TouchableOpacity
        style={[styles.checkbox, isChecked && styles.checkedBox]}
        onPress={handleToggle}
      >
        {isChecked && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    </View>
  );
};

// Radio Setting
const RadioSetting = ({ name, onSelect, options }) => {
  const [selectedId, setSelectedId] = useState(options[0].id);

  useEffect(() => {
    const load = async () => {
      try {
        const value = await AsyncStorage.getItem(`setting:${name}`);
        if (value !== null) setSelectedId(value);
      } catch (e) {
        console.error(`Failed to load radio setting: ${name}`, e);
      }
    };
    load();
  }, []);

  const handleSelect = async (id) => {
    setSelectedId(id);
    onSelect(id);
    try {
      await AsyncStorage.setItem(`setting:${name}`, id);
    } catch (e) {
      console.error(`Failed to save slider: ${name}`, e);
    }
  };

  return (
    <View style={styles.settingItem}>
      <Text style={styles.text}>{name}</Text>
      <RadioGroup
        radioButtons={options}
        onPress={handleSelect}
        selectedId={selectedId}
      />
    </View>
  );
};

// Slider Setting
const SliderSetting = ({ name, onValueChange, value }) => {
  const [sliderValue, setSliderValue] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const value = await AsyncStorage.getItem(`setting:${name}`);
        if (value !== null && !isNaN(Number(value))) {
          setSliderValue(Number(value));
        } else {
          setSliderValue(50);
        }
      } catch (e) {
        console.error(`Failed to load slider: ${name}`, e);
      }
    };
    load();
  }, []);
  

  const handleSlidingComplete = async (newValue) => {
    try {
      await AsyncStorage.setItem(`setting:${name}`, String(newValue));
      onValueChange(newValue);
    } catch (e) {
      console.error(`Failed to save slider: ${name}`, e);
    }
  };
  
  if (sliderValue === null) return null;

  return (
    <View style={styles.settingItem}>
      <Text style={styles.text}>{name}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={sliderValue}
        onValueChange={setSliderValue}
        onSlidingComplete={handleSlidingComplete}
        minimumTrackTintColor="#81b0ff"
        maximumTrackTintColor="#767577"
        thumbTintColor="#f5dd4b"
      />
      <Text>{sliderValue.toFixed(0)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    padding: 20, // Add padding to the content
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  text: {
    fontSize: 18,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  picker: {
    width: 150,
    height: 60,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    width: 150,
  },
  slider: {
    width: 150,
    height: 40,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#81b0ff',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#81b0ff',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
  },
});

export default SettingsList;