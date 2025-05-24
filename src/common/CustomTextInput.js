import { View, Text, StyleSheet, TextInput } from "react-native";
import React from "react";
import { BG_COLOR } from "../utils/Colors";

const CustomTextInput = ({
  title,
  placeholder,
  value,
  onChangeText,
  error,
  keyboardType,
}) => {
  return (
    <View style={[styles.input, { borderColor: error ? "red" : "#00CED1" }]}>
      <Text style={[styles.title, { color: error ? "red" : "black" }]}>
        {title}
      </Text>

      <TextInput
        value={value}
        onChangeText={(txt) => onChangeText(txt)}
        placeholder={placeholder}
        keyboardType={keyboardType ? keyboardType : "default"}
      />
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  input: {
    width: "90%",
    height: 45,
    borderWidth: 0.4,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 10,
    justifyContent: "center",
    paddingLeft: 15,
    paddingRight: 15,
  },
  title: {
    alignSelf: "flex-start",
    marginLeft: 20,
    paddingLeft: 10,
    paddingRight: 10,
    position: "absolute",
    top: -8,
    backgroundColor: 'white',
  },
});
