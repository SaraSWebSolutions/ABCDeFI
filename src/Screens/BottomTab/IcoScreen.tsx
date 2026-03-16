import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useResponsive } from "../..//Utils/Responsive";

export default function IcoScreen() {

  const { font } = useResponsive();

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: font(22) }}>ICO Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});