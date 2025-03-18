import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const AI = () => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Load the audio file
    useEffect(() => {
        const loadAudio = async () => {
            try {
                // Request audio permissions
                const { status } = await Audio.requestPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission required', 'Audio playback requires permission to access audio.');
                    return;
                }

                // Load the sound
                console.log('Loading audio...');
                const { sound } = await Audio.Sound.createAsync(
                    { uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }, // Remote audio file
                    { shouldPlay: false } // Don't play immediately
                );
                setSound(sound);
                console.log('Audio loaded successfully');
            } catch (error) {
                console.error('Error loading audio:', error);
                Alert.alert('Error', 'Failed to load audio. Please check your internet connection or try again later.');
            }
        };

        loadAudio();

        // Cleanup on unmount
        return () => {
            if (sound) {
                console.log('Unloading audio...');
                sound.unloadAsync();
            }
        };
    }, []);

    // Play or pause the audio
    const togglePlayback = async () => {
        if (sound) {
            try {
                if (isPlaying) {
                    await sound.pauseAsync();
                    setIsPlaying(false);
                    console.log('Audio paused');
                } else {
                    await sound.playAsync();
                    setIsPlaying(true);
                    console.log('Audio playing');
                }
            } catch (error) {
                console.error('Error toggling playback:', error);
                Alert.alert('Error', 'Failed to play/pause audio. Please try again.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
                <Ionicons name={isPlaying ? 'pause' : 'play'} size={50} color="black" />
                <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButton: {
        alignItems: 'center',
    },
    buttonText: {
        marginTop: 10,
        fontSize: 16,
        color: 'black',
    },
});

export default AI;
