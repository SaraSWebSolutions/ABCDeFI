import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginScreen } from "../Screens/Auth/LoginScreen";
import { SplashScreen } from "../Screens/SplashScreen";

import { AuthStackParamList } from "./types";
import { SignupScreen } from "../Screens/Auth/SignupScreen";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator  initialRouteName={'Splash'} screenOptions={{ headerShown: false }}>
     <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} />
    </Stack.Navigator>
  );
}