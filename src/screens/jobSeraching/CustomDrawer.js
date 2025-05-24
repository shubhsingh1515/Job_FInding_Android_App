import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";

import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from "react-native-size-matters";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const COLORS = {
  background: "#ffffff",
  primary: "#3498db",
  secondary: "#2ecc71",
  textPrimary: "#2c3e50",
  textSecondary: "#8e44ad",
  listBackground: "#ecf0f1",
  buttonBackground: "#e74c3c",
  buttonText: "#ffffff",
  emptyText: "#95a5a6",
  inputBorder: "#bdc3c7",
  inputBackground: "#ecf0f1",
  searchBoxBorder: "#9e9e9e",
  gray: "gray",
};

const FONTS = {
  regular: "Roboto-Regular",
  bold: "Roboto-Bold",
  italic: "Roboto-Italic",
};

const CustomDrawer = ({ navigation }) => {
  const [name, Setname] = useState("");
  const [email, setEmail] = useState("");
  const [ProfileImg, SetProfileImg] = useState("");
  const [isLogin, SetisLogin] = useState(false);
  const isFoucused = useIsFocused();

  useEffect(() => {
    getdata();
    getPicData();
  }, [isFoucused]);

  const getPicData = async () => {
    const id = await AsyncStorage.getItem("EMAIL");
    firebase
      .firestore()
      .collection("users")
      .where("email", "==", id)
      .get()
      .then(async (data) => {
        let temp = [];
        data.docs.forEach((item) => {
          temp.push({ ...item.data(), id: item.id });
        });
        SetProfileImg(temp[0].profileImage);
        await AsyncStorage.setItem("PROFILE", temp[0].profileImage);
      });
  };

  const getdata = async () => {
    const id = await AsyncStorage.getItem("USER_ID");
    const type = await AsyncStorage.getItem("USER_TYPE");
    const nameuser = await AsyncStorage.getItem("NAME");
    const emailuser = await AsyncStorage.getItem("EMAIL");

    if (id != null && type != null) {
      if (type == "user") {
        SetisLogin(true);
        Setname(nameuser);
        setEmail(emailuser);
      }
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("USER_ID");
    await AsyncStorage.removeItem("USER_TYPE");
    await AsyncStorage.removeItem("NAME");
    await AsyncStorage.removeItem("EMAIL");
    SetisLogin(false);
    Setname("");
    setEmail("");
    navigation.navigate("SelectUser");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topView}>
        <TouchableOpacity>
          {ProfileImg != undefined && isLogin ? (
            <Image style={styles.profile} source={{ uri: ProfileImg }} />
          ) : (
            <Image
              style={styles.profile}
              source={require("../../images/profile.png")}
            />
          )}
        </TouchableOpacity>
        <View>
          <Text style={styles.heading}>
            {isLogin ? name : "Build Your Profile"}
          </Text>
          <Text style={styles.Subheading}>
            {isLogin ? email : "Job Opportunities waiting"}
          </Text>
        </View>
      </View>
      {!isLogin && (
        <View style={styles.btnView}>
          <TouchableOpacity
            style={styles.loginbtn}
            onPress={() => {
              navigation.navigate("LoginForUser");
            }}
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signupbtn}
            onPress={() => {
              navigation.navigate("SignUpForUser");
            }}
          >
            <Text style={[styles.loginText, { color:"black" }]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.seperator}></View>
      <FlatList
        contentContainerStyle={{ marginTop: moderateScale(10) }}
        data={[
          { title: "Saved Jobs", icon: require("../../images/star.png") },
          {
            title: "Contact Us",
            icon: require("../../images/contact-mail.png"),
          },
          { title: "About Us", icon: require("../../images/info.png") },
          isLogin
            ? { title: "Logout", icon: require("../../images/logout.png") }
            : { title: "Login", icon: require("../../images/key.png") },
        ]}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              style={styles.menuitem}
              onPress={() => {
                if (index == 0) {
                  navigation.closeDrawer();
                  navigation.navigate("SavedJobs");
                } else if (index == 1) {
                  navigation.closeDrawer();
                  navigation.navigate("Contact Us");
                } else if (index == 2) {
                  navigation.closeDrawer();
                  navigation.navigate("About Us");
                } else if (index == 3 && isLogin) {
                  logout();
                } else if (index == 3 && !isLogin) {
                  navigation.navigate("LoginForUser");
                }
              }}
            >
              <View style={styles.menuitemvlist}>
                <Image source={item.icon} style={styles.menuicon} />
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              <Image
                source={require("../../images/next.png")}
                style={styles.menuicon}
              />
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  profile: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    borderWidth: 1,
    borderColor: "#8A2BE2",
    marginRight: moderateScale(0),
  },
  topView: {
    flexDirection: "row",
    marginTop: moderateScale(50),
    marginLeft: moderateScale(10),
  },
  heading: {
    fontSize: 19,
    width: "80%",
    fontWeight: "500",
    marginLeft: moderateScale(10),
    marginTop: moderateScale(10),
    color: COLORS.textPrimary,
  },
  Subheading: {
    fontSize: moderateScale(14),
    width: "100%",
    marginLeft: moderateScale(10),
    color: COLORS.textSecondary,
  },
  btnView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: moderateVerticalScale(20),
  },
  loginbtn: {
    width: "40%",
    height: verticalScale(35),
    backgroundColor: "#9370DB",
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  signupbtn: {
    width: "40%",
    height: verticalScale(35),
    borderColor: "#9370DB",
    borderWidth: 1,
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: COLORS.buttonText,
    fontWeight: "500",
  },
  seperator: {
    width: "90%",
    height: verticalScale(0.5),
    opacity: 0.5,
    backgroundColor: COLORS.inputBorder,
    alignSelf: "center",
    marginTop: moderateScale(20),
  },
  menuitem: {
    width: "90%",
    alignItems: "center",
    flexDirection: "row",
    height: verticalScale(50),
    justifyContent: "space-between",
    alignSelf: "center",
    backgroundColor: COLORS.listBackground,
    borderRadius: moderateScale(10),
    padding: moderateScale(10),
    marginVertical: moderateScale(5),
  },
  menuitemvlist: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuicon: {
    width: moderateScale(25),
    height: moderateScale(25),
    tintColor:"#8A2BE2",
  },
  menuText: {
    fontSize: moderateScale(16),
    marginLeft: moderateScale(10),
    color: "#8A2BE2",
  },
  logoutbtn: {
    width: "80%",
    height: verticalScale(35),
    borderColor: COLORS.buttonBackground,
    borderWidth: 1,
    borderRadius: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.buttonBackground,
    marginLeft: moderateScale(10),
    marginBottom: moderateScale(10),
  },
  logText: {
    color: COLORS.buttonText,
    fontWeight: "500",
  },
});
