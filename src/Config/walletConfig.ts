import { createWallet, walletConnect } from 'thirdweb/wallets';

// Supported wallets for the ConnectButton
export const supportedWallets = [
  createWallet("io.metamask"),        // MetaMask
  createWallet("com.trustwallet.app"), // Trust Wallet
  createWallet("com.binance.wallet"),
  createWallet("walletConnect")
];

// ConnectButton configuration
export const connectButtonConfig = {
  wallets: supportedWallets,
  connectModal: {
    title: "Connect Your Wallet",
    size: "compact" as const,
  },
  theme: "dark" as const,
  connectButton: {
    label: "Connect Wallet"
  }
};

export default connectButtonConfig;
