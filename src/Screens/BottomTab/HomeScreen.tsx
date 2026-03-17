import React, { useState } from 'react';
import {
View,
Text,
StyleSheet,
Image,
TouchableOpacity,
ScrollView,
Alert
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon  from "react-native-vector-icons/Ionicons";
import { Colors } from "../../Utils/Colors";
import Fonts from "../../Utils/Fonts";
import {
  useAppKit,
  useAccount,
  AppKitButton,
} from '@reown/appkit-react-native';
export default function HomeScreen({navigation}:any) {
  const { open, disconnect } = useAppKit();
  const { address, isConnected, chainId } = useAccount();

  const connectWallet = async () => {
    try {
      open();
    } catch (error) {
      console.log('Connection error:', error);
      Alert.alert('Error', 'Failed to connect wallet');
    }
  };

return (

<SafeAreaView style={{flex:1,backgroundColor:"#fff"}}>

<ScrollView contentContainerStyle={{paddingBottom:80,}} showsVerticalScrollIndicator={false}>

<View style={styles.container}>

{/* TOP GRADIENT AREA */}

<LinearGradient
colors={["#1A0048","#5B2BD6","#9F7BFF"]}
style={styles.topSection}
>

{/* HEADER */}

<View style={styles.header}>

<TouchableOpacity  onPress={()=>navigation.navigate('SettingsScreen')}style={{flexDirection:"row",alignItems:"center"}}>

<Image
source={require("../../../assets/Icons/profile.png")}
style={styles.avatar}
/>

<View style={{marginLeft:10}}>
<Text style={styles.greet}>Good Morning!</Text>
<Text style={styles.name}>Stephan Joseph</Text>
</View>

</TouchableOpacity>

<View style={styles.bell}>
  <Icon name="notifications-outline" size={24} color={'#FFF'}/>
{/* <Text>🔔</Text> */}
</View>

</View>


{/* TIMER BOX */}

<View style={styles.timerBox}>

<View style={styles.timerTitleRow}>
<View style={styles.line}/>
<Text style={styles.icoTitle}>ICO Starts In</Text>
<View style={styles.line}/>
</View>

<View style={styles.timerRow}>

{["2","23","40","6"].map((item,i)=>(

<View key={i} style={styles.timerItem}>

<View style={styles.timerCircle}>
<Text style={styles.timerNumber}>{item}</Text>
</View>

<Text style={styles.timerLabel}>
{["Days","Hours","Minutes","Seconds"][i]}
</Text>

</View>

))}

</View>

</View>


{/* CONNECT WALLET */}

<TouchableOpacity style={styles.walletBtn} onPress={connectWallet}>
<Text style={styles.walletText}>{isConnected ? 'Wallet Connected' : 'Connect Wallet'}</Text>
</TouchableOpacity>

<Text style={styles.joinText}>
Join ICO Before Timer Ends
</Text>

</LinearGradient>
{/* JOIN ICO BUTTON */}

<View style={styles.joinWrapper}>
  <TouchableOpacity activeOpacity={0.8}>
    <LinearGradient
      colors={["#7B3EF0","#3F0D97"]}
      start={{x:0,y:0}}
      end={{x:1,y:0}}
      style={styles.joinGradient}
    >
      <Text style={styles.joinBtnText}>Join ICO  »</Text>
    </LinearGradient>
  </TouchableOpacity>
</View>


{/* TOKEN CARD */}

<View style={styles.tokenCard}>

  <Text style={styles.limit}>Limited allocation remaining</Text>

  <View style={styles.tokenHeader}>

    <View>
      <Text style={styles.tokenTitle}>Token allocation</Text>
      <Text style={styles.tokenAmount}>1 Quadrillion</Text>
    </View>

    <TouchableOpacity style={styles.downloadIcon}>
      <Icon name="download-outline" size={24} color={Colors.primary}/>

      {/* <Text style={{fontSize:18,color:"#6A35FF"}}>⬇</Text> */}
    </TouchableOpacity>

  </View>

  <TouchableOpacity style={styles.whitePaper}>
    <Text style={{color:"#fff",fontSize:16,fontFamily:Fonts.medium,}}>
      Download White Paper
    </Text>
  </TouchableOpacity>

</View>

{/* JOIN ICO BUTTON */}

{/* <View style={styles.joinWrapper}>

<LinearGradient
colors={["#7B3EF0","#3F0D97"]}
start={{x:0,y:0}}
end={{x:1,y:0}}
style={styles.joinGradient}
>

<Text style={styles.joinBtnText}>Join ICO  »</Text>

</LinearGradient>

</View>


{/* TOKEN CARD 

<View style={styles.tokenCard}>

<Text style={styles.limit}>Limited allocation remaining</Text>

<Text style={styles.tokenTitle}>Token allocation</Text>
<Text style={styles.tokenAmount}>1 Quadrillion</Text>

<TouchableOpacity style={styles.whitePaper}>
<Text style={{color:"#fff"}}>Download White Paper</Text>
</TouchableOpacity>

</View> */}


{/* REWARD CARD */}

<Image
source={require("../../../assets/Images/trophy.png")}
style={styles.trophy}
/>
<View style={styles.rewardCard}>



{/* REWARD BAR */}

<LinearGradient
colors={["#A66CFF","#6A35FF"]}
start={{x:0,y:0}}
end={{x:1,y:0}}
style={styles.rewardBar}
>

<Text style={styles.rewardText}>Reward Points</Text>

<View style={styles.rewardRight}>
<Text style={styles.coin}>🪙</Text>
<Text style={styles.points}>300</Text>
</View>

</LinearGradient>


<Text style={styles.question}>
Do you want full control over your finances?
</Text>

<View style={styles.answerRow}>

<LinearGradient
colors={["#A88FE8","#8A7BBF"]}
style={styles.answerBtn}
>
<Text style={styles.answerText}>No</Text>
</LinearGradient>

<LinearGradient
colors={["#C69AF7","#B77CE8"]}
style={styles.answerBtn}
>
<Text style={styles.answerText}>Yes</Text>
</LinearGradient>

</View>

</View>




{/* </View> */}

</View>

</ScrollView>

</SafeAreaView>
);
}


const styles = StyleSheet.create({

container:{
flex:1
},
tokenHeader:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
marginTop:10
},

topSection:{
padding:20,
paddingBottom:90,
// borderBottomLeftRadius:30,
// borderBottomRightRadius:30
},

header:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
},

avatar:{
width:48,
height:48,
borderRadius:21
},

greet:{
color:"#ccc",
fontSize:14,
fontFamily:Fonts.regular
},

name:{
color:"#fff",
fontSize:20,
fontFamily:Fonts.bold,
fontWeight:"700"
},

bell:{
width:40,
height:40,
borderRadius:20,
backgroundColor:"rgba(255,255,255,0.25)",
justifyContent:"center",
alignItems:"center"
},


/* TIMER BOX */

timerBox:{
marginTop:25,
borderWidth:1,
borderColor:"rgba(255,255,255,0.4)",
borderRadius:22,
padding:20
},

timerTitleRow:{
flexDirection:"row",
alignItems:"center",
marginBottom:20
},

line:{
flex:1,
height:1,
backgroundColor:"rgba(255,255,255,0.4)"
},

icoTitle:{
color:"#fff",
marginHorizontal:10,
fontSize:16,
fontFamily:Fonts.medium,
fontWeight:"600"
},

timerRow:{
flexDirection:"row",
justifyContent:"space-between"
},

timerItem:{
alignItems:"center"
},

timerCircle:{
width:70,
height:70,
borderRadius:35,
backgroundColor:"rgba(255,255,255,0.2)",
justifyContent:"center",
alignItems:"center"
},

timerNumber:{
color:"#fff",
fontSize:22,
fontFamily:Fonts.bold,
fontWeight:"700"
},

timerLabel:{
color:"#eee",
marginTop:6,
fontFamily:Fonts.medium,  
},


walletBtn:{
backgroundColor:"rgba(255,255,255,0.25)",
marginTop:25,
padding:14,
borderRadius:15,
alignItems:"center"
},

walletText:{
color:"#fff",
fontSize:17,
fontFamily:Fonts.semiBold,
},

joinText:{
textAlign:"center",
color:"#fff",
marginTop:20,
fontFamily:Fonts.regular,
},




noBtn:{
backgroundColor:"#E5E5E5",
paddingHorizontal:35,
paddingVertical:10,
borderRadius:20
},

yesBtn:{
backgroundColor:"#C084FC",
paddingHorizontal:35,
paddingVertical:10,
borderRadius:20
},

rewardCard:{
margin:20,
backgroundColor:"#fff",
borderRadius:25,
top:-42,
paddingBottom:20,
overflow:"hidden",
elevation:6,
alignSelf:'center',
width:"85%",
},

trophy:{
width:"90%",
alignSelf:'center',
height:260,
marginTop:20,
borderRadius:12,
},

rewardBar:{
position:"absolute",
//top:-5,
alignSelf:"center",
width:"95%",
borderRadius:40,
paddingVertical:13,
paddingHorizontal:20,
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
elevation:6
},

rewardText:{
color:"#fff",
fontSize:16,
fontFamily:Fonts.semiBold,
fontWeight:"600"
},

rewardRight:{
flexDirection:"row",
alignItems:"center"
},

coin:{
marginRight:6
},

points:{
color:"#fff",
fontWeight:"700"
},

question:{
textAlign:"center",
marginTop:60,
fontSize:18,
fontFamily:Fonts.medium,
fontWeight:"500",
paddingHorizontal:30
},

answerRow:{
flexDirection:"row",
justifyContent:"space-evenly",
marginTop:25
},

answerBtn:{
paddingHorizontal:35,
paddingVertical:5,
borderRadius:12
},

answerText:{
color:"#fff",
fontSize:16,

fontFamily:Fonts.semiBold,
},
joinWrapper:{
  alignItems:"center",
  marginTop:-40,
  zIndex:10
},

joinGradient:{
  paddingHorizontal:110,
  paddingVertical:14,
  borderRadius:40,
  shadowColor:"#3F0D97",
  shadowOpacity:0.5,
  shadowRadius:12,
  shadowOffset:{width:0,height:8},
  elevation:10,
  top:-40,
},

joinBtnText:{
  color:"#fff",
  fontSize:18,
  fontWeight:"600"
},


// tokenCard:{
//   marginHorizontal:20,
//   padding:22,
//   backgroundColor:"#fff",
//   borderRadius:22,
//   elevation:8,
//   marginTop:-20
// },

tokenCard:{
marginHorizontal:20,
padding:22,
backgroundColor:"#fff",
borderBottomLeftRadius:15,borderBottomRightRadius:15,
elevation:8,
marginTop:-60
},



downloadIcon:{
width:39,
height:39,
borderRadius:20,
backgroundColor:"#F1F1F1",
justifyContent:"center",
alignItems:"center"
},

limit:{
color:"red",
textAlign:"center",
fontSize:13,
fontFamily:Fonts.regular,
marginTop:10,
},

tokenTitle:{
fontSize:20,
fontFamily:Fonts.bold,
fontWeight:"600"
},

tokenAmount:{
color:"#888",
marginTop:2,
fontFamily:Fonts.regular,
},

whitePaper:{
backgroundColor:"#6A35FF",
padding:14,
borderRadius:15,
alignItems:"center",
marginTop:20
}
});