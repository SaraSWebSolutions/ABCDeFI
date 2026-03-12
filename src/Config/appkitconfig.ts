
import { createAppKit, bitcoin, solana } from '@reown/appkit-react-native'
import { EthersAdapter } from "@reown/appkit-ethers-react-native"
import { mainnet, polygon } from 'viem/chains'
import AsyncStorage from "@react-native-async-storage/async-storage"

import { PROJECT_ID } from '@env'
export const projectId: string = PROJECT_ID
const metadata = {
  name: "WalletConnect",
  description: "WalletConnect Demo",
  url: "https://example.com",
  icons: []
}

const networks = [mainnet]

const ethersAdapter = new EthersAdapter()

const storage = {
  getItem: async (key: string) => {
    const value = await AsyncStorage.getItem(key)
    return value ?? undefined
  },
  setItem: async (key: string, value: string) => {
    await AsyncStorage.setItem(key, value)
  },
  removeItem: async (key: string) => {
    await AsyncStorage.removeItem(key)
  }
}

export const appKit = createAppKit({
  adapters: [ethersAdapter],
networks: [mainnet, polygon],
  defaultNetwork: mainnet,
  projectId,
  metadata,
  storage
})

console.log("AppKit initialized")