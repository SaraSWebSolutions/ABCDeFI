import { Linking, Alert, Platform } from 'react-native';

export const WALLET_METADATA: Record<
  string,
  {
    name: string;
    scheme: string;
    packageId: string;
    playStoreUrl: string;
  }
> = {
  'io.metamask': {
    name: 'MetaMask',
    scheme: 'metamask://',
    packageId: 'io.metamask',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=io.metamask',
  },
  'com.trustwallet.app': {
    name: 'Trust Wallet',
    scheme: 'trust://wc',
    packageId: 'com.wallet.crypto.trustapp',
    playStoreUrl:
      'https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp',
  },
  'me.rainbow': {
    name: 'Rainbow',
    scheme: 'rainbow://',
    packageId: 'me.rainbow',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=me.rainbow',
  },
  'com.binance.wallet': {
    name: 'Binance Wallet',
    scheme: 'bnc://app.binance.com',
    packageId: 'com.binance.dev',
    playStoreUrl:
      'https://play.google.com/store/apps/details?id=com.binance.dev',
  },
  'app.phantom': {
    name: 'Phantom',
    scheme: 'phantom://',
    packageId: 'app.phantom',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=app.phantom',
  },
};

export const checkWalletInstalled = async (
  walletId: string,
): Promise<boolean> => {
  const metadata = WALLET_METADATA[walletId];
  if (!metadata) {
    console.log(
      `[WalletCheck] No metadata for ${walletId}. Defaulting to true.`,
    );
    return true;
  }

  console.log(
    `[WalletCheck] Checking installation for: ${walletId} (${metadata.name})`,
  );

  try {
    const canOpen = await Linking.canOpenURL(metadata.scheme);
    console.log(
      `[WalletCheck] ${metadata.name} (${metadata.scheme}) -> ${canOpen}`,
    );
    return canOpen;
  } catch (error) {
    console.error(`Check installation error for ${walletId}:`, error);
    return false;
  }
};

export const showInstallationAlert = (walletId: string) => {
  const metadata = WALLET_METADATA[walletId];
  if (!metadata) {
    Alert.alert(
      'Wallet Not Found',
      'The selected wallet app is not installed on your device.',
    );
    return;
  }

  Alert.alert(
    `${metadata.name} Not Found`,
    `${metadata.name} is not installed. Install it from Play Store?`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Install',
        onPress: () => Linking.openURL(metadata.playStoreUrl),
      },
    ],
  );
};
