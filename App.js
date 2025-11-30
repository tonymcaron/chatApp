// Import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import { StyleSheet } from 'react-native';

// Import the screens
import Start from './components/Start';
import Chat from './components/Chat';

const App = () => {

  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyA8fb8kv2N7_9P-flSqo8Cc4SLbVE0mSHE",
    authDomain: "chatapp-d3684.firebaseapp.com",
    projectId: "chatapp-d3684",
    storageBucket: "chatapp-d3684.firebasestorage.app",
    messagingSenderId: "795202748354",
    appId: "1:795202748354:web:714b49c25cd50b55afe05b"
  }

  // Initialize Firebase
  const app = initializeApp(firebaseConfig)

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#757083',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Start"
          component={Start}
          options={{ title: 'Welcome' }}
        >
        </Stack.Screen>
        {/* Pass the Firestore database instance to Chat without putting it in navigation state */}
        <Stack.Screen
          name="Chat">
          {props => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subText: {
    fontSize: 18,
    color: '#BDC3C7',
    textAlign: 'center',
  },
});

export default App;
