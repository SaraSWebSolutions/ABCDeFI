import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import {
  useAppKit,
  useAccount,
  AppKitButton,
} from '@reown/appkit-react-native';
import { useProvider } from '@reown/appkit-react-native';
import { BrowserProvider, Contract, parseUnits } from 'ethers';
import { bsc } from 'viem/chains';
import icoABI from './abi/ico.json';

interface Token {
  symbol: string;
  name: string;
  decimals: number;
  address?: string;
  priceFeed?: string;
}

const TOKENS: Token[] = [
  { 
    symbol: 'BNB', 
    name: 'BNB', 
    decimals: 18,
    priceFeed: '0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526' // BNB/USD price feed on BSC testnet
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 18,
    address: '0xe64cD36a899E6136bE5ebd4EF459AE5BE2a43307',
    priceFeed: '0xEca2605f0BCF2BA5966372C99837b1F182d3D620' // USDT/USD price feed on BSC testnet
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 18,
    address: '0xd056eE5dC917ab61Cca8488F39Cd472b552a010B',
    priceFeed: '0x90c069C4538adAc136E051052E14c1cD799C41B7' // USDC/USD price feed on BSC testnet
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    decimals: 18,
    address: '0xF80124202C5a52318f86166DaafECa11fB8cb21F',
    priceFeed: '0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7' // ETH/USD price feed on BSC testnet
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    address: '0xC650457Cc1c928fF0cbf47A43fbFA26c7D56c652',
    priceFeed: '0x5741306c21795FdCBb9b265Ea0255F499DFe515C' // BTC/USD price feed on BSC testnet
  },
];

const ERC20_ABI=[
          "function allowance(address owner, address spender) view returns (uint256)",
          "function approve(address spender, uint256 amount) returns (bool)"
        ]

const ICO_CONTRACT_ADDRESS = '0xd621d8479Fe77F44A7E644C3FC704D1614C93152';


