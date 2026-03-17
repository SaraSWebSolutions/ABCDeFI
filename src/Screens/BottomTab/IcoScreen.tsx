import React, { useState } from "react";
import {
View,
Text,
StyleSheet,
TouchableOpacity,
ScrollView,
Modal,
TextInput,
Alert
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResponsive } from "../../Utils/Responsive";
import Icon  from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Fonts from "../../Utils/Fonts";
import {
  useAppKit,
  useAccount,
  AppKitButton,
} from '@reown/appkit-react-native';
import { useProvider } from '@reown/appkit-react-native';
import { BrowserProvider, Contract, parseUnits } from 'ethers';
import { bsc } from 'viem/chains';
import icoABI from '../../abi/ico.json';

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
    priceFeed: '0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 18,
    address: '0xe64cD36a899E6136bE5ebd4EF459AE5BE2a43307',
    priceFeed: '0xEca2605f0BCF2BA5966372C99837b1F182d3D620'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 18,
    address: '0xd056eE5dC917ab61Cca8488F39Cd472b552a010B',
    priceFeed: '0x90c069C4538adAc136E051052E14c1cD799C41B7'
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    decimals: 18,
    address: '0xF80124202C5a52318f86166DaafECa11fB8cb21F',
    priceFeed: '0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7'
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    address: '0xC650457Cc1c928fF0cbf47A43fbFA26c7D56c652',
    priceFeed: '0x5741306c21795FdCBb9b265Ea0255F499DFe515C'
  },
];

const ERC20_ABI=[
          "function allowance(address owner, address spender) view returns (uint256)",
          "function approve(address spender, uint256 amount) returns (bool)"
        ]

const ICO_CONTRACT_ADDRESS = '0xd621d8479Fe77F44A7E644C3FC704D1614C93152';

