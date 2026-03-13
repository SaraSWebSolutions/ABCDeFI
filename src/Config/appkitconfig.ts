import { createAppKit } from '@reown/appkit-react-native';
import { EthersAdapter } from '@reown/appkit-ethers-react-native';
import { mainnet, polygon } from 'viem/chains';
import { storage } from '../Utils/StorageUtil.ts';

import { PROJECT_ID } from '@env';
export const projectId: string = PROJECT_ID;
const metadata = {
  name: 'ABCDEFI',
  description: 'abcDefi TEST',
  url: 'https://abcdefi.com',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
  redirect: {
    native: 'abcdefi://',
    universal: 'https://abcdefi.com',
  },
};

const ethersAdapter = new EthersAdapter();

export const appKit = createAppKit({
  adapters: [ethersAdapter],
  networks: [mainnet, polygon],
  defaultNetwork: mainnet,
  projectId,
  metadata,
  storage,
  features: {
    socials: false,
    swaps: true,
    onramp: true,
  },
});

console.log('AppKit initialized');
