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
      return (
        <SwitchSetting
          name={name}
          onToggle={onSettingChange}
          labelStyle={setting.labelStyle}
          trackColor={setting.trackColor}
          thumbColor={setting.thumbColor}
        />
      );
    case 'dropdown':
      return (
        <DropdownSetting
          name={name}
          onSelect={onSettingChange}
          options={options}
          labelStyle={setting.labelStyle}
          containerStyle={setting.containerStyle}
          pickerStyle={setting.pickerStyle}
          placeholderTextColor={setting.placeholderTextColor}
          valueTextStyle={setting.valueTextStyle}
        />
      );
    case 'button':
      return (
        <ButtonSetting
          name={name}
          onPress={onSettingChange}
          buttonText={options}
          labelStyle={setting.labelStyle}
          buttonStyle={setting.buttonStyle}
          buttonTextStyle={setting.buttonTextStyle}
        />
      );
    case 'textinput':
      return (
        <TextInputSetting
          name={name}
          onChangeText={onSettingChange}
          labelStyle={setting.labelStyle}
          inputStyle={setting.inputStyle}
          placeholder={setting.placeholder}
          placeholderTextColor={setting.placeholderTextColor}
        />
      );
    case 'checkbox':
      return (
        <CheckboxSetting
          name={name}
          onToggle={onSettingChange}
          labelStyle={setting.labelStyle}
          boxStyle={setting.boxStyle}
          checkmarkStyle={setting.checkmarkStyle}
        />
      );
    case 'radio':
      return (
        <RadioSetting
          name={name}
          onSelect={onSettingChange}
          options={options}
          labelStyle={setting.labelStyle}
        />
      );
    case 'slider':
      return (
        <SliderSetting
          name={name}
          onValueChange={onSettingChange}
          labelStyle={setting.labelStyle}
          value={setting.value}
          sliderStyle={setting.sliderStyle}
          minimumTrackTintColor={setting.minimumTrackTintColor}
          maximumTrackTintColor={setting.maximumTrackTintColor}
          thumbTintColor={setting.thumbTintColor}
        />
      );
    default:
      return null; // Handle unknown types gracefully
  }
};

// Switch Setting
const SwitchSetting = ({ name, onToggle, labelStyle }) => {
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
      <Text style={[styles.text, labelStyle]}>{name}</Text>
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
const DropdownSetting = ({
    name,
    onSelect,
    options, 
    labelStyle, 
    containerStyle,
    pickerStyle,
    placeholderTextColor,
    valueTextStyle,
  }) => {
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
    <View style={[styles.settingItem, containerStyle]}>
      <Text style={[styles.text, labelStyle]}>{name}</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={handleValueChange}
          style={[styles.picker, pickerStyle]}
          dropdownIconColor={valueTextStyle?.color}
          placeholderTextColor={placeholderTextColor}
        >
          {options.map((option, index) => (
            <Picker.Item
              key={index}
              label={option}
              value={option}
              color={valueTextStyle?.color}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

// Button Setting
const ButtonSetting = ({
    name,
    onPress,
    buttonText,
    labelStyle,
    buttonStyle,
    buttonTextStyle,
  }) => {
  return (
    <View style={styles.settingItem}>
      <Text style={[styles.text, labelStyle]}>{name}</Text>
      <RNButton
        title={buttonText} 
        onPress={onPress}
        color={buttonStyle?.backgroundColor}
      />
    </View>
  );
};

// Text Input Setting
const TextInputSetting = ({
    name,
    onChangeText,
    labelStyle,
    inputStyle,
    placeholder,
    placeholderTextColor,
  }) => {
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
      <Text style={[styles.text, labelStyle]}>{name}</Text>
      <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
      />
    </View>
  );
};

// Custom Checkbox Setting
const CheckboxSetting = ({
    name,
    onToggle,
    labelStyle,
    boxStyle,checkmarkStyle,
  }) => {
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
      <Text style={[styles.text, labelStyle]}>{name}</Text>
      <TouchableOpacity
        style={[styles.checkbox, boxStyle, isChecked && styles.checkedBox]}
        onPress={handleToggle}
      >
        {isChecked && <Text style={[styles.checkmark, checkmarkStyle]}>✓</Text>}
      </TouchableOpacity>
    </View>
  );
};

// Radio Setting
const RadioSetting = ({ name, onSelect, options, labelStyle }) => {
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
      <Text style={[styles.text, labelStyle]}>{name}</Text>
      <RadioGroup
        radioButtons={options}
        onPress={handleSelect}
        selectedId={selectedId}
      />
    </View>
  );
};

// Slider Setting
const SliderSetting = ({
    name,
    onValueChange,
    labelStyle,
    value,
    sliderStyle,
    minimumTrackTintColor,
    maximumTrackTintColor,
    thumbTintColor,
  }) => {
  const [sliderValue, setSliderValue] = useState(value ?? 50);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(`setting:${name}`);
        if (stored !== null && !isNaN(Number(stored))) {
          setSliderValue(Number(stored));
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
      <Text style={[styles.text, labelStyle]}>{name}</Text>
      <Slider
        style={[styles.slider, sliderStyle]}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={sliderValue}
        onValueChange={setSliderValue}
        onSlidingComplete={handleSlidingComplete}
        minimumTrackTintColor={minimumTrackTintColor}
        maximumTrackTintColor={maximumTrackTintColor}
        thumbTintColor={thumbTintColor}
      />
      <Text style={[styles.text, labelStyle]}>{sliderValue.toFixed(0)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20, // Add padding to the content
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  text: {
    fontSize: 18,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  pickerWrapper: {
    flex: 1,
    marginLeft: 12,
  },
  picker: {
    width: '100%',
    height: 50,
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