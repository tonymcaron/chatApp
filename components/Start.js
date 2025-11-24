import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';


const Start = ({ navigation, isConnected }) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#090C08');

  const backgroundColors = [
    '#090C08', // Black - Classic and professional
    '#474056', // Dark Purple - Modern and sleek
    '#8A95A5', // Blue Gray - Calm and neutral
    '#B9C6AE'  // Light Green - Fresh and natural
  ];

  return (
    <View style={styles.backgroundContainer}>
      {/* KeyboardAvoidingView prevents keyboard from covering the input fields */}
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          {/* Title */}
          <Text style={styles.title}>Chat App</Text>
          
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
            {backgroundColors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor
                ]}
                onPress={() => setSelectedColor(color)}
                accessible={true}
                accessibilityLabel={`Background color option ${index + 1}`}
                accessibilityRole="button"
              />
            ))}
          </View>
          
          {/* Start Chat Button */}
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.navigate('Chat')}
            accessible={true}
            accessibilityLabel="Start chatting"
            accessibilityRole="button"
          >
            <Text style={styles.startButtonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#2C3E50', // Beautiful dark blue-gray background
  },
  // KeyboardAvoidingView to handle keyboard behavior on start screen
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  selectedColor: {
    borderColor: '#757083',
    borderWidth: 3,
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
