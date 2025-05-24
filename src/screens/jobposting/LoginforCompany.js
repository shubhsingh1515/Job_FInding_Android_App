import { Text, StyleSheet, SafeAreaView, Image } from "react-native";
import React, { useState } from "react";
import CustomTextInput from "../../common/CustomTextInput";
import { BG_COLOR } from "../../utils/Colors";
import CustomSolidButton from "../../common/CustomSolidButton";
import CustomBorderBtn from "../../common/CustomBorderBtn";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../../../Config";
import Loader from "../../common/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginforCompany = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [badpassword, setBadpassword] = useState("");
  const [email, setEmail] = useState("");
  const [bademail, setBadEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const validate = () => {
    let emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let validEmail = true;
    let validPassword = true;

    // Email Validation...........
    if (email == "") {
      setBadEmail("Please Enter Email");
      validEmail = false;
    } else if (email != "" && !email.toString().match(emailRegex)) {
      validEmail = false;
      setBadEmail("Please Enter Valid Email");
    } else if (email != "" && email.toString().match(emailRegex)) {
      validEmail = true;
      setBadEmail("");
    }

    // validation for password..........
    if (password == "") {
      setBadpassword("Please Enter Password");
      validPassword = false;
    } else if (password != "" && password.length < 6) {
      validPassword = false;
      setBadpassword("Please Enter Min 6 Characters");
    } else if (password != "" && password.length >= 6) {
      validPassword = true;
      setBadpassword("");
    }
    return validEmail && validPassword;
  };

  //  login button functionality.......

  const loginUser = async () => {
    let temp = [];
    try {
      await firebase
        .firestore()
        .collection("companies")
        .where("email", "==", email)
        .get()
        .then(async (data) => {
          data.docs.forEach((item) => {
            temp.push({ ...item.data(), id: item.id });
          });
        });
      setLoading(true);
      if (temp.length > 0) {
        if (temp[0].password === password) {
          setBadEmail("");
          setBadpassword("");
          gotoNextScreen(temp[0].id, temp[0].name, temp[0].email, temp);
        } else {
          setBadpassword("Wrong Password");
        }
      } else {
        setBadEmail("No User exits with this email");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching companies:", error);
    }
  };
  // after login Navigation.............

  const gotoNextScreen = async (id, name, email) => {
    await AsyncStorage.setItem("NAME", name);
    await AsyncStorage.setItem("EMAIL", email);
    await AsyncStorage.setItem("USER_TYPE", "company");
    await AsyncStorage.setItem("USER_ID", id);
    navigation.navigate("DashboardForCompany");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../../images/logo.png")}
      ></Image>
      <Text style={styles.title}>Recruiter Login</Text>
      <Text style={styles.subtitle}>
      Manage your job postings and applications
      </Text>
      <CustomTextInput
        value={email}
        onChangeText={(txt) => {
          setEmail(txt);
        }}
        title={"Enter Email"}
        placeholder={"xyz@gmail.com"}
        error={bademail != "" ? true : false}
      />
      {bademail != "" && <Text style={styles.errmsg}>{bademail}</Text>}

      <CustomTextInput
        value={password}
        onChangeText={(txt) => {
          setPassword(txt);
        }}
        title={"Enter Password"}
        placeholder={"**********"}
        error={badpassword != "" ? true : false}
      />
      {badpassword != "" && <Text style={styles.errmsg}>{badpassword}</Text>}

      <Text style={styles.forgotpassword}>Forgot Password ?</Text>
      <CustomSolidButton
        title={"Login"}
        onClick={() => {
          if (validate()) {
            loginUser();
          }
        }}
      />

      <CustomBorderBtn
        title={"Create an Account"}
        onClick={() => {
          navigation.navigate("SignUpForCompany");
        }}
      />
      <Loader visible={loading} />
    </SafeAreaView>
  );
};

export default LoginforCompany;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginTop: 60,
  },
  title: {
    fontSize: 30,
    alignSelf: "center",
    fontWeight: "600",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 17,
    alignSelf: "center",
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 10,
    color: "black",
  },
  forgotpassword: {
    alignSelf: "flex-end",
    marginRight: 20,
    marginTop: 10,
    fontWeight: "500",
    fontSize: 16,
  },
  errmsg: {
    marginLeft: 25,
    color: "red",
  },
});
