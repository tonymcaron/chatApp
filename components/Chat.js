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

const Chat = ({ route, navigation }) => {
  const { name, color } = route.params;
  // State to store chat messages
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          borderTopWidth: 1,
          borderTopColor: "#E8E8E8",
          padding: 6,
        }}
      />
    )
  }

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

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  return (
    <View style={[styles.container]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={messages => onSend(messages)}
        user={{ _id: 1 }}
        alwaysShowSend
        minInputToolbarHeight={60}
        listViewProps={{
          style: { backgroundColor: color }
        }}
        text={text}
        onInputTextChanged={setText}
      />

      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  // Main container that fills the entire screen
  container: {
    flex: 1,
  },
  // Custom styling for the text input field
  // textInput: {
  // borderRadius: 20,
  // borderWidth: 1,
  // borderColor: '#E5E5EA',
  // paddingHorizontal: 15,
  // paddingVertical: 10,
  // fontSize: 16,
  // backgroundColor: '#FFFFFF',
  // marginHorizontal: 10,
  // marginVertical: 5,
  // },
});

export default Chat;
