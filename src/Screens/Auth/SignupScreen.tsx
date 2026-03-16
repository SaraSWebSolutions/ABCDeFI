import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Image
} from "react-native";

import { useResponsive } from "../../Utils/Responsive";
import { InputField } from "../../Components/InputField";
import { GradientButton } from "../../Components/GradientButton";

import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import Fonts from "../../Utils/Fonts";
import { Colors } from "../../Utils/Colors";

import {
  validateUsername,
  validateMobile,
  validateEmailOrPhone,
  validatePassword,
  validateConfirmPassword,
  validateDropdown,
  validateTerms,
} from "../../Utils/Validators";


export const SignupScreen = ({navigation}:any) => {

  const { font } = useResponsive();

  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");

  const [showGender, setShowGender] = useState(false);
  const [showCountry, setShowCountry] = useState(false);

  const [agree, setAgree] = useState(false);

  const genders = ["Male", "Female", "Other"];
  const countries = ["India", "USA", "UK", "Canada"];
const [errors, setErrors] = useState({
  username: "",
  mobile: "",
  email: "",
  password: "",
  confirmPassword: "",
  gender: "",
  country: "",
  terms: "",
  dropdown:''
});
 const onRegister = () => {

  const newErrors = {
    username: validateUsername(username),
    mobile: validateMobile(mobile),
    email: validateEmailOrPhone(email),
    password: validatePassword(password),
    confirmPassword: validateConfirmPassword(password, confirmPassword),
    gender: validateDropdown(gender, "Gender"),
    country: validateDropdown(country, "Country"),
    terms: validateTerms(agree),
  };

  setErrors(newErrors);

  const hasError = Object.values(newErrors).some(e => e !== "");

  if (hasError) return;

  console.log("Register Success");

};

//   const onRegister = () => {

//     if (!validate()) return;

//     console.log({
//       username,
//       mobile,
//       email,
//       password,
//       gender,
//       country
//     });

//     Alert.alert("Success", "Registration successful");
//   };

  return (

    <SafeAreaView style={{ flex: 1 }}>

      <ImageBackground
        source={require("../../../assets/Images/Signup_bg.png")}
        style={{ flex: 1 }}
      >

        <ScrollView contentContainerStyle={styles.container}>

          <Text style={[styles.title, { fontSize: font(30),textAlign:'center' }]}>
            Welcome!
          </Text>

          <Text style={styles.subtitle}>
            Login securely to continue...
          </Text>

          <InputField
            value={username}
            leftIcon="user"
            placeholder="User Name"
            onChange={setUsername}
          />
{errors.username ? (
  <Text style={styles.errorText}>{errors.username}</Text>
) : null}
          <InputField
            value={mobile}
            leftIcon="phone-call"
            placeholder="Mobile Number"
            onChange={setMobile}
          />
{errors.mobile ? (
  <Text style={styles.errorText}>{errors.mobile}</Text>
) : null}
          <InputField
            value={email}
            leftIcon="mail"
            placeholder="Email Address"
            onChange={setEmail}
          />
{errors.email ? (
  <Text style={styles.errorText}>{errors.email}</Text>
) : null}
          <InputField
            value={password}
            leftIcon="lock"
            placeholder="Create a strong password"
            secure
            onChange={setPassword}
          />
{errors.password ? (
  <Text style={styles.errorText}>{errors.password}</Text>
) : null}
          <InputField
            value={confirmPassword}
            leftIcon="lock"
            placeholder="Re-enter your password"
            secure
            onChange={setConfirmPassword}
          />
{errors.confirmPassword ? (
  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
) : null}
          {/* DROPDOWNS */}

          <View style={styles.dropdownRow}>

            {/* Gender Dropdown */}
            <View style={{ width: "48%" }}>

              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowGender(!showGender)}
              >

                <Text style={{fontSize:14,fontFamily:Fonts.medium}}>
                  {gender || "Select Gender"}
                </Text>

                <Icon name="caret-down-outline" color={Colors.primary} size={18} />

              </TouchableOpacity>

              {showGender &&
                genders.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setGender(item);
                      setShowGender(false);
                    }}
                  >
                    <Text  style={{fontSize:14,fontFamily:Fonts.medium}}>{item}</Text>
                  </TouchableOpacity>
                ))
              }
{errors.gender ? (
  <Text style={styles.errorText}>{errors.gender}</Text>
) : null}
            </View>

            {/* Country Dropdown */}
            <View style={{ width: "48%" }}>

              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowCountry(!showCountry)}
              >

                <Text  style={{fontSize:14,fontFamily:Fonts.medium}}>
                  {country || "Country"}
                </Text>

                <Icon name="caret-down-outline" color={Colors.primary} size={18} />

              </TouchableOpacity>

              {showCountry &&
                countries.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setCountry(item);
                      setShowCountry(false);
                    }}
                  >
                    <Text  style={{fontSize:14,fontFamily:Fonts.medium}}>{item}</Text>
                  </TouchableOpacity>
                ))
              }
{errors.country ? (
  <Text style={styles.errorText}>{errors.country}</Text>
) : null}
            </View>

          </View>


          {/* Privacy Card */}

          <View style={styles.policyCard}>

            <View style={{ flexDirection: "row", alignItems: "center" }}>

              <View style={styles.lockIcon}>
                 <Image
                        source={require("../../../assets/Icons/privacy.png")}
                        style={styles.fileIcon}
                      />
              </View>

              <View>
                <Text style={styles.policyTitle}>
                  Privacy & Data Consent
                </Text>

                <Text style={styles.policySub}>
                  Tap to read before continuing
                </Text>
              </View>

            </View>

            <Icon name="caret-forward-outline" color={Colors.primary} size={20} />

          </View>

          {/* Terms */}

         <View style={styles.termsCard}>

  <TouchableOpacity
    style={styles.agreeRow}
    onPress={() => setAgree(!agree)}
  >

    <Icon
      name={agree ? "checkbox" : "square-outline"}
      size={22}
      color={agree ? "#6C3BFF" : "#999"}
    />

    <Text style={styles.agreeText}>
      I've read and agree to the{" "}
      <Text style={styles.link}>Terms of Service</Text> and{" "}
      <Text style={styles.link}>Privacy Policy</Text>.
      I consent to the collection and processing of my personal data.
    </Text>

  </TouchableOpacity>

