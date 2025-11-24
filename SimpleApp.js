import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SimpleApp = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello! Chat App is Working!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C3E50',
  },
  text: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SimpleApp;