export default function HomeScreen() {
  const { open, disconnect } = useAppKit();
  const { address, isConnected, chainId } = useAccount();
  const { provider: walletProvider } = useProvider();

  const [isVerified, setIsVerified] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token>(TOKENS[0]);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);

  const connectWallet = async () => {
    try {
      open();
    } catch (error) {
      console.log('Connection error:', error);
      Alert.alert('Error', 'Failed to connect wallet');
    }
  };

  const verifyWallet = async () => {
    if (!walletProvider || !address) {
      Alert.alert('Error', 'Wallet not connected');
      return;
    }

    setIsVerifying(true);
    try {
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();

      const message = `Verify your wallet for ABCDeFI: ${address}:${Date.now()}`;
      const signature = await signer.signMessage(message);

      // Simulate backend verification
      // const response = await fetch('https://backend-api.com/verify-wallet', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ address, message, signature }),
      // });

      console.log('signature', signature);

      setIsVerified(true);
      Alert.alert('Demo Mode', 'Wallet verified (demo mode)');
    } finally {
      setIsVerifying(false);
    }
  };

  const buyTokens = async () => {
    // if (!isVerified) {
    //   Alert.alert('Error', 'Please verify your wallet first');
    //   return;
    // }

    if (!purchaseAmount || parseFloat(purchaseAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!selectedToken.address && selectedToken.symbol !== 'BNB') {
      Alert.alert('Error', 'Invalid token configuration');
      return;
    }

    console.log("purchaseAmount", purchaseAmount);
    setIsPurchasing(true);
    try {

      if (!walletProvider) {
        throw new Error('Wallet provider not found');
      }
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();

      const ico_contract = new Contract(ICO_CONTRACT_ADDRESS, icoABI, signer);

      console.log('Selected Token:', selectedToken);
      console.log('Raw purchaseAmount:', purchaseAmount);
      console.log('Type of purchaseAmount:', typeof purchaseAmount);
      
      // Convert amount to wei based on token decimals
      const amountInWei = parseUnits(purchaseAmount, selectedToken.decimals);
      console.log('Purchase amount:', purchaseAmount);
      console.log('Token decimals:', selectedToken.decimals);
      console.log('amountInWei ', amountInWei.toString());
      console.log('amountInWei as number:', parseFloat(amountInWei.toString()));
      console.log('amountInWei length:', amountInWei.toString().length);

      // Handle BNB (native token) purchases
      if (selectedToken.symbol === 'BNB') {
        const txn = await ico_contract.buyTokenWithNative({ 
          value: amountInWei 
        });
        const receipt = await txn.wait();
        Alert.alert(
          'Purchase Successful!',
          `Transaction confirmed: ${receipt.transactionHash}`,
        );
      } else {
        // Handle ERC20 token purchases
        if (!selectedToken.address) {
          throw new Error('Token address not found');
        }

        const tokenContract = new Contract(selectedToken.address, ERC20_ABI, signer);
        
      
      console.log('Sending approval transaction...');
        const approveTx = await tokenContract.approve(ICO_CONTRACT_ADDRESS, amountInWei);
        console.log('Approval transaction sent, hash:', approveTx.hash);
        console.log('Waiting for confirmation...');
        
       const approveReceipt = await approveTx.wait()
        console.log('Approval receipt:', approveReceipt);
      
      
        const txn = await ico_contract.buyTokenWithERC20(selectedToken.address, amountInWei);
        const receipt = await txn.wait();

        Alert.alert(
          'Purchase Successful!',
          `Transaction confirmed: ${receipt.transactionHash}`,
        );
      }

      setPurchaseAmount('');
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Error', 'Failed to process purchase');
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.walletHeader}>{isConnected && <AppKitButton />}</View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContent}>
          <Text style={styles.title}>ABCDeFI Token Sale</Text>
          <Text style={styles.subtitle}>Purchase tokens with BSC network</Text>

          {!isConnected ? (
            <View style={styles.connectSection}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={connectWallet}
              >
                <Text style={styles.primaryButtonText}>Connect Wallet</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.purchaseSection}>
              {(
                <View style={styles.verifySection}>
                  <Text style={styles.verifyText}>
                    Verify your wallet to continue
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      isVerifying && styles.disabledButton,
                    ]}
                    onPress={verifyWallet}
                    disabled={isVerifying}
                  >
                    <Text style={styles.primaryButtonText}>
                      {isVerifying ? 'Verifying...' : 'Verify Wallet'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              { (
                <>
                  <View style={styles.tokenSelector}>
                    <Text style={styles.label}>Select Token</Text>
                    <TouchableOpacity
                      style={styles.tokenDropdown}
                      onPress={() => setShowTokenModal(true)}
                    >
                      <Text style={styles.tokenText}>
                        {selectedToken.symbol}
                      </Text>
                      <Text style={styles.dropdownArrow}>▼</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.amountInput}>
                    <Text style={styles.label}>Amount</Text>
                    <TextInput
                      style={styles.input}
                      value={purchaseAmount}
                      onChangeText={setPurchaseAmount}
                      placeholder="Enter amount"
                      keyboardType="numeric"
                      placeholderTextColor="#9ca3af"
                    />
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      isPurchasing && styles.disabledButton,
                    ]}
                    onPress={buyTokens}
                    disabled={isPurchasing}
                  >
                    <Text style={styles.primaryButtonText}>
                      {isPurchasing
                        ? 'Processing...'
                        : `Buy ${selectedToken.symbol}`}
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                style={styles.disconnectButton}
                onPress={() => {
                  disconnect();
                  setIsVerified(false);
                }}
              >
                <Text style={styles.disconnectButtonText}>Disconnect</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showTokenModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTokenModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Token</Text>
            {TOKENS.map(token => (
              <TouchableOpacity
                key={token.symbol}
                style={styles.tokenOption}
                onPress={() => {
                  setSelectedToken(token);
                  setShowTokenModal(false);
                }}
              >
                <Text style={styles.tokenOptionText}>
                  {token.symbol} - {token.name}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowTokenModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  content: {
    flex: 1,
  },
  mainContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  connectSection: {
    alignItems: 'center',
  },
  purchaseSection: {
    gap: 24,
  },
  verifySection: {
    alignItems: 'center',
    gap: 12,
  },
  verifyText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
  tokenSelector: {
    gap: 8,
  },
  tokenDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
  },
  tokenText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6b7280',
  },
  amountInput: {
    gap: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  disconnectButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  disconnectButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  tokenOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tokenOptionText: {
    fontSize: 16,
    color: '#1f2937',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#6b7280',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
