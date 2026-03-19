import "@thirdweb-dev/react-native-adapter";
import React, { useState, useEffect } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsive } from '../../Utils/Responsive';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Jazzicon } from '@arturhoncharuk/react-native-jazzicon';
import Fonts from '../../Utils/Fonts';
import { useActiveAccount } from 'thirdweb/react';
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
  const [tokenBalances, setTokenBalances] = useState<{ [key: string]: string }>({});
  const [tokenPrices, setTokenPrices] = useState<{ [key: string]: number }>({});
  const [icoPrice, setIcoPrice] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState('00D : 00H');

  const fetchTokenData = async () => {
    if (!address) {
      setTokenBalances({});
    }

    try {
      const provider = new ethers.JsonRpcProvider('https://bsc-testnet.publicnode.com');
      const balances: { [key: string]: string } = {};
      const prices: { [key: string]: number } = {};

      const icoContract = new ethers.Contract(ICO_CONTRACT_ADDRESS, icoABI, provider);

      // Fetch ICO Token price (ABCD price)
      try {
        const iPrice = await icoContract.icoPrice();
        setIcoPrice(Number(ethers.formatUnits(iPrice, 18)));
      } catch (e) {
        console.error('Error fetching ico price:', e);
      }

      // Fetch ICO End Time
      try {
        const endTimeBN = await icoContract.icoEndTime();
        const endTime = Number(endTimeBN); // block.timestamp is in seconds
        const currentTime = Math.floor(Date.now() / 1000);
        const diff = endTime - currentTime;

        if (diff > 0) {
          const days = Math.floor(diff / (24 * 3600));
          const hours = Math.floor((diff % (24 * 3600)) / 3600);
          const minutes = Math.floor((diff % 3600) / 60);
          setTimeLeft(`${days}D : ${hours}H : ${minutes}M`);
        } else {
          setTimeLeft('Ended');
        }
      } catch (e) {
        console.error('Error fetching ico end time:', e);
      }

      // Fetch balances and prices for each payment token
      await Promise.all(TOKENS.map(async (token) => {
        const tokenAddr = token.address || '0x0000000000000000000000000000000000000000';

        // Fetch Balance if connected
        if (address) {
          try {
            if (token.symbol === 'BNB') {
              const bnbBal = await provider.getBalance(address);
              balances['BNB'] = ethers.formatEther(bnbBal);
            } else {
              const contract = new ethers.Contract(token.address!, erc20ABI, provider);
              const bal = await contract.balanceOf(address);
              balances[token.symbol] = ethers.formatUnits(bal, token.decimals);
            }
          } catch (err) {
            balances[token.symbol] = '0.00';
          }
        }

        // Fetch Price
        try {
          const [price, decimals] = await icoContract.getTokenPrice(tokenAddr);
          prices[token.symbol] = Number(ethers.formatUnits(price, decimals));
        } catch (err) {
          console.error(`Error fetching price for ${token.symbol}:`, err);
        }
      }));

      if (address) setTokenBalances(balances);
      setTokenPrices(prices);
    } catch (error) {
      // console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchTokenData();
    const interval = setInterval(fetchTokenData, 15000);
    return () => clearInterval(interval);
  }, [isConnected, address]);

  const amountToNumber = parseFloat(purchaseAmount) || 0;
  const currentTokenBalance = parseFloat(tokenBalances[selectedToken.symbol] || '0');
  const isInsufficient = isConnected && amountToNumber > currentTokenBalance;

  const styles = createStyles(wp, hp, font, radius, space);

  const validateInputs = () => {
    if (!account) {
      Alert.alert('Error', 'Please connect your wallet first');
      return false;
    }

    const amount = parseFloat(purchaseAmount);
    if (!purchaseAmount || isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid positive amount');
      return false;
    }

    const currentBalance = tokenBalances[selectedToken.symbol] || '0';
    if (amount > parseFloat(currentBalance)) {
      Alert.alert('Error', `Insufficient ${selectedToken.symbol} balance. You have ${parseFloat(currentBalance).toFixed(4)} ${selectedToken.symbol}`);
      return false;
    }

    return true;
  };

  const buyTokens = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsPurchasing(true);

    try {
      if (!account) return;

      const signer = ethers6Adapter.signer.toEthers({
        client: thirdwebClient,
        chain: bscTestnet,
        account: account,
      });

      const user = await signer.getAddress();
      const ICO_contract = new ethers.Contract(ICO_CONTRACT_ADDRESS, icoABI, signer);

      if (selectedToken.symbol === "BNB") {
        const value = ethers.parseEther(purchaseAmount);
        const tx = await ICO_contract.buyTokenWithNative({ value: value });
        const receipt = await tx.wait();
        Alert.alert('Success', 'Hash: ' + receipt.hash);
        fetchTokenData();

      } else {
        const payment_contract = new ethers.Contract(selectedToken.address!, erc20ABI, signer);
        const purchaseAmount_inwei = ethers.parseUnits(purchaseAmount, selectedToken.decimals);
        const allowance = await payment_contract.allowance(user, ICO_CONTRACT_ADDRESS);

        if (BigInt(allowance) < BigInt(purchaseAmount_inwei)) {
          Alert.alert('Info', 'Approving token');
          setTimeout(async () => {
            const approveTx = await payment_contract.approve(ICO_CONTRACT_ADDRESS, purchaseAmount_inwei);
            await approveTx.wait();
            Alert.alert('Success', 'Approval completed');
            fetchTokenData();
          }, 2000);
        }
        Alert.alert('Info', 'Buying tokens...');
        setTimeout(async () => {
          const txn = await ICO_contract.buyTokenWithERC20(selectedToken.address, purchaseAmount_inwei);
          const rec = await txn.wait();
          Alert.alert('Success', 'Hash: ' + rec.hash);
          fetchTokenData();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f0f11' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>

          {/* TOP NAV */}
          <View style={styles.topNav}>
            <View style={styles.navLeft}>
              {/* <Image
                source={require('../../assets/ABCD.png')}
                style={{ width: wp(9), height: wp(9) }}
                resizeMode="contain"
              /> */}
              {/* <Text style={styles.brandTitle}>ABCD<Text style={styles.brandHighlight}>.FI</Text></Text> */}
            </View>

            <View style={styles.walletBar}>
              <View style={styles.networkBadge}>
                <Image
                  source={require('../../assets/Binance.png')}
                  style={styles.miniBnbIcon}
                />
                <Text style={styles.networkName}>BSC</Text>
              </View>

              <View style={styles.addressPill}>
                <Text style={styles.truncatedAddress}>
                  {isConnected && address ? `${address.slice(0, 4)}...${address.slice(-4)}` : 'Connect'}
                </Text>
                <View style={styles.jazziconBox}>
                  {isConnected && address ? (
                    <Jazzicon size={wp(7)} address={address} />
                  ) : (
                    <Icon name="wallet" size={16} color="#4b5563" />
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* HERO SECTION */}
          {/* <View style={styles.heroSection}>
            <Text style={styles.heroTitleLine1}>FUEL THE</Text>
            <Text style={styles.heroTitleLine2}>
              <Text style={styles.heroTitleHighlight}>KINETIC</Text> VOID.
            </Text>
            <Text style={styles.heroSubtitle}>
              Secure your allocation in the next generation of BSC yield protocols. Limited presale live.
            </Text>
          </View> */}

          {/* MAIN SWAP CARD */}
          <View style={styles.mainSwapCard}>
            {/* PAY SECTION */}
            <View style={styles.swapSectionHeader}>
              <Text style={styles.swapSectionTitle}>PAY</Text>
              <Text style={styles.swapSectionSubtitle}>
                Balance: {tokenBalances[selectedToken.symbol] ? parseFloat(tokenBalances[selectedToken.symbol]).toFixed(4) : '0.00'} {selectedToken.symbol}
              </Text>
            </View>
            <View style={styles.swapInputRow}>
              <View style={styles.swapInputCol}>
                <TextInput
                  style={[styles.swapInputPrimary, isInsufficient && { color: '#ef4444' }]}
                  value={purchaseAmount}
                  onChangeText={(text) => {
                    let sanitized = text.replace(/[^0-9.]/g, '');
                    const parts = sanitized.split('.');
                    if (parts.length > 2) {
                      sanitized = parts[0] + '.' + parts.slice(1).join('');
                    }

                    // Handle leading zeros
                    if (sanitized.startsWith('0') && sanitized.length > 1 && sanitized[1] !== '.') {
                      sanitized = sanitized.replace(/^0+/, '');
                      if (sanitized.startsWith('.')) sanitized = '0' + sanitized;
                    } else if (sanitized.startsWith('.')) {
                      sanitized = '0' + sanitized;
                    }

                    setPurchaseAmount(sanitized);
                  }}
                  placeholder="0.0"
                  keyboardType="numeric"
                  placeholderTextColor="#666"
                />
                <Text style={styles.swapInputSecondary}>
                  ~${purchaseAmount && tokenPrices[selectedToken.symbol]
                    ? (parseFloat(purchaseAmount) * tokenPrices[selectedToken.symbol]).toFixed(2)
                    : '0.00'}
                </Text>
              </View>

              <TouchableOpacity style={styles.tokenPill} onPress={() => setShowTokenModal(true)}>
                {selectedToken.symbol === 'BNB' && <Image source={require('../../assets/Binance.png')} style={styles.pillIcon} />}
                {selectedToken.symbol === 'USDT' && <Image source={require('../../assets/USDT.png')} style={styles.pillIcon} />}
                {selectedToken.symbol === 'USDC' && <Image source={require('../../assets/USDC.png')} style={styles.pillIcon} />}
                {selectedToken.symbol === 'WBTC' && <Image source={require('../../assets/Bitcoin.png')} style={styles.pillIcon} />}
                {selectedToken.symbol === 'WETH' && <Image source={require('../../assets/Ethereum.png')} style={styles.pillIcon} />}
                <Text style={styles.pillText}>{selectedToken.symbol}</Text>
                <Icon name="chevron-down" size={14} color="#a1a1aa" />
              </TouchableOpacity>
            </View>

            {/* Center Swap Arrow */}
            <View style={styles.centerArrowContainer}>
              <View style={styles.centerArrowCircle}>
                <MaterialCommunityIcons name="arrow-down" size={20} color="#7042f8" />
              </View>
            </View>

            {/* RECEIVE SECTION */}
            <View style={styles.swapSectionHeader}>
              <Text style={styles.swapSectionTitle}>RECEIVE</Text>
            </View>
            <View style={styles.swapInputRow}>
              <View style={styles.swapInputCol}>
                <Text style={[styles.swapInputPrimary, { color: '#7042f8' }]}>
                  {purchaseAmount && tokenPrices[selectedToken.symbol] && icoPrice > 0
                    ? ((parseFloat(purchaseAmount) * tokenPrices[selectedToken.symbol]) / icoPrice).toFixed(2)
                    : '0.00'}
                </Text>
                <Text style={styles.swapInputSecondary}>Allocation: 0.12%</Text>
              </View>

              <View style={[styles.tokenPill, { paddingRight: space(4) }]}>
                <Image source={require('../../assets/ABCD.png')} style={styles.pillIcon} />
                <Text style={styles.pillText}>ABCD</Text>
              </View>
            </View>

            <View style={{ alignItems: 'center', marginBottom: hp(1) }}>
              <Text style={styles.swapSectionSubtitle}>
                1 {selectedToken.symbol} = {tokenPrices?.[selectedToken.symbol] && icoPrice > 0
                  ? (tokenPrices[selectedToken.symbol] / icoPrice).toLocaleString(undefined, { maximumFractionDigits: 0 })
                  : '...'} ABCD
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.buyBtn, (isPurchasing || isInsufficient) && { backgroundColor: '#2d2d30' }]}
              onPress={buyTokens}
              disabled={isPurchasing || isInsufficient}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
              }}>
                <Text style={[styles.buyBtnText, (isPurchasing || isInsufficient) && { color: '#6b7280' }]}>
                  {isPurchasing ? 'Processing...' : isInsufficient ? 'Insufficient Balance' : 'BUY ABCD'}
                </Text>
                {!isPurchasing && !isInsufficient && (
                  <Image
                    source={require('../../assets/rocket.png')}
                    style={{ width: wp(6.5), height: wp(8), marginTop: -6, marginLeft: space(2.5) }}
                    resizeMode="contain"
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* ICO PROGRESS */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>ICO PROGRESS</Text>
              <Text style={styles.progressPercent}>65.4%</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={styles.progressBarFill} />
            </View>
            <Text style={styles.progressSubInfo}>256M / 1 Billion ABCD</Text>
          </View>

          {/* SIMPLIFIED STATS GRID */}
          <View style={styles.simpleGrid}>
            <View style={styles.simpleStatCard}>
              <MaterialCommunityIcons name="timer-outline" size={wp(6)} color="#7042f8" />
              <View style={styles.simpleStatTextCol}>
                <Text style={styles.simpleLabel}>ROUND 01</Text>
                <Text style={styles.simpleValue}>SEED SALE</Text>
                <Text style={styles.simpleSubValue}>0.00001 $</Text>
              </View>
            </View>

            <View style={styles.simpleStatCard}>
              <MaterialCommunityIcons name="currency-usd" size={wp(6)} color="#7042f8" />
              <View style={styles.simpleStatTextCol}>
                <Text style={styles.simpleLabel}>TOTAL RAISED</Text>
                <Text style={styles.simpleValue}>8,502 USD</Text>
                {/* <Text style={styles.simpleSubValue}>512M / 2 Billion</Text> */}
              </View>
            </View>

            <View style={styles.simpleStatCard}>
              <Feather name="clock" size={wp(5)} color="#7042f8" />
              <View style={styles.simpleStatTextCol}>
                <Text style={styles.simpleLabel}>TIME LEFT</Text>
                <Text style={styles.simpleValue}>{timeLeft}</Text>
              </View>
            </View>

            <View style={styles.simpleStatCard}>
              <MaterialCommunityIcons name="account-group-outline" size={wp(6)} color="#7042f8" />
              <View style={styles.simpleStatTextCol}>
                <Text style={styles.simpleLabel}>PARTICIPANTS</Text>
                <Text style={styles.simpleValue}>1,248 Users</Text>
              </View>
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
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Asset</Text>
                <TouchableOpacity onPress={() => setShowTokenModal(false)} style={styles.modalCloseBtn}>
                  <Icon name="close" size={24} color="#a1a1aa" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: space(4) }}>
                {TOKENS.map(token => (
                  <TouchableOpacity
                    key={token.symbol}
                    style={styles.tokenOptionCard}
                    activeOpacity={0.7}
                    onPress={() => {
                      setSelectedToken(token);
                      setShowTokenModal(false);
                    }}
                  >
                    <View style={styles.tokenOptionLayout}>
                      <View style={styles.tokenIconWrapper}>
                        {token.symbol === 'BNB' && <Image source={require('../../assets/Binance.png')} style={styles.modalTokenIcon} />}
                        {token.symbol === 'USDT' && <Image source={require('../../assets/USDT.png')} style={styles.modalTokenIcon} />}
                        {token.symbol === 'USDC' && <Image source={require('../../assets/USDC.png')} style={styles.modalTokenIcon} />}
                        {token.symbol === 'WETH' && <Image source={require('../../assets/Ethereum.png')} style={styles.modalTokenIcon} />}
                        {token.symbol === 'WBTC' && <Image source={require('../../assets/Bitcoin.png')} style={styles.modalTokenIcon} />}
                      </View>

                      <View style={styles.tokenNameCol}>
                        <Text style={styles.tokenSymbolText}>{token.symbol}</Text>
                        <Text style={styles.tokenSubtitleText}>{token.name}</Text>
                      </View>

                      <View style={styles.tokenBalanceCol}>
                        <Text style={styles.tokenBalanceText}>
                          {tokenBalances[token.symbol] ? parseFloat(tokenBalances[token.symbol]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : '0.00'}
                        </Text>
                        <Text style={styles.tokenBalanceLabel}>Balance</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
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
      padding: space(5),
    },
    topNav: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: hp(4),
      marginTop: hp(1),
    },
    navLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    brandTitle: {
      color: '#fff',
      fontSize: font(18),
      fontFamily: Fonts.bold,
      marginLeft: space(2),
      letterSpacing: 0.5,
    },
    brandHighlight: {
      color: '#7042f8',
    },
    walletBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#161618',
      borderRadius: radius(10),
      padding: space(1),
      borderWidth: 1,
      borderColor: '#202124',
    },
    networkBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(231, 225, 53, 0.1)',
      paddingHorizontal: space(2.5),
      paddingVertical: space(1.5),
      borderRadius: radius(10),
      marginRight: space(1),
    },
    miniBnbIcon: {
      width: wp(3.5),
      height: wp(3.5),
      marginRight: space(1.5),
    },
    networkName: {
      color: '#e7e135',
      fontSize: font(10),
      fontFamily: Fonts.bold,
    },
    addressPill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: space(2),
      paddingRight: space(0.5),
    },
    truncatedAddress: {
      color: '#d1d5db',
      fontSize: font(11),
      fontFamily: Fonts.medium,
      marginRight: space(2),
    },
    jazziconBox: {
      width: wp(8),
      height: wp(8),
      borderRadius: wp(4),
      overflow: 'hidden',
      backgroundColor: '#202124',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#303036',
    },
    navTokenText: {
      color: '#7042f8',
      fontSize: font(14),
      fontFamily: Fonts.bold,
      letterSpacing: 0.5,
      marginRight: space(2),
    },
    navTokenIconContainer: {
      width: wp(6),
      height: wp(6),
      backgroundColor: '#7042f8',
      borderRadius: wp(1.5),
      justifyContent: 'center',
      alignItems: 'center',
    },
    heroSection: {
      marginBottom: hp(4),
    },
    heroTitleLine1: {
      color: '#fff',
      fontSize: font(36),
      fontFamily: Fonts.bold,
      lineHeight: font(40),
    },
    heroTitleLine2: {
      color: '#fff',
      fontSize: font(36),
      fontFamily: Fonts.bold,
      lineHeight: font(40),
      marginBottom: hp(2),
    },
    heroTitleHighlight: {
      color: '#7042f8',
    },
    heroSubtitle: {
      color: '#9ca3af',
      fontSize: font(14),
      fontFamily: Fonts.regular,
      lineHeight: 22,
    },
    mainSwapCard: {
      backgroundColor: '#161618',
      borderRadius: radius(4),
      padding: space(4),
      marginBottom: hp(5),
      marginTop: hp(4),
    },
    swapSectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: hp(1.5),
    },
    swapSectionTitle: {
      color: '#d1d5db',
      fontSize: font(12),
      fontFamily: Fonts.medium,
      letterSpacing: 1,
    },
    swapSectionSubtitle: {
      color: '#6b7280',
      fontSize: font(11),
      fontFamily: Fonts.regular,
    },
    swapInputRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#202124',
      borderRadius: radius(3),
      padding: space(4),
      marginBottom: hp(2),
    },
    swapInputCol: {
      flex: 1,
    },
    swapInputPrimary: {
      color: '#fff',
      fontSize: font(28),
      fontFamily: Fonts.bold,
      padding: 0,
      marginBottom: 4,
    },
    swapInputSecondary: {
      color: '#6b7280',
      fontSize: font(12),
      fontFamily: Fonts.regular,
    },
    tokenPill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#303036',
      paddingHorizontal: space(3),
      paddingVertical: space(2),
      borderRadius: radius(5),
    },
    pillIcon: {
      width: wp(5),
      height: wp(5),
      marginRight: space(2),
    },
    pillText: {
      color: '#fff',
      fontSize: font(14),
      fontFamily: Fonts.bold,
      marginRight: space(1),
    },
    centerArrowContainer: {
      alignItems: 'center',
      marginVertical: -hp(3.5),
      zIndex: 10,
    },
    centerArrowCircle: {
      backgroundColor: '#0f0f11',
      width: wp(11),
      height: wp(11),
      borderRadius: wp(5.5),
      justifyContent: 'center',
      alignItems: 'center',
    },
    buyBtn: {
      backgroundColor: '#7042f8',
      borderRadius: radius(3),
      height: hp(7),
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: hp(4), // Increased top margin
    },
    buyBtnText: {
      color: '#fff',
      fontSize: font(16),
      fontFamily: Fonts.bold,
      letterSpacing: 1,
    },
    progressSection: {
      marginBottom: hp(4),
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: hp(1.5),
    },
    progressTitle: {
      color: '#fff',
      fontSize: font(18),
      fontFamily: Fonts.bold,
    },
    progressPercent: {
      color: '#7042f8',
      fontSize: font(16),
      fontFamily: Fonts.bold,
    },
    progressBarTrack: {
      height: hp(1.5),
      backgroundColor: '#202124',
      borderRadius: radius(2),
    },
    progressBarFill: {
      height: '100%',
      width: '65.4%',
      backgroundColor: '#7042f8',
      borderRadius: radius(2),
    },
    progressSubInfo: {
      color: '#6b7280',
      fontSize: font(9),
      fontFamily: Fonts.medium,
      marginTop: space(1),
      textAlign: 'right',
      letterSpacing: 0.5,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: hp(4),
    },
    simpleGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: hp(5),
    },
    simpleStatCard: {
      width: '48.5%',
      backgroundColor: '#161618',
      borderRadius: radius(3),
      padding: space(3.5),
      marginBottom: space(3),
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#202124',
    },
    simpleStatTextCol: {
      marginLeft: space(3),
      flex: 1,
    },
    simpleLabel: {
      color: '#6b7280',
      fontSize: font(9),
      fontFamily: Fonts.medium,
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    simpleValue: {
      color: '#fff',
      fontSize: font(13),
      fontFamily: Fonts.bold,
    },
    simpleSubValue: {
      color: '#7042f8',
      fontSize: font(12),
      fontFamily: Fonts.medium,
      marginTop: 2,
    },
    securityFooter: {
      flexDirection: 'row',
      backgroundColor: '#161618',
      padding: space(4),
      borderRadius: radius(3),
      alignItems: 'flex-start',
      marginBottom: hp(10),
    },
    securityTexts: {
      flex: 1,
      marginLeft: space(3),
    },
    securityTitle: {
      color: '#fff',
      fontSize: font(14),
      fontFamily: Fonts.bold,
      marginBottom: space(1),
    },
    securityDesc: {
      color: '#9ca3af',
      fontSize: font(12),
      fontFamily: Fonts.regular,
      lineHeight: 18,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.8)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#161618',
      borderRadius: radius(5),
      paddingHorizontal: space(4),
      paddingVertical: space(5),
      width: '88%',
      maxHeight: '65%', // Reduced height
      borderWidth: 1,
      borderColor: '#2d2d33',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: space(4),
    },
    modalCloseBtn: {
      padding: space(1),
    },
    modalTitle: {
      fontSize: font(20),
      color: '#fff',
      fontFamily: Fonts.bold,
    },
    tokenOptionCard: {
      backgroundColor: '#1b1b1e',
      borderRadius: radius(3),
      paddingVertical: space(2.5),
      paddingHorizontal: space(3.5),
      marginBottom: space(2), // Reduced vertical spacing
      borderWidth: 1,
      borderColor: '#2d2d33',
    },
    tokenOptionLayout: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    tokenIconWrapper: {
      width: wp(9.5), // Reduced icon size
      height: wp(9.5),
      borderRadius: wp(5),
      backgroundColor: '#202124',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: space(3),
    },
    modalTokenIcon: {
      width: wp(5.5),
      height: wp(5.5),
    },
    tokenNameCol: {
      flex: 1,
    },
    tokenSymbolText: {
      fontSize: font(15),
      color: '#fff',
      fontFamily: Fonts.bold,
    },
    tokenSubtitleText: {
      fontSize: font(10),
      color: '#6b7280',
      fontFamily: Fonts.medium,
      marginTop: 1,
    },
    tokenBalanceCol: {
      alignItems: 'flex-end',
    },
    tokenBalanceText: {
      fontSize: font(14),
      color: '#fff',
      fontFamily: Fonts.bold,
    },
    tokenBalanceLabel: {
      fontSize: font(9),
      color: '#7042f8',
      fontFamily: Fonts.medium,
      marginTop: 0,
    },
    roundBanner: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#161618',
      borderRadius: radius(4),
      padding: space(4),
      marginTop: hp(1),
      marginBottom: hp(10),
      borderWidth: 1,
      borderColor: '#202124',
    },
    roundLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    activeDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#4ade80',
      marginRight: space(2),
    },
    roundLabel: {
      color: '#fff',
      fontFamily: Fonts.bold,
      fontSize: font(12),
      letterSpacing: 0.5,
    },
    roundRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    priceLabel: {
      color: '#6b7280',
      fontFamily: Fonts.medium,
      fontSize: font(12),
      marginRight: space(2),
    },
    priceValue: {
      color: '#7042f8',
      fontFamily: Fonts.bold,
      fontSize: font(14),
    },
  });
