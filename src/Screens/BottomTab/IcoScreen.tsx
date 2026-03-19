import "@thirdweb-dev/react-native-adapter";
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsive } from '../../Utils/Responsive';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fonts from '../../Utils/Fonts';
import { useActiveAccount, useDisconnect } from 'thirdweb/react';
import { thirdwebClient } from '../../Config/thirdwebConfig';
import { ethers } from 'ethers';
import { ethers6Adapter } from 'thirdweb/adapters/ethers6';
import { bscTestnet } from 'thirdweb/chains';
import icoABI from '../../abi/ico.json';
import erc20ABI from '../../abi/ERC20.json';


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
    priceFeed: '0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526',
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 18,
    address: '0xe64cD36a899E6136bE5ebd4EF459AE5BE2a43307',
    priceFeed: '0xEca2605f0BCF2BA5966372C99837b1F182d3D620',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 18,
    address: '0xd056eE5dC917ab61Cca8488F39Cd472b552a010B',
    priceFeed: '0x90c069C4538adAc136E051052E14c1cD799C41B7',
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    decimals: 18,
    address: '0xF80124202C5a52318f86166DaafECa11fB8cb21F',
    priceFeed: '0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7',
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    address: '0xC650457Cc1c928fF0cbf47A43fbFA26c7D56c652',
    priceFeed: '0x5741306c21795FdCBb9b265Ea0255F499DFe515C',
  },
];

const ICO_CONTRACT_ADDRESS = '0xd621d8479Fe77F44A7E644C3FC704D1614C93152';

