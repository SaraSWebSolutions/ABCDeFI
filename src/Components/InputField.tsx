import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Colors } from "../Utils/Colors";
import { useResponsive } from "../Utils/Responsive";

interface Props {
  value: string;
  placeholder: string;
  secure?: boolean;
  onChange: (text: string) => void;
}

export const InputField: React.FC<Props> = ({
  value,
  placeholder,
  secure,
  onChange,
}) => {
  const { hp, wp, radius } = useResponsive();
  const [hidePassword, setHidePassword] = useState(secure);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          {
            height: hp(7),
            width: wp(90),
            borderRadius: radius(3),
            paddingHorizontal: wp(4),
          },
        ]}
      >
        <TextInput
          value={value}
          placeholder={placeholder}
          secureTextEntry={hidePassword}
          onChangeText={onChange}
          style={styles.input}
        />

        {secure && (
          <TouchableOpacity
            onPress={() => setHidePassword(!hidePassword)}
          >
            <Icon
              name={hidePassword ? "eye-off" : "eye"}
              size={20}
              color="#777"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.border,
  },

  input: {
    flex: 1,
  },
});