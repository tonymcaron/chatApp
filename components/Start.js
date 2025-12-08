import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ImageBackground
} from 'react-native';

import { signInAnonymouslyRN } from '../firebase';

const Start = ({ navigation, isConnected }) => {
  // State to store the user's name input
  const [name, setName] = useState('');

  // State to store the selected background color (defaults to black)
  const [selectedColor, setSelectedColor] = useState('#090C08');

  // Available background colors for the chat screen
  // These colors provide good contrast and readability for chat messages
  const backgroundColors = [
    '#090C08', // Black - Classic and professional
    '#474056', // Dark Purple - Modern and sleek
    '#8A95A5', // Blue Gray - Calm and neutral
    '#B9C6AE'  // Light Green - Fresh and natural
  ];

  /**
   * Anonymous sign-in then navigate to Chat.
   * If successful, passes uid, name, and selected background color.
   */
  const signInUser = async () => {
    if (name.trim() === '') {
      Alert.alert('Please enter your name', 'You need to enter a name to start chatting.');
      return;
    }

    try {
      // If offline, skip auth and navigate with a temporary offline user id
      if (!isConnected) {
        const offlineId = `offline_${Date.now()}`;
        navigation.navigate('Chat', {
          userId: offlineId,
          name: name.trim(),
          backgroundColor: selectedColor,
        });
        return;
      }

      const result = await signInAnonymouslyRN();
      const user = result?.user;

      if (user?.uid) {
        navigation.navigate('Chat', {
          userId: user.uid,
          name: name.trim(),
          backgroundColor: selectedColor,
        });
      } else {
        Alert.alert('Sign-in failed', 'No user returned from authentication.');
      }
    } catch (e) {
      const message = e?.message ?? 'Unknown error';
      Alert.alert('Unable to sign in', message);
    }
  };

  return (
    <ImageBackground
      style={styles.bgImage}
      source={require("../assets/background-image.png")}
      resizeMode="cover"
    >
      {/* KeyboardAvoidingView prevents keyboard from covering the input fields */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >

        <View style={styles.container}>
          {/* Title */}
          <Text style={styles.title}>Let's Chat!</Text>

          {/* Input Section */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
              placeholderTextColor="#757083"
            />

            {/* Color Selection */}
            <Text style={styles.colorText}>Choose Background Color:</Text>
            <View style={styles.colorContainer}>
              {backgroundColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && {
                      borderWidth: 3,
                      borderColor: '#757083',
                    }
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>

            {/* Start Chat Button */}
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Start chatting"
              accessibilityRole="button"
              accessibilityHint="Press this button to start the chat"
              style={styles.startButton}
              onPress={() => {
                if (name == '') {
                  Alert.alert('Please enter a username');
                } else {
                  signInUser();
                }
              }}
            >
              <Text style={styles.startButtonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground >
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
  },
  // KeyboardAvoidingView to handle keyboard behavior on start screen
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 50,
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '88%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textInput: {
    width: '100%',
    height: 50,
    borderColor: '#757083',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    marginBottom: 20,
  },
  colorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25, // Half of width/height to make it circular
    borderWidth: 3,
    borderColor: 'transparent',
  },
  startButton: {
    backgroundColor: '#757083',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Start;