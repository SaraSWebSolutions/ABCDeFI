import React,{useState,useEffect} from "react";
import {
View,
Text,
StyleSheet,
Image,
TextInput,
TouchableOpacity,
ScrollView,
Alert
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useResponsive } from "../Utils/Responsive";
import Fonts from "../Utils/Fonts";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile ,updateProfile} from "../Store/Slices/profileSlice";
import { RootState } from "../Store/Store";
import { logoutUser } from "../Store/Slices/authSlice";
export default function SettingsScreen({navigation}:any) {

const { wp, hp, font, radius, space } = useResponsive();
 const dispatch = useDispatch<any>();

const { profileData, loading } = useSelector(
  (state: RootState) => state.profile
);
const styles = createStyles(wp,hp,font,radius,space);
const [name,setName] = useState("Stephan Joseph");
const [email,setEmail] = useState("*******@gmail.com");
const [phone,setPhone] = useState("*****2565789");
const [address,setAddress] = useState("*************");
const [city,setCity] = useState("Hydrabad");
const [country,setCountry] = useState("India");
useEffect(() => {
  dispatch(fetchProfile());
}, []);
useEffect(() => {
  if (profileData) {
    const user = profileData;

    setName(user.name || "");
    setEmail(user.email || "");
    setPhone(String(user.mobileNumber || ""));
    setCountry(user.country || "");
  }
}, [profileData]);
const handleLogout = () => {
  Alert.alert(
    "Logout",
    "Are you sure you want to logout?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await dispatch(logoutUser()).unwrap();

            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });

          } catch (err) {
            console.log("Logout error:", err);
          }
        },
      },
    ]
  );
};
return (

<SafeAreaView style={{flex:1,backgroundColor:"#fff"}}>

<ScrollView showsVerticalScrollIndicator={false}>

<View style={styles.container}>

{/* HEADER */}

<View style={styles.header}>

<TouchableOpacity  onPress={()=>navigation.goBack()}
style={styles.iconBtn}>
<Ionicons name="chevron-back" size={font(22)} color="#4A2AA7" />
</TouchableOpacity>

<Text style={styles.title}>Settings</Text>

<TouchableOpacity style={styles.iconBtn}>
<Ionicons name="notifications-outline" size={font(20)} color="#4A2AA7" />
</TouchableOpacity>

</View>


{/* PROFILE */}

<View style={styles.profileContainer}>

<View style={styles.profileWrapper}>

<Image
source={require("../../assets/Icons/profile.png")}
style={styles.profile}
/>

<View style={styles.editIcon}>
<MaterialCommunityIcons name="image-edit" color="#fff" size={font(16)} />
</View>

</View>

</View>


{/* INPUTS */}

<View style={styles.form}>

<Field
label="Full Name"
value={name}
onChangeText={setName}
/>

<Field
label="Email Address"
value={email}
onChangeText={setEmail}
/>

<Field
label="Phone Number"
value={phone}
onChangeText={setPhone}
/>

{/* <Field
label="Address"
value={address}
onChangeText={setAddress}
/> */}

<Field
label="City/Area"
value={city}
onChangeText={setCity}
/>

<Field
label="Country"
value={country}
onChangeText={setCountry}
/>

</View>


{/* MENU */}

<View style={styles.menu}>

<MenuItem icon="bank" text="Account Settings" />
<MenuItem icon="headset" text="Support & FAQ" />
<MenuItem icon="shield-outline" text="Security Settings" />
{/* <MenuItem  icon="logout" text="Log Out" onPress={handleLogout}/> */}


</View>


{/* SIGN OUT */}

<TouchableOpacity onPress={()=>handleLogout()} activeOpacity={0.9}>

<LinearGradient
colors={["#7B3EF0","#3F0D97"]}
style={styles.signOut}
>

<Text style={styles.signText}>Sign Out</Text>

</LinearGradient>

</TouchableOpacity>

</View>

</ScrollView>

</SafeAreaView>
);
}

const Field = ({label,value,onChangeText}:any) => {

const { wp, hp, font, radius, space } = useResponsive();

return (

<View style={{marginBottom:hp(2)}}>

<Text style={{fontSize:font(16),fontWeight:"600",fontFamily:Fonts.semiBold}}>
{label}
</Text>

<View
style={{
backgroundColor:"#FFF",
borderRadius:radius(2),
paddingVertical:hp(0.5),
paddingHorizontal:space(4),
marginTop:hp(1),
elevation:5
}}
>

<TextInput
value={value}
onChangeText={onChangeText}
placeholder={label}
placeholderTextColor="#999"
style={{
fontSize:font(16),
color:"#333"
}}
/>

</View>

</View>

);
};

const MenuItem = ({icon,text}:any) => {

const { wp, hp, font, radius, space } = useResponsive();

return (

<TouchableOpacity

style={{
flexDirection:"row",
alignItems:"center",
justifyContent:"space-between",
marginBottom:hp(2)
}}
>

<View style={{flexDirection:"row",alignItems:"center"}}>

<MaterialCommunityIcons
name={icon}
size={font(22)}
color="#000"
/>

<Text
style={{
marginLeft:space(3),
fontSize:font(16),
fontFamily:Fonts.semiBold
}}
>
{text}
</Text>

</View>

<Ionicons name="chevron-forward" size={font(20)} color="#000" />

</TouchableOpacity>

);
};

const createStyles = (wp: (arg0: number) => any,hp: (arg0: number) => any,font: (arg0: number) => any,radius: (arg0: number) => any,space: (arg0: number) => any) =>
StyleSheet.create({

container:{
padding:space(5)

},

header:{
flexDirection:"row",
alignItems:"center",
justifyContent:"space-between",
marginBottom:hp(3),

},

title:{
fontSize:font(22),
fontWeight:"700",
color:"#4A2AA7"
},

iconBtn:{
width:wp(10),
height:wp(10),
borderRadius:wp(5),
justifyContent:"center",
alignItems:"center",

},

profileContainer:{
alignItems:"center",
marginBottom:hp(3)
},

profileWrapper:{
position:"relative"
},

profile:{
width:wp(30),
height:wp(30),
borderRadius:wp(17.5),
borderWidth:3,
borderColor:"#7B3EF0"
},

editIcon:{
position:"absolute",
bottom:0,
right:0,
backgroundColor:"#7B3EF0",
width:wp(9),
height:wp(9),
borderRadius:wp(4.5),
justifyContent:"center",
alignItems:"center"
},

form:{
marginTop:hp(1)
},

menu:{
marginTop:hp(2)
},

signOut:{
marginTop:hp(3),
paddingVertical:hp(2),
borderRadius:radius(2),
alignItems:"center"
},

signText:{
color:"#fff",
fontSize:font(18),
fontWeight:"600"
}

});