import { Text, StyleSheet, SafeAreaView, Image, View } from "react-native";
import React, { useEffect, useState } from "react";
import CustomTextInput from "../../common/CustomTextInput";
import { BG_COLOR } from "../../utils/Colors";
import CustomSolidButton from "../../common/CustomSolidButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import Loader from "../../common/Loader";
import { firebase } from "../../../Config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UpdateProfile = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [badname, setBadName] = useState("");
  const [email, setEmail] = useState("");
  const [bademail, setBadEmail] = useState("");
  const [contact, setContact] = useState("");
  const [badcontact, setBadContact] = useState("");
  const [company, setCompany] = useState("");
  const [badcompany, setBadCompany] = useState("");
  const [address, setAdress] = useState("");
  const [badaddress, setBadAdress] = useState("");
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
    let validCompany = true;
    let validAddress = true;

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

    // validation of company........
    if (company == "") {
      setBadCompany("Please Enter Company");
      validCompany = false;
    } else if (company != "" && company.length < 3) {
      validCompany = false;
      setBadCompany("Please Enter Valid Company");
    } else if (company != "" && company.length >= 3) {
      validCompany = true;
      setBadCompany("");
    }

    // validation of address.......
    if (address == "") {
      setBadAdress("Please Enter Address");
      validAddress = false;
    } else if (address != "" && address.length < 3) {
      validAddress = false;
      setBadAdress("Please Enter Valid Address");
    } else if (address != "" && address.length >= 3) {
      validAddress = true;
      setBadAdress("");
    }

    return (
      validAddress && validCompany && validContact && validEmail && validName
    );
  };
  // SignUp Functionality.........
  const updateUser = async () => {
    setLoading(true);
    const email1 = await AsyncStorage.getItem("EMAIL");
    const companiesRef = firebase.firestore().collection("companies");
    const query = await companiesRef.where("email", "==", email1).get();
    const companyDoc = query.docs[0];
    const companyDocRef = companiesRef.doc(companyDoc.id);
    await companyDocRef
      .update({
        name: name,
        email: email,
        contact: contact,
        company: company,
        address: address,
      })
      .then(async () => {
        await AsyncStorage.setItem("NAME", name);
        navigation.goBack();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const email1 = await AsyncStorage.getItem("EMAIL");
    firebase
      .firestore()
      .collection("companies")
      .where("email", "==", email1)
      .get()
      .then((res) => {
        res.docs.forEach((item) => {
          setName(item.data().name);
          setEmail(item.data().email);
          setContact(item.data().contact);
          setCompany(item.data().company);
          setAdress(item.data().address);
        });
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../../images/logo.png")}
      ></Image>
      <Text  style={styles.title}>Update Profile</Text>
      <Text style={styles.subtitle}>Keep Your Information Up to Date for Better Job Matches</Text>
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
        value={company}
        onChangeText={(txt) => {
          setCompany(txt);
        }}
        title={"Enter Company"}
        placeholder={"xyzpvt.Ltd"}
        error={badcompany != "" ? true : false}
      />
      {badcompany != "" && <Text style={styles.errmsg}>{badcompany}</Text>}

      <CustomTextInput
        value={address}
        onChangeText={(txt) => {
          setAdress(txt);
        }}
        title={"Enter Address"}
        placeholder={"xyzabc"}
        error={badaddress != "" ? true : false}
      />
      {badaddress != "" && <Text style={styles.errmsg}>{badaddress}</Text>}

      <CustomSolidButton
        title={"Update Profile"}
        onClick={() => {
          if (validate()) {
            updateUser();
          }
        }}
      />
      <Loader visible={loading} />
    </SafeAreaView>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginTop: 0,
  },
  title: {
    fontSize: 30,
    alignSelf: "center",
    fontWeight: "600",
    margin: 5,
  },
  subtitle: {
    fontSize: 15,
    alignSelf: "center",
    fontWeight: "600",
    marginTop: 0,
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
