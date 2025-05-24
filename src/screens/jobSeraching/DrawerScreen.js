import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { BG_COLOR, PRIMARY_COLOR, SECONDARY_COLOR } from "../../utils/Colors";
import Apply from "./Tabs/Apply";
import Profile from "./Tabs/Profile";
import Home from "./Tabs/Home";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Jobsearch from "./Jobsearch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const DrawerScreen = () => {
  const [selectedTab, setCurrentTab] = useState(0);
  const [ProfileImg, SetProfileImg] = useState("");
  const [isLogin, SetisLogin] = useState(false);
  const isFoucused = useIsFocused();


  const navigation = useNavigation();

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
       
      }
    }
  };
  return (
    <View style={styles.container}>
      {selectedTab === 0 ? (
        <Home />
      ) : selectedTab === 1 ? (
        <Jobsearch/>
      ) : selectedTab === 2 ? (
        <Apply />
      ) : (
        <Profile />
      )}

      <View style={styles.bottomView}>
        <TouchableOpacity
          style={[
            styles.bottomTab,
            {
              borderTopWidth: selectedTab === 0 ? 3 : 0,
            },
          ]}
          onPress={() => {
            setCurrentTab(0);
          }}
        >
          
          <Image
            source={require("../../images/home.png")}
            style={[
              styles.tabIcon,
              { tintColor: selectedTab === 0 ? "#9370DB" : "#7f8c8d" },
            ]}
          />
          <Text
            style={[
              styles.tabText,
              { color: selectedTab === 0 ? "#9370DB" : "#7f8c8d" },
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.bottomTab,
            {
              borderTopWidth: selectedTab === 1 ? 3 : 0,
            },
          ]}
          onPress={() => {
            setCurrentTab(1);
          }}
        >
          <Image
            source={require("../../images/search.png")}
            style={[
              styles.tabIcon,
              { tintColor: selectedTab === 1 ? "#9370DB" : "#7f8c8d" },
            ]}
          />
          <Text
            style={[
              styles.tabText,
              { color: selectedTab === 1 ? "#9370DB" : "#7f8c8d" },
            ]}
          >
            Search
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.bottomTab,
            {
              borderTopWidth: selectedTab === 3 ? 3 : 0,
            },
          ]}
          onPress={() => {
            setCurrentTab(2);
          }}
        >
          <Image
            source={require("../../images/send.png")}
            style={[
              styles.tabIcon,
              { tintColor: selectedTab === 2 ? "#9370DB" : "#7f8c8d" },
            ]}
          />
          <Text
            style={[
              styles.tabText,
              { color: selectedTab === 2 ? "#9370DB" : "#7f8c8d" },
            ]}
          >
            Applied
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.bottomTab,
            {
              borderTopWidth: selectedTab === 4 ? 3 : 0,
            },
          ]}
          onPress={() => {
            setCurrentTab(4);
          }}
        >

          
          {ProfileImg != undefined && isLogin ? (
            <Image style={[styles.tabIcon1,{ borderWidth:1.5}]} source={{ uri: ProfileImg  }} />
            
          ) : (
            <Image
              style={styles.tabIcon}
              source={require("../../images/profile.png")}
            />
          )}
          {/* <Image
            source={require("../../images/profile.png")}
            style={[
              styles.tabIcon,
              // { tintColor: selectedTab === 3 ? "#9370DB" : "#7f8c8d" },
            ]}
          /> */}
         
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DrawerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  bottomView: {
    width: "100%",
    height: verticalScale(60),
    backgroundColor: "white",
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  bottomTab: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 3,
    borderTopColor: "transparent",
  },
  tabIcon: {
    width: moderateScale(28),
    height: moderateScale(28),
  },
  tabIcon1: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius:moderateScale(20),
    marginBottom: moderateScale(10),
   
    borderColor:'#9370DB'
   
  },
  tabIconAdd: {
    width: moderateScale(40),
    height: moderateScale(40),
    tintColor: "black",
  },
  tabText: {
    marginTop: moderateScale(4),
    fontSize: moderateScale(10),
    fontWeight: "500",
  },
});
