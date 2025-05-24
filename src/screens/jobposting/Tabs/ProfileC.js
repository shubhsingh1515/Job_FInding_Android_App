import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from "react-native-size-matters";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import ProfileOptionItem from "../../../common/ProfileOptionItem";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { LinearGradient } from "expo-linear-gradient";

const ProfileC = ({ onJobsClick }) => {
  const [Name, SetName] = useState("");
  const [Email, SetEmail] = useState("");
  const [Contact, SetContact] = useState("");
  const [CompanyName, SetCompanyName] = useState("");
  const [Address, SetAddress] = useState("");
  const [ProfileImg, SetProfileImg] = useState("");
  const [Jobs, SetJobs] = useState("");
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    getData();
  }, [isFocused]);

  const getData = async () => {
    SetName(await AsyncStorage.getItem("NAME"));
    SetJobs(await AsyncStorage.getItem("JOBS"));
    SetEmail(await AsyncStorage.getItem("EMAIL"));
    SetContact(await AsyncStorage.getItem("CONTACT"));
    SetCompanyName(await AsyncStorage.getItem("COMPANY_NAME"));
    SetAddress(await AsyncStorage.getItem("ADDRESS"));
    const id = await AsyncStorage.getItem("EMAIL");

    firebase
      .firestore()
      .collection("companies")
      .where("email", "==", id)
      .get()
      .then(async (data) => {
        let temp = [];
        data.docs.forEach((item) => {
          temp.push({ ...item.data(), id: item.id });
        });
        SetProfileImg(temp[0].profileImage);
        SetCompanyName(temp[0].company);
        SetContact(temp[0].contact);
        SetAddress(temp[0].address);
        await AsyncStorage.setItem("PROFILE", temp[0].profileImage);
        await AsyncStorage.setItem("COMPANY_NAME", temp[0].company);
        await AsyncStorage.setItem("CONTACT", temp[0].contact);
        await AsyncStorage.setItem("ADDRESS", temp[0].address);
      });
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("NAME");
    await AsyncStorage.removeItem("JOBS");
    await AsyncStorage.removeItem("PROFILE_IMG");
    await AsyncStorage.removeItem("USER_ID");
    await AsyncStorage.removeItem("EMAIL");
    await AsyncStorage.removeItem("CONTACT");
    await AsyncStorage.removeItem("COMPANY_NAME");
    await AsyncStorage.removeItem("ADDRESS");
    navigation.navigate("SelectUser");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.heading}>
        Job Genie
        {/* <Image
          style={styles.logo}
          source={require("../../../images/logo.png")}
        /> */}
      </Text>
      <View style={styles.profileContainer}>
        <TouchableOpacity>
          {ProfileImg ? (
            <Image style={styles.profile} source={{ uri: ProfileImg }} />
          ) : (
            <Image
              style={styles.profile}
              source={require("../../../images/profile.png")}
            />
          )}
        </TouchableOpacity>
        <View style={styles.buttonContainer}> 
          <TouchableOpacity
            style={styles.updateProfileButton}
            onPress={() => {
              navigation.navigate("Update Profile");
            }}
          >
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.changeProfileButton}
            onPress={() => {
              navigation.navigate("Change Profile Picture");
            }}
          >
            <Text style={styles.buttonText}>Change Profile Picture</Text>
          </TouchableOpacity>
        </View>
      </View>
      <LinearGradient colors={["#A4FF7F","#66CDAA"]} style={styles.infoCard}>
        <Text style={styles.name}>{Name}</Text>
        <Text style={styles.email}>{Email}</Text>
        <Text style={styles.contact}>Contact Number : +91 {Contact}</Text>
        <Text style={styles.companyName}>Company Name :{CompanyName}</Text>
        <Text style={styles.address}>Location : {Address}</Text>
      </LinearGradient>
      <View style={styles.option}>
        <ProfileOptionItem
          icon={require("../../../images/Job.png")}
          title={"My Jobs(" + Jobs + ")"}
          onClick={onJobsClick}
        />
        <ProfileOptionItem
          icon={require("../../../images/contact-mail.png")}
          title={"Contact Us"}
          onClick={() => {
            navigation.navigate("Contact Us");
          }}
        />
        <ProfileOptionItem
          icon={require("../../../images/info.png")}
          title={"About Us"}
          onClick={() => {
            navigation.navigate("About Us");
          }}
        />
        <ProfileOptionItem
          icon={require("../../../images/logout.png")}
          title={"Logout"}
          onClick={handleLogout}
        />
      </View>
    </ScrollView>
  );
};

export default ProfileC;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: moderateScale(15),
    backgroundColor: "#E0FFFF",
  },
  heading: {
    fontSize: moderateScale(28),
    fontWeight: "700",
    color: "black",
    marginVertical: moderateScale(20),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 40,
    height: 40,
    marginLeft: moderateScale(10),
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: moderateScale(0),
  },
  profile: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderColor:'#20B2AA'
  },
  buttonContainer: {
    flex: 1,
    marginLeft: moderateScale(20),
  },
  updateProfileButton: {
    backgroundColor: "#20B2AA",
    padding: moderateScale(10),
    borderRadius: moderateScale(5),
    alignItems: "center",
    marginBottom: moderateScale(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  changeProfileButton: {
    backgroundColor: "green",
    padding: moderateScale(10),
    borderRadius: moderateScale(5),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#FFFAFA",
    fontSize: moderateScale(18),
    fontWeight: "600",
  },
  infoCard: {
    borderRadius: moderateScale(10),
    padding: moderateScale(15),
    marginVertical: moderateScale(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: "transparent",
  },
  name: {
    color: "#2F4F4F",
    fontSize: moderateScale(24),
    fontWeight: "700",
    textAlign: "center",
  },
  email: {
    color: "#2F4F4F",
    fontSize: moderateScale(18),
    textAlign: "center",
    fontWeight: "500",
    marginTop: moderateScale(5),
  },
  contact: {
    color: "#2F4F4F",
    fontSize: moderateScale(18),
    textAlign: "center",
    fontWeight: "500",
    marginTop: moderateScale(5),
  },
  companyName: {
    color: "#2F4F4F",
    fontSize: moderateScale(18),
    textAlign: "center",
    fontWeight: "500",
    marginTop: moderateScale(5),
  },
  address: {
    color: "#2F4F4F",
    fontSize: moderateScale(18),
    textAlign: "center",
    marginTop: moderateScale(5),
    fontWeight: "500",
  },
  option: {
    marginTop: moderateVerticalScale(40),
    paddingHorizontal: moderateScale(10),
 
  },
});
