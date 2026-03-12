
import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useAppKit, useAccount } from "@reown/appkit-react-native"

export default function HomeScreen() {
  const { open, disconnect } = useAppKit()
  const { address, isConnected, chainId } = useAccount()
console.log(isConnected,'isConnected');
const connectWallet = async () => {
  try {
    console.log("Connect wallet button pressed")
    await open()
    console.log("Modal opened")
  } catch (error) {
    console.log("Connection error:", error)
  }
}
  return (
    <View style={styles.container}>

      {isConnected ? (
        <>
          <Text style={styles.label}>Network:</Text>
          <Text style={styles.value}>{chainId}</Text>

          <Text style={styles.label}>Wallet Address:</Text>
          <Text style={styles.address}>{address}</Text>

          <TouchableOpacity style={styles.button} onPress={()=>disconnect()}>
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>
        </>
      ) : (
      <TouchableOpacity
  style={styles.button}
  onPress={() => {
    connectWallet()
  }}
>
  <Text style={styles.buttonText}>Connect Wallet</Text>
</TouchableOpacity>
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  label: {
    fontSize: 16,
    marginTop: 10
  },
  value: {
    fontSize: 18,
    fontWeight: "bold"
  },
  address: {
    fontSize: 14,
    marginBottom: 20
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  }
})