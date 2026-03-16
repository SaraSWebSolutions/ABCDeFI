import React,{useState} from "react";
import {
View,
Text,
StyleSheet,
Image,
ImageBackground,
} from "react-native";

import { useResponsive } from "../../Utils/Responsive";
import { InputField } from "../../Components/InputField";
import { GradientButton } from "../../Components/GradientButton";
import { SafeAreaView } from "react-native-safe-area-context";
import Fonts from "../../Utils/Fonts";
import { Colors } from "../../Utils/Colors";

export const ResetPasswordScreen = ({navigation}:any)=>{

const { hp,wp,font } = useResponsive();

const [password,setPassword] = useState("");
const [confirm,setConfirm] = useState("");
const [error,setError] = useState("");

const validatePassword = (pass:string)=>{

if(pass.length < 8) return "Minimum 8 characters required";
if(!/[A-Z]/.test(pass)) return "Add at least one uppercase letter";
if(!/[0-9]/.test(pass)) return "Add at least one number";

return "";

};

const updatePassword = ()=>{

const passError = validatePassword(password);

if(passError){
setError(passError);
return;
}

if(password !== confirm){
setError("Passwords do not match");
return;
}

setError("");

console.log("Password Updated");

};

return(
<SafeAreaView style={{flex:1}}>

<ImageBackground
source={require('../../../assets/Images/otp_bg.png')}
style={{flex:1}}
resizeMode="cover"
>

<View style={styles.container}>

<Image
source={require("../../../assets/Icons/reset.png")}
style={{
height: hp(18),
resizeMode: "contain",
marginTop:20,
alignSelf:'center',
}}
/>

<Text style={[styles.title,{fontSize:font(28)}]}>
Reset Password
</Text>

<Text style={styles.subtitle}>
Create a strong new password for your ABCDeFi account.
</Text>

<InputField
value={password}
placeholder="New Password"
secure
leftIcon="lock"
onChange={setPassword}
/>
<View style={{marginTop:15}}></View>
<InputField
value={confirm}
placeholder="Confirm Password"
secure
leftIcon="lock"
onChange={setConfirm}
/>

{error ? <Text style={styles.error}>{error}</Text>:null}

<View style={[styles.requirements,{width: wp(90),}]}>

<Text style={styles.reqTitle}>
Password Requirements
</Text>

<Text style={styles.reqItem}>• At least 8 characters</Text>
<Text style={styles.reqItem}>• One uppercase letter</Text>
<Text style={styles.reqItem}>• One number or Symbol</Text>
<Text style={styles.reqItem}>• Must not match old password</Text>


</View>

<GradientButton
title="Update Password ✓"
onPress={updatePassword}
/>

<Text
style={styles.back}
onPress={()=>navigation.navigate("Login")}
>
← Back to Sign In
</Text>

</View>

</ImageBackground>
</SafeAreaView>
);
};

const styles = StyleSheet.create({

container:{
flex:1,
padding:25,
justifyContent:"center"
},

title:{
textAlign:"center",
fontFamily:Fonts.bold,
marginBottom:8
},

subtitle:{
textAlign:"center",
color:"#777",
marginBottom:20,
fontSize:14,
fontFamily:Fonts.regular
},

requirements:{
backgroundColor:"#FFF",
padding:16,
borderRadius:12,
marginBottom:20,
marginTop:20,
},

reqTitle:{
fontSize:14,
fontFamily:Fonts.semiBold,
marginBottom:6,
color:Colors.primary
},

reqItem:{
fontSize:13,
fontFamily:Fonts.regular,
color:"#555",
marginTop:2
},

error:{
color:"red",
marginBottom:10,
fontSize:12,
fontFamily:Fonts.medium
},

back:{
marginTop:15,
color:Colors.primary,
textAlign:"center",
fontFamily:Fonts.semiBold,
fontSize:14
}

});