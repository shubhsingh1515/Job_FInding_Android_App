import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import { moderateScale } from "react-native-size-matters";

const ProfileOptionItem = ({ title, icon, onClick }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onClick}>
      <View style={styles.content}>
        <Image style={styles.logo} source={icon} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Image
        style={styles.nextIcon}
        source={require("../images/next.png")}
      />
    </TouchableOpacity>
  );
};

export default ProfileOptionItem;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(15),
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(20),
    marginBottom: moderateScale(15),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: moderateScale(25),
    height: moderateScale(25),
    tintColor: "#20B2AA",
  },
  title: {
    marginLeft: moderateScale(15),
    fontSize: moderateScale(18),
    color: "#20B2AA",
  },
  nextIcon: {
    width: moderateScale(15),
    height: moderateScale(15),
    tintColor: "#20B2AA",
  },
});
