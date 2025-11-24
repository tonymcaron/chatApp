import { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { GiftedChat, InputToolbar, Bubble } from "react-native-gifted-chat";

const MESSAGES_KEY = 'chat_messages';

const Chat = () => {
  // State to store chat messages
  const [messages, setMessages] = useState([]);

  useEffect(() => {
      setMessages([
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
        {
          _id: 2,
          text: 'This is a system message',
          createdAt: new Date(),
          system: true,
        },
      ]);
    }, []);

  const onSend = (newMessages) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
  }

  const renderBubble = (props) => {
   return <Bubble
     {...props}
     wrapperStyle={{
       right: {
         backgroundColor: "#000"
       },
       left: {
         backgroundColor: "#FFF"
       }
     }}
   />
 }

  return (
    <View style={[styles.container]}>
        <GiftedChat
          messages={messages}
          renderBubble={renderBubble}
          onSend={messages => onSend(messages)}
          user={{
            _id: 1
          }}
          textInputStyle={styles.textInput}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
    </View>
  );
};

const styles = StyleSheet.create({
  // Main container that fills the entire screen
  container: {
    flex: 1,
  },
  // Custom styling for the text input field
  textInput: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    marginVertical: 5,
  },
});

export default Chat;
