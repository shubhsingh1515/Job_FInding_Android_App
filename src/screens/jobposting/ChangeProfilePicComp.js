import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { scale, moderateScale } from "react-native-size-matters";
import CustomBorderBtn from "../../common/CustomBorderBtn";
import CustomSolidButton from "../../common/CustomSolidButton";
import Loader from "../../common/Loader";
import { firebase } from "../../../Config";
import { BG_COLOR } from "../../utils/Colors";

const ChangeProfilePicComp = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [ImageData, setImageData] = useState(null);

  const openGal = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageData(result.assets[0]);
    }
  };

  // useEffect( async ()=>{
  //   const img = await AsyncStorage.getItem("PROFILE");
  //   console.log(img);
  //   setImageData(img)
  // },[])

  const uploadPic = async () => {
    const id = await AsyncStorage.getItem("USER_ID");

    try {
      if (!ImageData || !ImageData.uri) {
        throw new Error("ImageData or imageData.uri is undefined");
      }
      setLoading(true);
      const response = await fetch(ImageData.uri);
      const blob = await response.blob();
      const fileName = ImageData.fileName || "profile_picture";

      const reference = firebase.storage().ref().child(fileName);
      await reference.put(blob);

      const url = await reference.getDownloadURL();

      await firebase.firestore().collection("companies").doc(id).update({
        profileImage: url,
      });
      await AsyncStorage.setItem("PROFILE_IMG", url);
      navigation.goBack();
    } catch (err) {
      console.log("Error uploading picture:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.conatiner}>
      {ImageData == null ? (
        <Image
          style={styles.profile}
          source={require("../../images/profile.png")}
        />
      ) : (
        <Image source={{ uri: ImageData.uri }} style={styles.profile} />
      )}
      <CustomBorderBtn
        title={" Pick Image From Gallary"}
        onClick={() => {
          openGal();
        }}
      />
      {ImageData != null && (
        <CustomSolidButton
          title={"Upload Picture"}
          onClick={() => {
            uploadPic();
          }}
        />
      )}
      <Loader visible={loading} />
    </SafeAreaView>
  );
};

export default ChangeProfilePicComp;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  profile: {
    width: scale(250),
    height: scale(250),
    borderRadius: scale(150),
    alignSelf: "center",
    marginTop: moderateScale(40),
  },
  pick: {
    margin: moderateScale(15),
    padding: moderateScale(10),
    borderWidth: 1,
    width: "60%",
    alignSelf: "center",
    textAlign: "center",
    borderRadius: moderateScale(10),
  },
});
