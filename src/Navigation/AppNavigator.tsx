import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginScreen } from "../Screens/Auth/LoginScreen";
import { SplashScreen } from "../Screens/SplashScreen";

import { AuthStackParamList } from "./types";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator  initialRouteName={'Splash'} screenOptions={{ headerShown: false }}>
     <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}