export default function IcoScreen() {
  const { wp, hp, font, radius, space } = useResponsive();
  const account = useActiveAccount();
  const address = account?.address;
  const isConnected = !!account;

  const [selectedToken, setSelectedToken] = useState<Token>(TOKENS[0]);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);

  const styles = createStyles(wp, hp, font, radius, space);



  const buyTokens = async () => {
    if (!account) {
      Alert.alert('Error', 'Please connect your wallet first');
      return;
    }
    
    if (!purchaseAmount || parseFloat(purchaseAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setIsPurchasing(true);
    
    try {
      // USE THE ADAPTER instead of manual provider digging
      // This converts the thirdweb 'account' into an Ethers v6 Signer
      const signer = ethers6Adapter.signer.toEthers({
        client: thirdwebClient,
        chain: bscTestnet, // Match this to your ICO network
        account: account,
      });

      const user = await signer.getAddress();
      console.log('User address:', user);
      console.log('Selected token:', selectedToken);
      
      // Your Ethers contract logic stays the same
      const ICO_contract = new ethers.Contract(ICO_CONTRACT_ADDRESS, icoABI, signer);

      if (selectedToken.symbol === "BNB") {
        console.log('Buying with BNB');
        const value = ethers.parseEther(purchaseAmount);
        
       
        const tx = await ICO_contract.buyTokenWithNative({ value: value });
        const receipt = await tx.wait();
        console.log('Transaction receipt:', receipt);
        Alert.alert('Success', 'Hash: ' + receipt.hash);

      } else {
        console.log('Buying with ERC20 token');
        const payment_contract = new ethers.Contract(selectedToken.address!, erc20ABI, signer);
        const purchaseAmount_inwei = ethers.parseUnits(purchaseAmount, selectedToken.decimals);
        
        console.log('Checking allowance...');
        const allowance = await payment_contract.allowance(user, ICO_CONTRACT_ADDRESS);
        console.log('Current allowance:', allowance.toString());

        if (BigInt(allowance) < BigInt(purchaseAmount_inwei)) {
         Alert.alert('Info', 'Approving token');
            setTimeout(async() => {
              const approveTx = await payment_contract.approve(ICO_CONTRACT_ADDRESS, purchaseAmount_inwei);
              await approveTx.wait();
              console.log('Approval completed');
              Alert.alert('Success', 'Approval completed');
            }, 2000);
         
        }
        Alert.alert('Info', 'Buying tokens...');
        setTimeout(async() => {

          console.log('Buying tokens with ERC20...');
                const txn = await ICO_contract.buyTokenWithERC20(selectedToken.address, purchaseAmount_inwei);
                const rec = await txn.wait();
                console.log('Transaction receipt:', rec);
                Alert.alert('Success', 'Hash: ' + rec.hash);
        }, 5000);
        
      }

    } catch (e: any) {
      console.error('Error:', e);
      let errorMessage = 'Transaction failed';
      
      if (e.code === 4001) {
        errorMessage = 'User rejected the transaction';
      } else if (e.code === -32603) {
        errorMessage = 'Internal error occurred';
      } else if (e.message) {
        errorMessage = e.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsPurchasing(false);
    }
  };




  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* HEADER */}

          <LinearGradient
            colors={['#1A0048', '#5B2BD6', '#9F7BFF']}
            style={styles.header}
          >
            <View style={styles.headerRow}>
              <TouchableOpacity style={styles.circleBtn}>
                <Icon name="chevron-back" size={22} color="#fff" />
              </TouchableOpacity>

              <Text style={styles.title}>ICO Page</Text>

              <TouchableOpacity style={styles.circleBtn}>
                <Icon name="notifications-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* WALLET CARD */}

            <View style={styles.walletCard}>
              <View>
                <Text style={styles.walletLabel}>WALLET ADDRESS</Text>
                <Text style={styles.walletAddress}>
                  {isConnected
                    ? `${address?.slice(0, 6)}....${address?.slice(-4)}`
                    : '0x123....456'}
                </Text>
              </View>

              <View style={styles.walletIcons}>
                <View style={styles.iconBtn}>
                  <Feather name="copy" size={18} color="#fff" />
                </View>
                <View style={styles.iconBtn}>
                  <Icon name="share-social-outline" size={18} color="#fff" />
                </View>
              </View>
            </View>

            {/* BUY TOKEN - REMOVED - MOVED TO PAYMENT SECTION */}
          </LinearGradient>

          {/* PAYMENT SUMMARY - EXACT MATCH FROM IMAGE */}

          <View style={styles.paymentCard}>
            {/* YOU PAY BOX */}
            <View style={styles.exchangeBox}>
              <Text style={styles.boxLabel}>YOU PAY</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.amountInput}
                  value={purchaseAmount}
                  onChangeText={setPurchaseAmount}
                  placeholder="0.0001"
                  keyboardType="numeric"
                  placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity
                  style={styles.tokenSelector}
                  onPress={() => setShowTokenModal(true)}
                >
                  {selectedToken.symbol === 'BNB' && (
                    <Image source={require('../../assets/Binance.png')} style={styles.tokenLogo} />
                  )}
                  {selectedToken.symbol === 'USDT' && (
                    <Image source={require('../../assets/USDT.png')} style={styles.tokenLogo} />
                  )}
                  {selectedToken.symbol === 'USDC' && (
                    <Image source={require('../../assets/USDC.png')} style={styles.tokenLogo} />
                  )}
                  {selectedToken.symbol === 'WETH' && (
                    <Image source={require('../../assets/Ethereum.png')} style={styles.tokenLogo} />
                  )}
                  {selectedToken.symbol === 'WBTC' && (
                    <Image source={require('../../assets/Bitcoin.png')} style={styles.tokenLogo} />
                  )}
                  <Text style={styles.tokenText}>{selectedToken.symbol}</Text>
                  <Icon
                    name="chevron-down"
                    size={14}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* SWAP ICON */}
            <TouchableOpacity style={styles.swapButton}>
              <MaterialCommunityIcons
                name="swap-vertical"
                size={20}
                color="#fff"
              />
            </TouchableOpacity>

            {/* YOU RECEIVE BOX */}
            <View style={styles.exchangeBox}>
              <Text style={styles.boxLabel}>YOU RECEIVE</Text>
              <View style={styles.inputRow}>
                <Text style={styles.receiveAmount}>
                  {purchaseAmount && parseFloat(purchaseAmount) > 0
                    ? `${(
                        (parseFloat(purchaseAmount) *
                          (selectedToken.symbol === 'BNB' ? 648 : 1.001)) /
                        0.00001
                      ).toFixed(0)}`
                    : '0'}
                </Text>
                <View style={styles.tokenSelector}>
                  <Image source={require('../../assets/ABCD.png')} style={styles.tokenLogo} />
                  <Text style={styles.tokenText}>ABCD</Text>
                </View>
              </View>
            </View>

            {/* GAS FEE */}
            <View style={styles.gasFeeRow}>
              <Text style={styles.gasFeeText}>Estimated Gas Fee</Text>
              <Text style={styles.gasFeeAmount}>~$0.5</Text>
            </View>

            {/* BUY BUTTON */}
            <TouchableOpacity
              style={styles.buyButton}
              onPress={buyTokens}
              disabled={isPurchasing}
            >
              <LinearGradient
                colors={['#4A2AA7', '#6A35FF']}
                style={styles.buyButtonGradient}
              >
                <Text style={styles.buyButtonText}>
                  {isPurchasing ? 'Processing...' : 'Buy ABCD Token'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* ICO PROGRESS */}

          <LinearGradient
            colors={['#4A2AA7', '#8A69FF']}
            style={styles.progressCard}
          >
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>ICO PROGRESS</Text>
              <Text style={styles.percent}>62% Sold</Text>
            </View>

            <View style={styles.progressBarBg}>
              <View style={styles.progressFill} />
            </View>

            <View style={styles.progressRow}>
              <Text style={styles.progressText}>620M ABCD sold</Text>
              <Text style={styles.progressText}>Goal: 1B ABCD</Text>
            </View>
          </LinearGradient>

          {/* STATS */}

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>$0.00001</Text>
              <Text style={styles.statLabel}>PRICE/TOKEN</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}>10B</Text>
              <Text style={styles.statLabel}>TOTAL SUPPLY</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}>14d</Text>
              <Text style={styles.statLabel}>ENDS IN</Text>
            </View>
          </View>
        </View>

        {/* TOKEN SELECTION MODAL */}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (
  wp: { (percent: number): number; (arg0: number): any },
  hp: { (percent: number): number; (arg0: number): number },
  font: { (size: number): number; (arg0: number): any },
  radius: { (size: number): number; (arg0: number): any },
  space: { (size: number): number; (arg0: number): any },
) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },

    header: {
      padding: space(5),
      paddingBottom: hp(14),
      // borderBottomLeftRadius:radius(6),
      // borderBottomRightRadius:radius(6)
    },

    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    circleBtn: {
      width: wp(11),
      height: wp(11),
      borderRadius: wp(5.5),
      backgroundColor: 'rgba(255,255,255,0.25)',
      justifyContent: 'center',
      alignItems: 'center',
    },

    title: {
      color: '#fff',
      fontSize: font(20),
      fontFamily: Fonts.bold,
    },

    walletCard: {
      marginTop: hp(3),
      padding: space(5),
      borderRadius: radius(5),
      borderWidth: 1,
      backgroundColor: 'rgba(255,255,255,0.08)', // glass effect

      borderColor: 'rgba(255,255,255,0.3)',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    walletLabel: {
      color: '#ddd',
      fontSize: font(12),
      fontFamily: Fonts.regular,
    },

    walletAddress: {
      color: '#fff',
      fontSize: font(20),

      fontFamily: Fonts.bold,
      marginTop: hp(0.6),
    },

    walletIcons: {
      flexDirection: 'row',
    },

    iconBtn: {
      width: wp(10),
      height: wp(10),
      borderRadius: radius(3),
      backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: space(3),
    },

    sectionTitle: {
      color: '#fff',
      fontSize: font(20),
      fontFamily: Fonts.bold,
      marginTop: hp(3),
    },

    paymentCard: {
      marginHorizontal: space(5),
      backgroundColor: '#1a1a1a',
      borderRadius: radius(5),
      padding: space(5),
      marginTop: -hp(10),
      elevation: 10,
    },

    exchangeBox: {
      backgroundColor: '#2a2a2a',
      borderWidth: 1,
      borderColor: '#3a3a3a',
      borderRadius: radius(4),
      padding: space(4),
      marginBottom: hp(2),
    },

    boxLabel: {
      color: '#888',
      fontSize: font(12),
      fontFamily: Fonts.medium,
      marginBottom: hp(1),
    },

    inputRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    amountInput: {
      flex: 1,
      fontSize: font(18),
      color: '#fff',
      fontFamily: Fonts.medium,
    },

    receiveAmount: {
      flex: 1,
      fontSize: font(18),
      color: '#fff',
      fontFamily: Fonts.medium,
    },

    tokenSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#3a3a3a',
      paddingHorizontal: space(2),
      paddingVertical: hp(0.8),
      borderRadius: radius(2),
      minWidth: wp(20),
      justifyContent: 'center',
    },

    tokenLogo: {
      width: wp(5),
      height: wp(5),
      marginRight: space(1),
    },

    tokenText: {
      color: '#fff',
      fontSize: font(14),
      fontFamily: Fonts.medium,
      marginRight: space(0.5),
    },

    swapButton: {
      alignSelf: 'center',
      backgroundColor: '#4A2AA7',
      width: wp(10),
      height: wp(10),
      borderRadius: wp(5),
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: hp(1),
    },

    gasFeeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: hp(2),
    },

    gasFeeText: {
      color: '#888',
      fontSize: font(13),
      fontFamily: Fonts.regular,
    },

    gasFeeAmount: {
      color: '#fff',
      fontSize: font(13),
      fontFamily: Fonts.medium,
    },

    buyButton: {
      marginTop: hp(2),
    },

    buyButtonGradient: {
      paddingVertical: hp(1.8),
      borderRadius: radius(3),
      alignItems: 'center',
    },

    buyButtonText: {
      color: '#fff',
      fontSize: font(16),
      fontFamily: Fonts.bold,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },

    progressCard: {
      margin: space(5),
      borderRadius: radius(5),
      padding: space(5),
    },

    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    progressTitle: {
      color: '#fff',
      fontFamily: Fonts.bold,
      fontSize: font(16),
    },

    percent: {
      color: '#ddd',
      fontSize: font(14),
      fontFamily: Fonts.regular,
    },

    progressBarBg: {
      height: hp(1.2),
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: radius(5),
      marginTop: hp(1),
    },

    progressFill: {
      width: '62%',
      height: hp(1.2),
      backgroundColor: '#D18FFF',
      borderRadius: radius(5),
    },

    progressRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: hp(1.2),
    },

    progressText: {
      color: '#ddd',
      fontSize: font(13),
      fontFamily: Fonts.regular,
    },

    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginHorizontal: space(5),
    },

    statBox: {
      backgroundColor: '#FFF',
      borderRadius: radius(4.5),
      padding: space(4),
      alignItems: 'center',
      width: '32%',
      elevation: 5,
    },

    statValue: {
      color: '#6A35FF',
      fontSize: font(13),
      fontFamily: Fonts.bold,
    },

    statLabel: {
      color: '#777',
      fontSize: font(11),
      fontFamily: Fonts.regular,
    },

    modalContent: {
      backgroundColor: '#fff',
      borderRadius: radius(3),
      padding: space(5),
      width: '80%',
      maxHeight: '80%',
    },

    modalTitle: {
      fontSize: font(20),
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: space(4),
      textAlign: 'center',
    },

    tokenOption: {
      paddingVertical: space(3),
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6',
    },

    tokenOptionText: {
      fontSize: font(16),
      color: '#1f2937',
    },

    closeButton: {
      marginTop: space(4),
      backgroundColor: '#6b7280',
      paddingVertical: space(3),
      borderRadius: radius(2),
      alignItems: 'center',
    },

    closeButtonText: {
      color: '#fff',
      fontSize: font(16),
      fontWeight: '600',
    },
  });
