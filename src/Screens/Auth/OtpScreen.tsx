import React, { useState, useRef, useEffect } from "react";
import {
View,
Text,
StyleSheet,
TextInput,
TouchableOpacity,
ImageBackground,
Image
} from "react-native";

import { useResponsive } from "../../Utils/Responsive";
import { GradientButton } from "../../Components/GradientButton";
import { SafeAreaView } from "react-native-safe-area-context";
import Fonts from "../../Utils/Fonts";

export const OTPVerificationScreen = ({navigation,route}:any) => {
const isforgot=route?.params?.isforgot
const { wp, hp, font, radius } = useResponsive();

const [otp, setOtp] = useState(["", "", "", ""]);
const [error, setError] = useState("");
const [timer, setTimer] = useState(90);

const inputs = useRef<TextInput[]>([]);

useEffect(() => {

let interval:any;

if (timer > 0) {
interval = setInterval(() => {
setTimer((prev) => prev - 1);
}, 1000);
}

return () => clearInterval(interval);

}, [timer]);

const formatTime = () => {

const minutes = Math.floor(timer / 60);
const seconds = timer % 60;

return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

};

const handleChange = (text: string, index: number) => {

if (!/^[0-9]?$/.test(text)) return;

let newOtp = [...otp];
newOtp[index] = text;
setOtp(newOtp);
setError("");

if (text && index < 3) {
inputs.current[index + 1]?.focus();
}

};

const handleKeyPress = (e: any, index: number) => {

if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
inputs.current[index - 1]?.focus();
}

};

const verifyOtp = () => {
    if(isforgot){
        navigation.navigate('Reset')
    }else{
navigation.navigate('Home')
    }

// const code = otp.join("");

// if (code.length < 4) {
// setError("Please enter complete OTP");
// return;
// }

// console.log("OTP:", code);

};

return (

<SafeAreaView style={{flex:1}}>

<ImageBackground
source={require('../../../assets/Images/otp_bg.png')}
style={{flex:1}}
resizeMode="cover"
>

<View style={styles.container}>
    <Image
            source={require("../../../assets/Icons/otp.png")}
            style={{
              height: hp(15),
              resizeMode: "contain",
              marginBottom: 20,
              alignSelf:'center',
              //marginTop:20,
            }}
          />

<Text style={[styles.title,{fontSize:font(30)}]}>
OTP Verification
</Text>

<Text style={[styles.subtitle,{fontSize:font(14)}]}>
{isforgot?'Please enter the OTP (One-Time Password)sent to user@abcdefi.io':'Please enter the OTP (One-Time Password) sent to your registered email/phone number to complete our verification.'}
</Text>

<View style={styles.otpRow}>

{otp.map((digit,index)=>(
<TextInput
key={index}
ref={(ref)=> inputs.current[index] = ref!}
style={[
styles.otpBox,
{
width:wp(18),
height:hp(8),
borderRadius:radius(4),
fontSize:font(24)
}
]}
keyboardType="number-pad"
maxLength={1}
value={digit}
onKeyPress={(e)=>handleKeyPress(e,index)}
onChangeText={(text)=>handleChange(text,index)}
/>
))}

</View>

{error ? (
<Text style={styles.error}>{error}</Text>
) : null}

<Text style={styles.resendText}>
Didn't got the code?
<Text style={styles.resendLink}>
{timer > 0 ? ` Resend in ${formatTime()}` : " Resend"}
</Text>
</Text>

<View style={{height:hp(3)}}/>

<GradientButton
title="Verify"
onPress={verifyOtp}
/>

<TouchableOpacity style={[styles.cancelBtn,{height: hp(7),
            width:wp(90)}]}>
<Text style={[styles.cancelText,{fontSize:font(16)}]}>
Cancel
</Text>
</TouchableOpacity>

</View>

</ImageBackground>

</SafeAreaView>

);
};

const styles = StyleSheet.create({

container:{
flex:1,
alignItems:"center",
justifyContent:"center",
padding:25
},

title:{
fontWeight:"700",
marginBottom:15,
fontFamily:Fonts.bold,
},

subtitle:{
color:"#777",
textAlign:"center",
fontFamily:Fonts.regular,
marginBottom:40,
lineHeight:22
},

otpRow:{
flexDirection:"row",
gap:15,
marginBottom:25
},

otpBox:{
backgroundColor:"#FFF",
textAlign:"center",
borderWidth:0
},

error:{
color:"red",
marginBottom:10,
fontFamily:Fonts.regular,
},

resendText:{
color:"#333",
marginBottom:20,
fontFamily:Fonts.medium,
},

resendLink:{
color:"#6C3BFF",
fontWeight:"600"
},

cancelBtn:{
marginTop:15,
width:"100%",
backgroundColor:"#FFF",
padding:16,
borderRadius:12,
alignItems:"center"
},

cancelText:{
color:"#000",
fontWeight:"600",
fontFamily:Fonts.bold,
}

});