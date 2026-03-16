

import React from "react";
import {
View,
Text,
StyleSheet,
TouchableOpacity,
ScrollView
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResponsive } from "../../Utils/Responsive";
import Icon  from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Fonts from "../../Utils/Fonts";

export default function IcoScreen() {
const { wp, hp, font, radius, space } = useResponsive();

const styles = createStyles(wp, hp, font, radius, space);
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
<Text style={styles.walletAddress}>0x123....456</Text>
</View>

<View style={styles.walletIcons}>
  
  
<View style={styles.iconBtn}><Feather name="copy" size={18} color="#fff" /></View>
<View style={styles.iconBtn}><Icon name="share-social-outline" size={18} color="#fff" /></View>
</View>

</View>


{/* BUY TOKEN */}

<Text style={styles.sectionTitle}>BUY ABCD TOKENS</Text>

<View style={styles.amountBox}>

<Text style={styles.amountText}>Amount: 1000</Text>

<View style={styles.tokenBadge}>
<Text style={{color:"#fff",fontFamily:Fonts.medium,}}>ABCD</Text>
</View>

</View>


{/* PAYMENT OPTIONS */}

<View style={styles.optionRow}>

<View style={styles.optionBox}>
<Text style={{color:"#fff",fontFamily:Fonts.medium}}>By Number</Text>
</View>

<View style={styles.optionBox}>

<View style={{flexDirection:"row",alignItems:"center"}}>
<View style={styles.chainCircle}/>
<Text style={{color:"#fff",marginLeft:10,fontFamily:Fonts.medium}}>BNB Chain</Text>
</View>

<Icon name="chevron-down" size={18} color="#fff" />
</View>

</View>

</LinearGradient>


{/* PAYMENT SUMMARY */}

<View style={styles.paymentCard}>

<View style={styles.payRow}>

<View>
<Text style={styles.payText}>You will pay approximately</Text>

<Text style={styles.bnbValue}>
[0.222222] BNB
</Text>

<Text style={styles.usdValue}>($100.00 USD)</Text>
</View>

<TouchableOpacity style={styles.buyBtn}>
<Text style={{color:"#0a8f3c",fontFamily:Fonts.bold}}>BUY</Text>
</TouchableOpacity>

</View>

<View style={styles.divider}/>
<MaterialCommunityIcons name="swap-horizontal" size={20} color="#6A35FF" />
<Text style={styles.conversion}>
Conversion: [ 1 BNB = 4,500 ABCD ]
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
<Text style={styles.statValue}>$0.001</Text>
<Text style={styles.statLabel}>PRICE/TOKEN</Text>
</View>

<View style={styles.statBox}>
<Text style={styles.statValue}>1B</Text>
<Text style={styles.statLabel}>TOTAL SUPPLY</Text>
</View>

<View style={styles.statBox}>
<Text style={styles.statValue}>14d</Text>
<Text style={styles.statLabel}>ENDS IN</Text>
</View>

</View>

</View>

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
fontSize:font(18),
fontFamily:Fonts.bold
},

statLabel:{
color:"#777",
// marginTop:hp(0.5),
fontSize:font(11),
fontFamily:Fonts.regular
}

});