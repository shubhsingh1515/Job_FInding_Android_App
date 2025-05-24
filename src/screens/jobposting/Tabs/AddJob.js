import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import CustomTextInput from "../../../common/CustomTextInput";
import { BG_COLOR } from "../../../utils/Colors";
import CustomDropTextInput from "../../../common/CustomDropTextInput";
import CustomSolidButton from "../../../common/CustomSolidButton";
import { limit, runTransaction } from "firebase/firestore";
import { FlatList } from "react-native-gesture-handler";
import { profiles } from "../../../utils/Profile";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { firebase } from "../../../../Config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Loader from "../../../common/Loader";
const AddJob = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [JobTitle, SetJobTitle] = useState("");
  const [BadJobTitle, SetBadJobTitle] = useState("");

  const [JobDesc, SetJobDesc] = useState("");
  const [badJobDesc, SetBadJobDesc] = useState("");

  const [Exper, SetExper] = useState("");
  const [BadExper, SetBadExper] = useState("");

  const [Pkg, SetPkg] = useState("");
  const [BadPkg, SetBadPkg] = useState("");

  const [Comp, SetComp] = useState("");
  const [BadComp, SetBadComp] = useState("");

  const [Loc, SetLoc] = useState("");
  const [BadLoc, SetBadLoc] = useState("");

  const [Skill, SetSkill] = useState("");
  const [BadSkill, SetBadSkill] = useState("");

  const [Categ, SetCateg] = useState("");
  const [BadCateg, SetBadCateg] = useState("");

  const [OpenCatM, setOpenCatM] = useState(false);
  const [OpenSkillM, setOpenSkillM] = useState(false);
  const [SelectCAt, setSelectCAt] = useState("Select Category");
  const [SelectSkill, setSelectSkill] = useState("Select Skill");

  const postJob = async () => {
    let name = await AsyncStorage.getItem("NAME");
    let email = await AsyncStorage.getItem("EMAIL");
    setLoading(true);
    firebase
      .firestore()
      .collection("jobs")
      .add({
        posterEmail: email,
        posterName: name,
        jobTitle: JobTitle,
        jobDescription: JobDesc,
        experience: Exper,
        package: Pkg,
        company: Comp,
        category: profiles[SelectCAt].category,
        skill: SelectSkill,
        location :Loc,
      })
      .then((res) => {
        setLoading(false);
        navigation.goBack();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const validate = () => {
    let validJobTitle = true;
    let validJobDesc = true;
    let validExper = true;
    let validPkg = true;
    let validComp = true;
    let validCategory = true;
    let validSkill = true;
    let validLoc = true;


    if (JobTitle == "") {
      validJobTitle = false;
      SetBadJobTitle("Please Enter Job Title");
    } else if (JobTitle != "") {
      validJobTitle = true;
      SetBadJobTitle("");
    }

    if (Loc == "") {
      validLoc = false;
      SetBadLoc("Please Enter Location");
    } else if (Loc != "") {
      validLoc = true;
      SetBadLoc("");
    }

    if (JobDesc == "") {
      validJobDesc = false;
      SetBadJobDesc("Please Enter Job Description");
    } else if (JobDesc != "" && JobDesc.length < 20) {
      validJobDesc = true;
      SetBadJobDesc("Please Enter Job Description min 20 character");
    } else if (JobDesc != "" && JobDesc.length >= 20) {
      validJobDesc = true;
      SetBadJobDesc("");
    }
    let expRegex = /^\d{10}$/;
    if (Exper == "") {
      validExper = false;
      SetBadExper("Please Enter Experience");
    } else if (Exper != "" && Exper.length > 2) {
      validExper = false;
      SetBadExper("Please Enter Valid Experience");
    } else if (Exper != "" && Exper.length < 3 && Exper.match(expRegex)) {
      validExper = false;
      SetBadExper("Please Enter numerical value");
    } else if (Exper != "" && Exper.length < 3 && !Exper.match(expRegex)) {
      validExper = true;
      SetBadExper("");
    }

    if (Pkg == "") {
      validPkg = false;
      SetBadPkg("Please Enter Package");
    } else if (Pkg != "" && Pkg.match(expRegex)) {
      validPkg = false;
      SetBadPkg("Please Enter numerical value");
    } else if (Pkg != "" && !Pkg.match(expRegex)) {
      validPkg = true;
      SetBadPkg("");
    }

    if (Comp == "") {
      validComp = false;
      SetBadComp("Please Enter Company");
    } else if (Comp != "") {
      validComp = true;
      SetBadComp("");
    }

    if (SelectCAt == "Select Category") {
      validCategory = false;
      SetBadCateg("Please Choose Category");
    } else if (Categ != "Select Category") {
      validCategory = true;
      SetBadCateg("");
    }
    if (SelectSkill == "Select Skill") {
      validSkill = false;
      SetBadSkill("Please Choose Skill");
    } else if (Skill != "Select Skill") {
      validSkill = true;
      SetBadSkill("");
    }
    return (
      validCategory &&
      validComp &&
      validExper &&
      validJobDesc &&
      validJobTitle &&
      validPkg &&
      validSkill &&
      validLoc
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* <Image
          style={styles.logo}
          source={require("../../../images/logo.png")}
        ></Image> */}
        <Text style={styles.title}>Job Posting</Text>
        <Text style={styles.subtitle}>Share your job openings with candidates</Text>
        <CustomTextInput
          value={JobTitle}
          onChangeText={(txt) => {
            SetJobTitle(txt);
          }}
          title={"Job Title"}
          placeholder={"ex-Android Development"}
          error={BadJobTitle != "" ? true : false}
        />
        {BadJobTitle != "" && <Text style={styles.errmsg}>{BadJobTitle}</Text>}
        <CustomTextInput
          value={JobDesc}
          onChangeText={(txt) => {
            SetJobDesc(txt);
          }}
          title={"Job Description"}
          placeholder={" ex- Android Development with React-Native"}
          error={badJobDesc != "" ? true : false}
        />
        {badJobDesc != "" && <Text style={styles.errmsg}>{badJobDesc}</Text>}

        <CustomDropTextInput
          value={Categ}
          onChangeText={(txt) => {
            SetCateg(txt);
          }}
          title={"Category"}
          placeholder={
            SelectCAt == "Select Category"
              ? "Select Category"
              : profiles[SelectCAt].category
          }
          onClick={() => {
            setOpenCatM(true);
          }}
          error={BadCateg != "" ? true : false}
        />
        {BadCateg != "" && <Text style={styles.errmsg}>{BadCateg}</Text>}

        <CustomDropTextInput
          value={Skill}
          onChangeText={(txt) => {
            SetSkill(txt);
          }}
          title={"Skill"}
          placeholder={SelectSkill}
          onClick={() => {
            setOpenSkillM(true);
          }}
          error={BadSkill != "" ? true : false}
        />
        {BadSkill != "" && <Text style={styles.errmsg}>{BadSkill}</Text>}

        <CustomTextInput
          value={Exper}
          onChangeText={(txt) => {
            SetExper(txt);
          }}
          title={"Expeirence"}
          placeholder={"ex- Required experience 5 Years "}
          keyboardType={"number-pad"}
          error={BadExper != "" ? true : false}
        />
        {BadExper != "" && <Text style={styles.errmsg}>{BadExper}</Text>}

        <CustomTextInput
          value={Pkg}
          onChangeText={(txt) => {
            SetPkg(txt);
          }}
          title={"Package"}
          placeholder={"ex- 10LPA "}
          keyboardType={"number-pad"}
          error={BadPkg != "" ? true : false}
        />
        {BadPkg != "" && <Text style={styles.errmsg}>{BadPkg}</Text>}

        <CustomTextInput
          value={Comp}
          onChangeText={(txt) => {
            SetComp(txt);
          }}
          title={"Company"}
          placeholder={"ex- Google"}
          error={BadComp != "" ? true : false}
        />
        {BadComp != "" && <Text style={styles.errmsg}>{BadComp}</Text>}

        <CustomTextInput
          value={Loc}
          onChangeText={(txt) => {
            SetLoc(txt);
          }}
          title={"Job Location"}
          placeholder={"ex-New Delhi"}
          error={BadLoc!= "" ? true : false}
        />
        {BadLoc != "" && <Text style={styles.errmsg}>{BadLoc}</Text>}

        <CustomSolidButton
          title={"Post Job"}
          onClick={() => {
            if (validate()) {
              postJob();
            }
          }}
        />
        <Modal visible={OpenCatM} transparent style={{ flex: 1 }}>
          <View style={styles.mainView}>
            <View style={styles.listing}>
              <Text style={styles.title}>Select Category</Text>
              <FlatList
                data={profiles}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      style={styles.profileItem}
                      onPress={() => {
                        setSelectCAt(index);
                        setOpenCatM(false);
                      }}
                    >
                      <Text>{item.category}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </Modal>
        <Modal visible={OpenSkillM} transparent style={{ flex: 1 }}>
          <View style={styles.mainView}>
            <View style={styles.listing}>
              <Text style={styles.title}>Select Skill</Text>
              <FlatList
                data={
                  SelectCAt == "Select Category"
                    ? profiles[0].keywords
                    : profiles[SelectCAt].keywords
                }
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      style={styles.profileItem}
                      onPress={() => {
                        setSelectSkill(item[0]);
                        setOpenSkillM(false);
                      }}
                    >
                      <Text>{item[0]}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </Modal>
        <Loader visible={loading} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddJob;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  mainView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  listing: {
    width: "90%",
    height: "80%",
    borderRadius: 10,
    backgroundColor: "#FFF",
    padding: 20,
  },
  profileItem: {
    width: "100%",
    height: verticalScale(50),
    justifyContent: "center",
    paddingLeft: moderateScale(20),
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
   
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    textAlign: "center",
    marginTop:moderateScale(0),
    marginBottom:moderateScale(10),
    color: "#333", // Dark gray
  },
  subtitle: {
    fontSize: moderateScale(14),
    fontWeight: "bold",
    textAlign: "center",
    color: "#333", // Dark gray
  },
  logo: {
    width: moderateScale(90),
    height: moderateScale(90),
    alignSelf: "center",
    marginBottom: moderateScale(10),
    // tintColor: "#FF6347", // Tomato color
  },
  errmsg: {
    marginLeft: moderateScale(25),
    color: "#FF6347", // Tomato color
    marginTop: moderateScale(10),
  },
});