</View>
{errors.terms ? (
  <Text style={[styles.errorText,{marginBottom: 10}]}>{errors.terms}</Text>
) : null}

          <GradientButton
            title="Next"
            onPress={()=>navigation.navigate('OtpVerify')}
            // onPress={onRegister}
          />

          <Text style={styles.bottom}>
            Already have an account?
            <Text onPress={()=>navigation.navigate('Login')} style={{ color: "#6C3BFF",fontSize:14,fontFamily:Fonts.semiBold }}> Sign In</Text>
          </Text>

        </ScrollView>

      </ImageBackground>

    </SafeAreaView>

  );
};

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    padding: 20
  },
errorText: {
  color: "#FF3B30",
  fontSize: 12,
  marginTop: 2,
  marginBottom: 4,
  fontFamily:Fonts.regular
},
  title: {
    fontWeight: "700",
    marginBottom: 8,
    marginTop:50,
    fontFamily:Fonts.bold
  },
fileIcon: {
  width: 20,
  height: 20,
},
  subtitle: {
    color: "#777",
    marginBottom: 25,
    textAlign:'center',
    fontSize:14,
     fontFamily:Fonts.regular
  },

  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15
  },

  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12
  },

  dropdownItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderBottomWidth: 1,
    
    borderColor: "#eee"
  },

  policyCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15
  },

  lockIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#6C3BFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },

  policyTitle: {
    fontWeight: "600",
fontSize:14,fontFamily:Fonts.semiBold  },

  policySub: {
    fontSize: 13,
    color: "#777",
    fontFamily:Fonts.regular
  },

 termsCard: {
  backgroundColor: "#FFF",
  borderRadius: 14,
  padding: 12,
  marginBottom: 20,
  borderWidth: 1,
  borderColor: "#E5E5E8",
},

agreeRow: {
  flexDirection: "row",
  alignItems: "flex-start",
},

agreeText: {
  flex: 1,
  color: "#555",
  marginLeft: 10,
  fontSize: 13,
  fontFamily:Fonts.medium,
  lineHeight: 18,
},

link: {
  color: "#6C3BFF",
  fontWeight: "600",
},

  bottom: {
    textAlign: "center",
    marginTop: 20,
    fontSize:14,fontFamily:Fonts.medium
  }

});