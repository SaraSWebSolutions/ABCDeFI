import { createWallet, walletConnect } from 'thirdweb/wallets';
import { PROJECT_ID } from '@env';
// Supported wallets for the ConnectButton

const appMetadata = {
  name: 'ABCDefi',
  description: 'ABCDefi',
  url: 'https://abcdefi.com',
  logoUrl: 'https://abcdefi.com/logo.png',
};

export const supportedWallets = [
  createWallet('io.metamask'),
  createWallet('com.trustwallet.app'),
  createWallet('com.binance.wallet'),
];

// ConnectButton configuration
export const connectButtonConfig = {
  wallets: supportedWallets,
  connectModal: {
    title: 'Connect Your Wallet',
    size: 'compact' as const,
  },
  theme: 'dark' as const,
  connectButton: {
    label: 'Connect Wallet',
  },
  appMetadata: {
    name: 'ABCDefi',
    description: 'ABCDefi',
    url: 'https://abcdefi.com',
    logoUrl: 'https://abcdefi.com/logo.png',
  },
  walletConnect: {
    projectId: PROJECT_ID,
    appMetadata: appMetadata,
  },
};

export default connectButtonConfig;
