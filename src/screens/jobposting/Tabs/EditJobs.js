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
import React, { useEffect, useState } from "react";
import CustomTextInput from "../../../common/CustomTextInput";
import { BG_COLOR } from "../../../utils/Colors";
import CustomDropTextInput from "../../../common/CustomDropTextInput";
import CustomSolidButton from "../../../common/CustomSolidButton";
import { FlatList } from "react-native-gesture-handler";
import { profiles } from "../../../utils/Profile";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { firebase } from "../../../../Config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import Loader from "../../../common/Loader";
const EditJob = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [JobTitle, SetJobTitle] = useState(route.params.data.jobTitle);
  const [BadJobTitle, SetBadJobTitle] = useState("");
  const [JobDesc, SetJobDesc] = useState(route.params.data.jobDescription);
  const [badJobDesc, SetBadJobDesc] = useState("");
  const [BadExper, SetBadExper] = useState("");
  const [BadPkg, SetBadPkg] = useState("");
  const [BadComp, SetBadComp] = useState("");
  const [BadSkill, SetBadSkill] = useState("");
  const [BadCateg, SetBadCateg] = useState("");
  const [BadLoc, SetBadLoc] = useState("");

  const [Exper, SetExper] = useState(route.params.data.experience);
  const [Pkg, SetPkg] = useState(route.params.data.package);
  const [Comp, SetComp] = useState(route.params.data.company);
  const [Loc, SetLoc] = useState(route.params.data.location);

  const [Skill, SetSkill] = useState();
  const [Categ, SetCateg] = useState("");
  const [OpenCatM, setOpenCatM] = useState(false);
  const [OpenSkillM, setOpenSkillM] = useState(false);
  const [SelectCAt, setSelectCAt] = useState("Select Category");
  const [SelectSkill, setSelectSkill] = useState("Select Skill");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    profiles.map((item, index) => {
      if (item.category == route.params.data.category) {
        setSelectCAt(index);
        profiles[index].keywords.map((x, y) => {
          if (x[0] == route.params.data.skill) setSelectSkill(x[0]);
        });
      }
    });
  }, []);

  const postJob = async () => {
    let name = await AsyncStorage.getItem("NAME");
    let email = await AsyncStorage.getItem("EMAIL");

    setLoading(true);
    firebase
      .firestore()
      .collection("jobs")
      .doc(route.params.data.id)
      .update({
        posterEmail: email,
        posterName: name,
        jobTitle: JobTitle,
        jobDescription: JobDesc,
        experience: Exper,
        package: Pkg,
        company: Comp,
        category: profiles[SelectCAt].category,
        skill: SelectSkill,
        location: Loc,
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
          <Text style={styles.title1}>Edit Job</Text>
          <Text style={styles.subtitle}>Update your job details</Text>
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
        style={styles.cat}
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
          error={BadLoc != "" ? true : false}
        />
        {BadLoc != "" && <Text style={styles.errmsg}>{BadLoc}</Text>}

        <CustomSolidButton
          title={"Edit Job "}
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

export default EditJob;

const styles = StyleSheet.create({
  container: {
    backgroundColor: BG_COLOR,
    flex: 1,
  },
  title1: {
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
  mainView: {
    backgroundColor: "rgba(0,0,0.3)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  listing: {
    width: "90%",
    height: "80%",
    borderRadius: 10,
    backgroundColor: BG_COLOR,
  },
  profileItem: {
    width: "90%",
    height: verticalScale(40),
    justifyContent: "center",
    paddingLeft: 20,
    paddingTop: 10,
    alignSelf: "center",
    borderBottomWidth: 0.5,
  },
  title: {
    fontSize: moderateScale(20),
    marginLeft: moderateScale(20),
    marginTop: 20,
    fontWeight: "600",
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginTop: 10,
  },
  errmsg: {
    marginLeft: 25,
    color: "red",
  },
  cat:{
    borderColor:'red'
  }
});
