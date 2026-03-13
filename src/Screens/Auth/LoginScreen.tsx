import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView
} from "react-native";

import { useResponsive } from "../../Utils/Responsive";
import { InputField } from "../../Components/InputField";
import { GradientButton } from "../../Components/GradientButton";
import Icon from "react-native-vector-icons/Ionicons";

import {
  validateEmailOrPhone,
  validatePassword,
} from "../../Utils/Validators";

import { handleError } from "../../Utils/ErrorHandler";
import { Colors } from "../../Utils/Colors";
import Fonts from "../../Utils/Fonts";
import { SafeAreaView } from "react-native-safe-area-context";

export const LoginScreen = ({ navigation }: any) => {

  const { font, hp } = useResponsive();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const onLogin = async () => {

    const emailError = validateEmailOrPhone(email);
    if (emailError) return Alert.alert(emailError);

    const passError = validatePassword(password);
    if (passError) return Alert.alert(passError);

    try {
      Alert.alert("Login Success");
    } catch (error) {
      const message = handleError(error);
      Alert.alert(message);
    }
  };

  return (
    <SafeAreaView style={{flex:1}}>

    

    <ScrollView contentContainerStyle={styles.container}>

      {/* Logo */}
      <Image
        source={require("../../../assets/Images/login_logo.png")}
        style={{
          height: hp(20),
          resizeMode: "contain",
          marginBottom: 20,
          marginTop:20,
        }}
      />

      {/* Title */}
      <Text style={[styles.title, { fontSize: font(28) }]}>
        Welcome Back!
      </Text>

      <Text style={styles.subtitle}>
        Login securely to continue...
      </Text>

      {/* Inputs */}

      <InputField
      
        value={email}
        placeholder="Phone number or email"
        onChange={setEmail}
      />

      <InputField
        value={password}
        placeholder="Password"
        secure={true}
        onChange={setPassword}
      />

      {/* Remember + Forgot */}

      <View style={styles.row}>

        <TouchableOpacity
          style={styles.rememberRow}
          onPress={() => setRemember(!remember)}
        >

         <Icon
            name={remember ? "checkbox" : "square-outline"}
            size={20}
            color={Colors.primary}
          />

          <Text style={styles.rememberText}>
            Remember me
          </Text>

        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgot}>
            Forgot Password ?
          </Text>
        </TouchableOpacity>

      </View>

      {/* Button */}

      <GradientButton
        title="Sign Up"
        onPress={onLogin}
      />

      {/* Divider */}

     <View style={styles.dividerRow}>
  <View style={styles.line} />
  <Text style={styles.or}>Or login with</Text>
  <View style={styles.line} />
</View>

      {/* Social Login */}

     <View style={styles.socialRow}>
  <TouchableOpacity style={styles.socialBtn}>
    <Image
      source={require("../../../assets/Icons/google.png")}
      style={styles.social}
    />
  </TouchableOpacity>

  <TouchableOpacity style={styles.socialBtn}>
    <Image
      source={require("../../../assets/Icons/fb.png")}
      style={styles.social}
    />
  </TouchableOpacity>

  <TouchableOpacity style={styles.socialBtn}>
    <Image
      source={require("../../../assets/Icons/apple.png")}
      style={styles.social}
    />
  </TouchableOpacity>
</View>

      {/* Whitepaper Card */}

      <TouchableOpacity style={styles.card}>

  <View style={styles.cardLeft}>

    <View style={styles.iconBox}>
      <Image
        source={require("../../../assets/Icons/file.png")}
        style={styles.fileIcon}
      />
    </View>

    <View>
      <Text style={styles.cardTitle}>
        To know more about
        <Text style={{ color: "#6C3BFF" }}> ABCDeFI</Text>
      </Text>

      <Text style={styles.cardSub}>
        Click here → Download Whitepaper (PDF)
      </Text>
    </View>

  </View>

  <View style={styles.arrowCircle}>
    <Icon name="arrow-forward" size={18} color="#6C3BFF" />
  </View>

</TouchableOpacity>

      {/* Signup */}

      <Text style={styles.bottom}>
        Don’t have an account?
        <Text  onPress={()=> navigation.navigate('SignUp')}style={{ color: "#6C3BFF", fontSize:14,
    fontFamily:Fonts.semiBold, }}> Sign up</Text>
      </Text>

    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#F5F5F7"
  },

  title: {
    fontWeight: "700",
    marginBottom: 5,
    fontFamily:Fonts.bold
  },

  subtitle: {
    color: "#777",
    marginBottom: 20,
    fontFamily:Fonts.regular
  },

  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    width: 18,
    height: 18,
    marginRight: 8,
  },

  rememberText: {
    color: "#6C3BFF",
    marginLeft:8,
    fontSize:14,
    fontFamily:Fonts.medium,
  },

  forgot: {
    color: "red",
     fontSize:14,
    fontFamily:Fonts.medium,
  },

  // or: {
  //   marginTop: 25,
  //   marginBottom: 15,
  //   color: "#666",
  // },

  // socialRow: {
  //   flexDirection: "row",
  //   gap: 20,
  // },

  // socialBtn: {
  //   width: 50,
  //   height: 50,
  //   borderRadius: 12,
  //   backgroundColor: "#fff",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   elevation: 2,
  // },

  social: {
    width: 48,
  height: 48,
    resizeMode: "contain",
  },



  arrow: {
    width: 25,
    height: 25,
    tintColor: "#6C3BFF",
    marginRight:4
  },

  bottom: {
    marginTop: 25,
    color: "#555",
     fontSize:14,
    fontFamily:Fonts.regular,
  },
  dividerRow: {
  flexDirection: "row",
  alignItems: "center",
  width: "100%",
  marginTop: 25,
  marginBottom: 15,
},

line: {
  flex: 1,
  height: 1,
  backgroundColor: "#DADADA",
},

or: {
  marginHorizontal: 10,
  color: "#666",
  fontSize: 13,
    fontFamily:Fonts.regular,
},

socialRow: {
  flexDirection: "row",
  justifyContent: "center",
  gap: 18,
  marginBottom: 25,
},

socialBtn: {
  // width: 48,
  // height: 48,
  borderRadius: 12,
  //backgroundColor: "#fff",
  justifyContent: "center",
  alignItems: "center",
  elevation: 2,
},

card: {
  width: "100%",
  paddingVertical: 16,
  paddingHorizontal:8,
  borderRadius: 14,
  backgroundColor: "#fff",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  borderLeftWidth: 5,
  borderLeftColor: "#6C3BFF",
  elevation: 3,
},

cardLeft: {
  flexDirection: "row",
  alignItems: "center",
},

iconBox: {
  width: 42,
  height: 42,
  borderRadius: 12,
  backgroundColor: "#6C3BFF",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 10,
},

fileIcon: {
  width: 20,
  height: 20,
  tintColor: "#fff",
},

cardTitle: {
  fontWeight: "700",
   fontSize:14,
    fontFamily:Fonts.semiBold,
},

cardSub: {
  marginTop: 4,
  color: "#777",
  fontSize: 12,
    fontFamily:Fonts.regular,
},

arrowCircle: {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: "#F3EDFF",
  justifyContent: "center",
  alignItems: "center",
},

});