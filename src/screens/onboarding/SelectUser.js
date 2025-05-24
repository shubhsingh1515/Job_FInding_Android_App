import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import React from "react";
import { BG_COLOR, Text_COLOR } from "../../utils/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { moderateScale } from "react-native-size-matters";

export default function SelectUser() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../../images/bg.jpeg")}
      style={style.background} 
    >
      <View style={style.container}>
        <View style={style.box}>
          <Text style={style.title}>What you are looking for?</Text>
          <TouchableOpacity
            style={style.hirebtn}
            onPress={() => {
              navigation.navigate("JobPostingNavigator");
            }}
          >
            <Text style={style.btntext1}>Want to Hire Candidate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={style.jobbtn}
            onPress={() => {
              navigation.navigate("JobSearchingNavigator");
            }}
          >
            <Text style={style.btntext2}>Want to Get Job</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    opacity: 0.9,
  },
  box:{
    justifyContent: "center",
    alignItems: "center",
    marginTop:moderateScale(600)
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    textAlign:'center'
  },
  hirebtn: {
    width: 300,
    height: 45,
    backgroundColor:"#20B2AA",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  jobbtn: {
    width: 300,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor:"#20B2AA"
  },
  btntext1: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
  },
  btntext2: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 10,
  },
});
