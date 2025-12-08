import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, InputToolbar, Bubble } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

const MESSAGES_KEY = 'chat_messages';

const Chat = ({ route, navigation, db }) => {
  const { name, backgroundColor, userId } = route.params;
  // State to store chat messages
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  let unsubMessages;

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

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0])
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
    //Sets username as title
    navigation.setOptions({ title: name });

    // Query to sort messages in descending order
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

    unsubMessages = onSnapshot(q, (documentsSnapshot) => {
      let newMessages = [];
      documentsSnapshot.forEach(doc => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis())
        })
      })
      setMessages(newMessages);
    });

    // Clean up code
    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, []);

  return (
    <SafeAreaView style={[styles.container]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        enabled
      >
        <GiftedChat
          messages={messages}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          onSend={messages => onSend(messages)}
          user={{
            _id: userId,
            name: name
          }}
          alwaysShowSend
          minInputToolbarHeight={60}
          listViewProps={{
            style: { backgroundColor: backgroundColor }
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
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