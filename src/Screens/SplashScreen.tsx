import React, { useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  ImageBackground,
} from "react-native";

import { useResponsive } from "../Utils/Responsive";
import { SafeAreaView } from "react-native-safe-area-context";
import Fonts from "../Utils/Fonts";
import { Colors } from "../Utils/Colors";

export const SplashScreen = ({ navigation }: any) => {

  const { hp, font } = useResponsive();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Login");
    }, 3000);
  }, []);

  return (
<SafeAreaView style={{flex:1}}>
<ImageBackground
      source={require("../../assets/Images/splash_bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.container}>

        <Image
          source={require("../../assets/Images/splash_logo.png")}
          style={{
            marginTop:hp(23),
            height: hp(22),
            resizeMode: "contain",
            alignSelf:'center'
          }}
        />

        <Text style={styles.icoText}>
          ICO Starts on <Text style={styles.highlight}>1st JULY</Text>
        </Text>
  <View style={styles.bottomSection}>

        <Text style={[styles.title, { fontSize: font(32) }]}>
          Abcdefi
        </Text>

        <Text style={styles.subtitle}>
          Absolute Blend of Centralized and Decentralized
          Finance Finance Redefined..
        </Text>
</View>
      </View>
    </ImageBackground>
</SafeAreaView>
    
  );
};

const styles = StyleSheet.create({

  bg: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  icoText: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.textPrimary,
     fontFamily:Fonts.medium

  },

  highlight: {
    color: Colors.primary,
    fontWeight: "600",
    fontFamily:Fonts.semiBold
  },

  title: {
    marginTop:79,
    fontWeight: "800",
    fontFamily:Fonts.bold,
    color: Colors.primarydark1,
  },

  subtitle: {
    marginTop: 10,
    fontFamily:Fonts.regular,
    textAlign: "center",
    color: Colors.primary_light,
    fontSize: 15,
    lineHeight:28
  },
bottomSection: {
  marginTop: "auto",   // pushes content to bottom
  alignItems: "center",
  paddingBottom: 30,
},
});