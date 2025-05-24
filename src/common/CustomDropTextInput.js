import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { BG_COLOR } from "../utils/Colors";

const CustomDropTextInput = ({ title, placeholder, error, onClick }) => {
  return (
    <TouchableOpacity
      style={[styles.input, { borderColor: error ? "red" : "#00CED1" }]}
      onPress={() => {
        onClick();
      }}
    >
      <Text style={[styles.title, { color: error ? "red" : "black" }]}>
        {title}
      </Text>
      <Text
        style={{ color: placeholder.includes("Select") ? "#9e9e9e" : "black" }}
      >
        {placeholder}
      </Text>
      <Image
        source={require("../images/down-arrow.png")}
        style={styles.icon}
      ></Image>
    </TouchableOpacity>
  );
};

export default CustomDropTextInput;

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
   
  },
  title: {
    alignSelf: "flex-start",
    marginLeft: 20,
    paddingLeft: 10,
    paddingRight: 10,
    position: "absolute",
    top: -8,
    backgroundColor: BG_COLOR,
  },
  icon: {
    width: 20,
    height: 20,
  },
});
