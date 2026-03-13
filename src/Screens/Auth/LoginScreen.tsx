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

export const LoginScreen = () => {

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

    <ScrollView contentContainerStyle={styles.container}>

      {/* Logo */}
      <Image
        source={require("../../../assets/Images/login_logo.png")}
        style={{
          height: hp(18),
          resizeMode: "contain",
          marginBottom: 20,
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

      <Text style={styles.or}>
        Or login with
      </Text>

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
              source={require("../../../assets/Icons/file_download.png")}
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

        <Image
          source={require("../../../assets/Icons/next.png")}
          style={styles.arrow}
        />

      </TouchableOpacity>

      {/* Signup */}

      <Text style={styles.bottom}>
        Don’t have an account?
        <Text style={{ color: "#6C3BFF" }}> Sign up</Text>
      </Text>

    </ScrollView>
  );
};

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    padding: 25,
    alignItems: "center",
    backgroundColor: "#F5F5F7"
  },

  title: {
    fontWeight: "700",
    marginBottom: 5,
  },

  subtitle: {
    color: "#777",
    marginBottom: 20,
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
  },

  forgot: {
    color: "red",
  },

  or: {
    marginTop: 25,
    marginBottom: 15,
    color: "#666",
  },

  socialRow: {
    flexDirection: "row",
    gap: 20,
  },

  socialBtn: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  social: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },

  card: {
    marginTop: 30,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#fff",
    width: "100%",
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#6C3BFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
    marginLeft:-8,
  },

  fileIcon: {
    width: 20,
    height: 20,
    tintColor: "#fff",
  },

  cardTitle: {
    fontWeight: "600",
  },

  cardSub: {
    marginTop: 4,
    color: "#777",
    fontSize: 13,
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
  }

});