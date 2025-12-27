import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { GiftedChat, InputToolbar, Bubble } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";

const MESSAGES_KEY = "chat_messages";

const Chat = ({ route, navigation, db, storage, isConnected }) => {
  const { name, backgroundColor, userId } = route.params;
  // State to store chat messages
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  let unsubMessages;

  const renderInputToolbar = (props) => {
    // Show input toolbar if online
    if (isConnected)
      return (
        <InputToolbar
          {...props}
          containerStyle={{
            borderTopWidth: 1,
            borderTopColor: "#E8E8E8",
            padding: 6,
          }}
        />
      );
    // Hides input toolbar if offline
    else return null;
  };

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
          left: {
            backgroundColor: "#FFF",
          },
        }}
      />
    );
  };

  useEffect(() => {
    //Sets username as title
    navigation.setOptions({ title: name });

    if (isConnected) {
      // Query to sort messages in descending order
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

      unsubMessages = onSnapshot(q, async (documentsSnapshot) => {
        let newMessages = [];
        documentsSnapshot.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages();

    // Clean up code
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [isConnected]);

  // Loads cached messages when offline
  const loadCachedMessages = async () => {
    try {
      const cachedMessages = await AsyncStorage.getItem("messages");
      if (cachedMessages) {
        setMessages(JSON.parse(cachedMessages));
      }
    } catch (error) {
      console.error("Failed to load messages from AsyncStorage:", error);
    }
  };

  // Caches messages to AsyncStorage
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.error("Failed to cache messages", error);
    }
  };

  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} onSend={onSend} {...props} />;
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
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
            key={isConnected ? "online" : "offline"}
            messages={messages}
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolbar}
            onSend={(messages) => onSend(messages)}
            renderActions={renderCustomActions}
            renderCustomView={renderCustomView}
            user={{ _id: userId, name }}
            alwaysShowSend={isConnected}
            minInputToolbarHeight={isConnected ? 60 : 0}
            listViewProps={{
              style: { backgroundColor: backgroundColor },
            }}
          />
        </KeyboardAvoidingView>
      ) : (
        // iPhone (no KeyboardAvoidingView!)
        <GiftedChat
          key={isConnected ? "online" : "offline"}
          messages={messages}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          onSend={(messages) => onSend(messages)}
          renderActions={renderCustomActions}
          renderCustomView={renderCustomView}
          user={{ _id: userId, name }}
          alwaysShowSend={isConnected}
          minInputToolbarHeight={isConnected ? 60 : 0}
          listViewProps={{
            style: { backgroundColor: backgroundColor },
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
