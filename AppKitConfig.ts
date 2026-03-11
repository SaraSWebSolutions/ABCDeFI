import '@walletconnect/react-native-compat';
import { createAppKit,Storage } from '@reown/appkit-react-native';
import { EthersAdapter } from '@reown/appkit-ethers-react-native';
import { mainnet, polygon } from 'viem/chains';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PROJECT_ID } from '@env';

// update project id in .env file
const projectId = PROJECT_ID;

// 2. Define Storage Implementation
const storage: Storage = {
  setItem: async (key: string, value: any) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  getItem: async (key: string) => {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : undefined;
  },
  removeItem: async (key: string) => {
    await AsyncStorage.removeItem(key);
  },
  getKeys: async () => {
    return (await AsyncStorage.getAllKeys()) as string[];
  },
  getEntries: async () => {
    const keys = await AsyncStorage.getAllKeys();
    const entries = await AsyncStorage.multiGet(keys);
    return entries.map(([key, value]) => [
      key,
      value ? JSON.parse(value) : undefined,
    ]) as [string, any][];
  },
};

// 3. Create Config
const metadata = {
  name: 'abcd',
  description: 'AppKit RN CLI Example',
  url: 'https://reown.com/appkit',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
  redirect: {
    native: 'abcd://',
    universal: 'abcd.com',
  },
};

const ethersAdapter = new EthersAdapter();

const networks = [mainnet, polygon];

export const appKit = createAppKit({
  adapters: [ethersAdapter],
  projectId,
  networks,
  metadata,
  storage,
  themeMode: 'dark',
   features: { socials: false },
  defaultNetwork: mainnet,
});
