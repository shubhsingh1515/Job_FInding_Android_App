import { Text, StyleSheet, SafeAreaView, Image, View } from "react-native";
import React, { useState } from "react";
import CustomTextInput from "../../common/CustomTextInput";
import { BG_COLOR } from "../../utils/Colors";
import CustomSolidButton from "../../common/CustomSolidButton";
import CustomBorderBtn from "../../common/CustomBorderBtn";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import Loader from "../../common/Loader";
import { firebase } from "../../../Config";

const SignUpForUser = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [badname, setBadName] = useState("");
  const [email, setEmail] = useState("");
  const [bademail, setBadEmail] = useState("");
  const [contact, setContact] = useState("");
  const [badcontact, setBadContact] = useState("");
  const [password, setPassword] = useState("");
  const [badpassword, setBadpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  const validate = () => {
    let nameRegex = /^[A-Za-z]+$/;
    let emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let contactRegex = /^\d{10}$/;
    let validName = true;
    let validEmail = true;
    let validContact = true;
    let validPassword = true;

    if (name == "") {
      setBadName("Please Enter Name");
      validName = false;
    } else if (name != "" && name.length < 3) {
      validName = false;
      setBadName("Please Enter Valid Name");
    } else if (name != "" && name.length > 3) {
      validName = true;
      setBadName("");
    }

    // Name Validation......
    if (name == "") {
      setBadName("Please Enter Name");
      validName = false;
    } else if (name != "" && name.length < 3) {
      validName = false;
      setBadName("Please Enter Valid Name");
    } else if (
      name != "" &&
      name.length >= 3 &&
      name.toString().match(nameRegex)
    ) {
      validName = false;
      setBadName("Please Enter Valid Name");
    } else if (
      name != "" &&
      name.length >= 3 &&
      !name.toString().match(nameRegex)
    ) {
      validName = true;
      setBadName("");
    }

    // Email Validation.....
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

    // Valid Contact..........
    if (contact == "") {
      setBadContact("Please Enter Contact");
      validContact = false;
    } else if (contact != "" && contact.length < 10) {
      validContact = false;
      setBadContact("Please Enter Valid  Contact");
    } else if (
      contact != "" &&
      contact.length >= 10 &&
      !contact.toString().match(contactRegex)
    ) {
      validContact = false;
      setBadContact("Please Enter Valid  Contact");
    } else if (
      contact != "" &&
      contact.length >= 10 &&
      contact.toString().match(contactRegex)
    ) {
      validContact = true;
      setBadContact("");
    }

    // validation for password........
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

    return validContact && validEmail && validName && validPassword;
  };

  // SignUp Functionality.........

  const registerCompany = () => {
    firebase
      .firestore()
      .collection("users")
      .add({
        name: name,
        email: email,
        contact: contact,
        password: password,
      })
      .then(() => {
        setName("");
        setEmail("");
        setContact("");
        setPassword("");
        setAccountCreated(true);
        setLoading(false);
        setTimeout(() => {
          navigation.navigate("LoginForUser");
        }, 3000);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      {!accountCreated ? (
        <ScrollView>
          <Image
            style={styles.logo}
            source={require("../../images/logo.png")}
          ></Image>
          <Text style={styles.title}>Create An Account</Text>
          <Text style={styles.subtitle}>Please fill in the details below to create a new account.</Text>


          <CustomTextInput
            value={name}
            onChangeText={(txt) => {
              setName(txt);
            }}
            title={"Enter Name"}
            placeholder={"xyz"}
            error={badname != "" ? true : false}
          />
          {badname != "" && <Text style={styles.errmsg}>{badname}</Text>}

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
            value={contact}
            onChangeText={(txt) => {
              setContact(txt);
            }}
            title={"Enter Contact Number"}
            placeholder={"+9143433535"}
            error={badcontact != "" ? true : false}
          />
          {badcontact != "" && <Text style={styles.errmsg}>{badcontact}</Text>}

          <CustomTextInput
            value={password}
            onChangeText={(txt) => {
              setPassword(txt);
            }}
            title={"Enter Password"}
            placeholder={"**********"}
            error={badpassword != "" ? true : false}
          />
          {badpassword != "" && (
            <Text style={styles.errmsg}>{badpassword}</Text>
          )}

          <CustomSolidButton
            title={"SignUp"}
            onClick={() => {
              if (validate()) {
                registerCompany();
              }
            }}
          />

          <CustomBorderBtn
            title={"Login"}
            onClick={() => {
              navigation.navigate("LoginForUser");
            }}
          />

          <Loader visible={loading} />
        </ScrollView>
      ) : (
        <View style={styles.doneView}>
          <Image
            source={require("../../images/checked.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>{"Account Created"}</Text>
        </View>
      )}
      <Loader visible={loading} />
    </SafeAreaView>
  );
};

export default SignUpForUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 30,
    alignSelf: "center",
    fontWeight: "600",
    marginTop: 6,
  },
  subtitle: {
    fontSize: 17,
    alignSelf: "center",
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 10,

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
  doneView: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