export default function IcoScreen() {
const { wp, hp, font, radius, space } = useResponsive();
const { open, disconnect } = useAppKit();
const { address, isConnected, chainId } = useAccount();
const { provider: walletProvider } = useProvider();

const [selectedToken, setSelectedToken] = useState<Token>(TOKENS[0]);
const [purchaseAmount, setPurchaseAmount] = useState('');
const [isPurchasing, setIsPurchasing] = useState(false);
const [showTokenModal, setShowTokenModal] = useState(false);

const styles = createStyles(wp, hp, font, radius, space);

const buyTokens = async () => {
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
        `Transaction confirmed: ${receipt.hash}`,
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

<SafeAreaView style={{flex:1,backgroundColor:"#fff"}}>

<ScrollView  contentContainerStyle={{paddingBottom:120}}showsVerticalScrollIndicator={false}>

<View style={styles.container}>

{/* HEADER */}

<LinearGradient
colors={["#1A0048","#5B2BD6","#9F7BFF"]}
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
<Text style={styles.walletAddress}>{isConnected ? `${address?.slice(0,6)}....${address?.slice(-4)}` : '0x123....456'}</Text>
</View>

<View style={styles.walletIcons}>
  
  
<View style={styles.iconBtn}><Feather name="copy" size={18} color="#fff" /></View>
<View style={styles.iconBtn}><Icon name="share-social-outline" size={18} color="#fff" /></View>
</View>

</View>


{/* BUY TOKEN */}

<Text style={styles.sectionTitle}>BUY ABCD TOKENS</Text>

<View style={styles.amountBox}>

<TextInput
  style={styles.amountInput}
  value={purchaseAmount}
  onChangeText={setPurchaseAmount}
  placeholder="Enter amount"
  keyboardType="numeric"
  placeholderTextColor="#9ca3af"
/>

<TouchableOpacity
  style={styles.tokenBadge}
  onPress={() => setShowTokenModal(true)}
>
  <Text style={{color:"#fff",fontFamily:Fonts.medium,}}>{selectedToken.symbol}</Text>
  <Icon name="chevron-down" size={16} color="#fff" style={{marginLeft: 5}} />
</TouchableOpacity>

</View>


{/* PAYMENT OPTIONS */}

<View style={styles.optionRow}>

<View style={styles.optionBox}>
<Text style={{color:"#fff",fontFamily:Fonts.medium}}>
  {purchaseAmount && parseFloat(purchaseAmount) > 0 
    ? `${(parseFloat(purchaseAmount) * (selectedToken.symbol === 'BNB' ? 648 : 1.001) * 1000).toFixed(0)} ABCD`
    : '0 ABCD'
  }
</Text>
</View>

<View style={styles.optionBox}>

<View style={{flexDirection:"row",alignItems:"center"}}>
<View style={styles.chainCircle}/>
<Text style={{color:"#fff",marginLeft:10,fontFamily:Fonts.medium}}>BSC Chain</Text>
</View>

</View>

</View>

</LinearGradient>


{/* PAYMENT SUMMARY */}

<View style={styles.paymentCard}>

<View style={styles.payRow}>

<View>
<Text style={styles.payText}>You will pay approximately</Text>

<Text style={styles.bnbValue}>
{purchaseAmount && parseFloat(purchaseAmount) > 0 
  ? `${purchaseAmount} ${selectedToken.symbol}`
  : `0.000000 ${selectedToken.symbol}`
}
</Text>

<Text style={styles.usdValue}>
{purchaseAmount && parseFloat(purchaseAmount) > 0 
  ? selectedToken.symbol === 'USDT' 
    ? `$${(parseFloat(purchaseAmount) * 1.001).toFixed(2)} USD`
    : selectedToken.symbol === 'BNB'
      ? `$${(parseFloat(purchaseAmount) * 648).toFixed(2)} USD`
      : `$${(parseFloat(purchaseAmount) * 1.001).toFixed(2)} USD`
  : '$0.00 USD'}
</Text>
<Text style={styles.abcdValue}>
{purchaseAmount && parseFloat(purchaseAmount) > 0 
  ? `You will receive ${(parseFloat(purchaseAmount) * (selectedToken.symbol === 'BNB' ? 648 : 1.001) * 1000).toFixed(0)} ABCD`
  : 'You will receive 0 ABCD'
}
</Text>
</View>

<TouchableOpacity 
  style={styles.buyBtn}
  onPress={buyTokens}
  disabled={isPurchasing}
>
<Text style={{color:"#0a8f3c",fontFamily:Fonts.bold}}>{isPurchasing ? 'Processing...' : 'BUY'}</Text>
</TouchableOpacity>

</View>

<View style={styles.divider}/>
<MaterialCommunityIcons name="swap-horizontal" size={20} color="#6A35FF" />
<Text style={styles.conversion}>
Conversion: [ 1 {selectedToken.symbol} = {selectedToken.symbol === 'BNB' ? '648' : '1.001'} USD ]
</Text>

</View>


{/* ICO PROGRESS */}

<LinearGradient
colors={["#4A2AA7","#8A69FF"]}
style={styles.progressCard}
>

<View style={styles.progressHeader}>
<Text style={styles.progressTitle}>ICO PROGRESS</Text>
<Text style={styles.percent}>62% Sold</Text>
</View>

<View style={styles.progressBarBg}>
<View style={styles.progressFill}/>
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

const createStyles = (wp: { (percent: number): number; (arg0: number): any; }, hp: { (percent: number): number; (arg0: number): number; }, font: { (size: number): number; (arg0: number): any; }, radius: { (size: number): number; (arg0: number): any; }, space: { (size: number): number; (arg0: number): any; }) => StyleSheet.create({

container:{
flex:1
},

header:{
padding:space(5),
paddingBottom:hp(14),
// borderBottomLeftRadius:radius(6),
// borderBottomRightRadius:radius(6)
},

headerRow:{
flexDirection:"row",
alignItems:"center",
justifyContent:"space-between"
},

circleBtn:{
width:wp(11),
height:wp(11),
borderRadius:wp(5.5),
backgroundColor:"rgba(255,255,255,0.25)",
justifyContent:"center",
alignItems:"center"
},

title:{
color:"#fff",
fontSize:font(20),
fontFamily:Fonts.bold,
},

walletCard:{
marginTop:hp(3),
padding:space(5),
borderRadius:radius(5),
borderWidth:1,
backgroundColor:"rgba(255,255,255,0.08)",   // glass effect

borderColor:"rgba(255,255,255,0.3)",
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
},

walletLabel:{
color:"#ddd",
fontSize:font(12),
fontFamily:Fonts.regular,
},

walletAddress:{
color:"#fff",
fontSize:font(20),

fontFamily:Fonts.bold,
marginTop:hp(0.6)
},

walletIcons:{
flexDirection:"row"
},

iconBtn:{
width:wp(10),
height:wp(10),
borderRadius:radius(3),
backgroundColor:"rgba(255,255,255,0.2)",
justifyContent:"center",
alignItems:"center",
marginLeft:space(3)
},

sectionTitle:{
color:"#fff",
fontSize:font(20),
fontFamily:Fonts.bold,marginTop:hp(3)
},

amountBox:{
marginTop:hp(2),
padding:space(4.5),
borderRadius:radius(4.5),
borderWidth:1,
backgroundColor:"rgba(255,255,255,0.08)",   // glass effect

borderColor:"rgba(255,255,255,0.3)",
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
},

amountText:{
color:"#fff",
fontSize:font(18),
fontFamily:Fonts.medium,
},

tokenBadge:{
backgroundColor:"#6A35FF",
paddingHorizontal:space(4),
paddingVertical:hp(0.8),
borderRadius:radius(3)
},

optionRow:{
flexDirection:"row",
justifyContent:"space-between",
marginTop:hp(2.5)
},

optionBox:{
width:"48%",
padding:space(4.5),
borderRadius:radius(4.5),
borderWidth:1,
backgroundColor:"rgba(255,255,255,0.08)",   // glass effect

borderColor:"rgba(255,255,255,0.3)",
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
},

chainCircle:{
width:wp(7),
height:wp(7),
borderRadius:wp(3.5),
backgroundColor:"#FFD400"
},

paymentCard:{
marginHorizontal:space(5),
backgroundColor:"#fff",
borderRadius:radius(5),
padding:space(5),
marginTop:-hp(10),
elevation:10
},

payRow:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
},

payText:{
color:"#888",
fontSize:font(14),
fontFamily:Fonts.regular
},

bnbValue:{
fontSize:font(22),
color:"#6A35FF",
fontFamily:Fonts.bold,
marginTop:hp(0.7)
},

usdValue:{
color:"#777",
marginTop:hp(0.5),
fontSize:font(14),
fontFamily:Fonts.regular
},

abcdValue:{
color:"#6A35FF",
marginTop:hp(0.5),
fontSize:font(13),
fontFamily:Fonts.medium
},

buyBtn:{
borderWidth:2,
borderColor:"#18b05b",
paddingHorizontal:space(6),
paddingVertical:hp(1.4),
borderRadius:radius(3)
},

divider:{
height:1,
backgroundColor:"#ddd",
marginVertical:hp(2)
},

conversion:{
color:"#6A35FF",
fontWeight:"600",
fontSize:font(14),
fontFamily:Fonts.medium
},

progressCard:{
margin:space(5),
borderRadius:radius(5),
padding:space(5)
},

progressHeader:{
flexDirection:"row",
justifyContent:"space-between"
},

progressTitle:{
color:"#fff",
fontFamily:Fonts.bold,
fontSize:font(16)
},

percent:{
color:"#ddd",
fontSize:font(14),
fontFamily:Fonts.regular
},

progressBarBg:{
height:hp(1.2),
backgroundColor:"rgba(255,255,255,0.3)",
borderRadius:radius(5),
marginTop:hp(1)
},

progressFill:{
width:"62%",
height:hp(1.2),
backgroundColor:"#D18FFF",
borderRadius:radius(5)
},

progressRow:{
flexDirection:"row",
justifyContent:"space-between",
marginTop:hp(1.2)
},

progressText:{
color:"#ddd",
fontSize:font(13),
fontFamily:Fonts.regular
},

statsRow:{
flexDirection:"row",
justifyContent:"space-around",
marginHorizontal:space(5)
},

statBox:{
backgroundColor:"#FFF",
borderRadius:radius(4.5),
padding:space(4),
alignItems:"center",
width:"32%",
elevation:5,
},

statValue:{
color:"#6A35FF",
fontSize:font(13),
fontFamily:Fonts.bold
},

statLabel:{
color:"#777",
// marginTop:hp(0.5),
fontSize:font(11),
fontFamily:Fonts.regular
},

amountInput:{
backgroundColor:"rgba(255,255,255,0.1)",
borderWidth:1,
borderColor:"rgba(255,255,255,0.3)",
borderRadius:radius(3),
padding:space(3),
fontSize:font(16),
color:"#fff",
flex:1,
marginRight:space(2)
},

modalOverlay:{
flex:1,
backgroundColor:'rgba(0,0,0,0.5)',
justifyContent:'center',
alignItems:'center'
},

modalContent:{
backgroundColor:'#fff',
borderRadius:radius(3),
padding:space(5),
width:'80%',
maxHeight:'80%'
},

modalTitle:{
fontSize:font(20),
fontWeight:'600',
color:'#1f2937',
marginBottom:space(4),
textAlign:'center'
},

tokenOption:{
paddingVertical:space(3),
borderBottomWidth:1,
borderBottomColor:'#f3f4f6'
},

tokenOptionText:{
fontSize:font(16),
color:'#1f2937'
},

closeButton:{
marginTop:space(4),
backgroundColor:'#6b7280',
paddingVertical:space(3),
borderRadius:radius(2),
alignItems:'center'
},

closeButtonText:{
color:'#fff',
fontSize:font(16),
fontWeight:'600'
}

});