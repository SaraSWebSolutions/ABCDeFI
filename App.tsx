/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppKitProvider, AppKit, AppKitButton } from '@reown/appkit-react-native';
import { appKit } from './AppKitConfig';


function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <AppKitProvider instance={appKit}>
        <StatusBar barStyle="light-content" />
        <AppContent />
      </AppKitProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ABCD</Text>
      <View style={styles.buttonContainer}>
        <AppKitButton />
      </View>
      <AppKit />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 72,
    fontWeight: '900',
    color: '#38bdf8',
    marginBottom: 40,
    letterSpacing: -2,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
});

export default App;