import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {
  useAppKit,
  useAccount,
  AppKitButton,
} from '@reown/appkit-react-native';
import {  useProvider } from '@reown/appkit-react-native';
import { BrowserProvider } from 'ethers';

export default function HomeScreen() {
  const { open, disconnect } = useAppKit();
  const { address, isConnected, chainId } = useAccount();
const { provider: walletProvider } = useProvider();
  console.log(isConnected, 'isConnected');
  
  const connectWallet = async () => {
    try {
      console.log('Connect wallet button pressed');
      await open();
      console.log('Modal opened');
    } catch (error) {
      console.log('Connection error:', error);
    }
  };

  const testSigning = async () => {
    try {
      if (!walletProvider) {
        Alert.alert('Error', 'Wallet provider not available');
        return;
      }

      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      
      // Test message to sign
      const message = "Hello from ABCDeFI! This is a test message.";
      
      // Sign the message
      const signature = await signer.signMessage(message);
      
      console.log('Message:', message);
      console.log('Signature:', signature);
      
      Alert.alert(
        'Signing Success',
        `Message: "${message}"\n\nSignature: ${signature.substring(0, 20)}...`
      );
    } catch (error) {
      console.error('Signing error:', error);
      Alert.alert('Signing Error', error ? String(error) : 'Unknown error');
    }
  };
  return (
  
    <View style={styles.container}>
      <View style={{ marginBottom: 50 }}><AppKitButton /></View>
      
   
      {isConnected ? (
        <>
          <Text style={styles.label}>Network:</Text>
          <Text style={styles.value}>{chainId}</Text>

          <Text style={styles.label}>Wallet Address:</Text>
          <Text style={styles.address}>{address}</Text>

          <TouchableOpacity style={styles.button} onPress={testSigning}>
            <Text style={styles.buttonText}>Test Signing</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.disconnectButton]} onPress={() => disconnect()}>
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            connectWallet();
          }}
        >
          <Text style={styles.buttonText}>Connect Wallet</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 14,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  disconnectButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
