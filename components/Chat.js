import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { GiftedChat, InputToolbar, Bubble } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MESSAGES_KEY = 'chat_messages';

const Chat = ({ route, navigation, db, storage, isConnected }) => {
  const { name, backgroundColor, userId } = route.params;
  // State to store chat messages
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  let unsubMessages;

  const renderInputToolbar = (props) => {
    if (isConnected) return (
      <InputToolbar
        {...props}
        containerStyle={{
          borderTopWidth: 1,
          borderTopColor: "#E8E8E8",
          padding: 6,
        }}
      />
    );
    else return null;
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

    if (isConnected) {
      // Query to sort messages in descending order
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

      unsubMessages = onSnapshot(q, async (documentsSnapshot) => {
        let newMessages = [];
        documentsSnapshot.forEach(doc => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis())
          })
        })
        cacheMessages(newMessages);
        setMessages(newMessages);
      })
    } else loadCachedMessages();

    // Clean up code
    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, [isConnected]);

  const loadCachedMessages = async () => {
    try {
      const cachedMessages = await AsyncStorage.getItem('messages');
      if (cachedMessages) {
        setMessages(JSON.parse(cachedMessages));
      }
    } catch (error) {
      console.error('Failed to load messages from AsyncStorage:', error);
    }
  };

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.error('Failed to cache messages', error);
    }
  };

  return (
    <View style={styles.container}>

      {/* Android-only keyboard handling */}
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="height"
          keyboardVerticalOffset={0}
        >
          <GiftedChat
            key={isConnected ? 'online' : 'offline'}
            messages={messages}
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolbar}
            onSend={messages => onSend(messages)}
            user={{ _id: userId, name }}
            alwaysShowSend={isConnected}
            minInputToolbarHeight={isConnected ? 60 : 0}
            listViewProps={{
              style: { backgroundColor: backgroundColor }
            }}
          />
        </KeyboardAvoidingView>
      ) : (
        // iPhone (no KeyboardAvoidingView!)
        <GiftedChat
          key={isConnected ? 'online' : 'offline'}
          messages={messages}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          onSend={messages => onSend(messages)}
          user={{ _id: userId, name }}
          alwaysShowSend={isConnected}
          minInputToolbarHeight={isConnected ? 60 : 0}
          listViewProps={{
            style: { backgroundColor: backgroundColor }
          }}
        />
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  // Main container that fills the entire screen
  container: {
    flex: 1,
  },
});

export default Chat;