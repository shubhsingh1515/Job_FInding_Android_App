import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  FlatList,
  ScrollView,
} from "react-native";
import NoLoginComp from "../../../common/NoLoginComp";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { moderateScale, scale } from "react-native-size-matters";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import Loader from "../../../common/Loader";

const Profile = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true); // Loading state
  const [ProfileImg, SetProfileImg] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [openSkillModal, setSkillModal] = useState(false);
  const [openExpModal, setExpModal] = useState(false);
  const [openEduModal, setOpenEduModal] = useState(false);
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [openCertificateModal, setOpenCertificateModal] = useState(false);
  const [openLanguageModal, setOpenLanguageModal] = useState(false);
  const [openJobPreferenceModal, setOpenJobPreferenceModal] = useState(false);
  const [skill, setSkill] = useState("");
  const [skillList, setSkillList] = useState([]);
  const [expList, setExpList] = useState([]);
  const [educationList, setEducationList] = useState([]);
  const [company, setCompany] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [profile, setProfile] = useState("");
  const [college, setCollege] = useState("");
  const [startCollegeYear, setStartCollegeYear] = useState("");
  const [endCollegeYear, setEndCollegeYear] = useState("");
  const [course, setCourse] = useState("");
  const [location, setLocation] = useState("");
  const [certificate, setCertificate] = useState("");
  const [CertList, setCertList] = useState([]);
  const [language, setLanguage] = useState("");
  const [LanguageList, setLanguageList] = useState([]);
  const [LocationList, setLocationList] = useState([]);

  const [jobPreference, setJobPreference] = useState("");
  const [JobPreferenceList, setJobPreferenceList] = useState([]);
  const dp = "../../../images/profile.png";

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      await getData();
      await getProfileData();
    };
    if (isFocused) {
      fetchInitialData();
    }
    getPicData();
  }, [isFocused]);

  const getData = async () => {
    const id = await AsyncStorage.getItem("USER_ID");
    const type = await AsyncStorage.getItem("USER_TYPE");
    if (id != null && type != null) {
      if (type === "user") {
        setIsLogin(true);
      }
    }
    setLoading(false);
  };

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

  const getProfileData = async () => {
    const id = await AsyncStorage.getItem("USER_ID");
    if (id) {
      const doc = await firebase.firestore().collection("users").doc(id).get();
      if (doc.exists) {
        setUserData(doc.data());
      }
    }
  };

  const handleAddData = async (
    collectionName,
    data,
    resetFields,
    getFunction
  ) => {
    try {
      const id = await AsyncStorage.getItem("USER_ID");
      await firebase
        .firestore()
        .collection(collectionName)
        .add({
          ...data,
          userId: id,
        });
      Alert.alert(
        `${
          collectionName.charAt(0).toUpperCase() + collectionName.slice(1)
        } Added`
      );
      resetFields();
      getFunction();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  const addSkill = () =>
    handleAddData("skills", { skill }, () => setSkill(""), getSkills);

  const addCertificate = () =>
    handleAddData(
      "certificate",
      { certificate },
      () => setCertificate(""),
      getCertificate
    );

  const addExperience = () =>
    handleAddData(
      "experience",
      { company, startYear, endYear, profile },
      () => {
        setCompany("");
        setStartYear("");
        setEndYear("");
        setProfile("");
      },
      getExperience
    );

  const addEducation = () =>
    handleAddData(
      "education",
      { college, startCollegeYear, endCollegeYear, course },
      () => {
        setCollege("");
        setStartCollegeYear("");
        setEndCollegeYear("");
        setCourse("");
      },
      getEducation
    );
  const addLocation = () =>
    handleAddData("location", { location }, () => setLocation(""), getLocation);

  const addLanguage = () =>
    handleAddData("language", { language }, () => setLanguage(""), getLangauge);

  const addJobPreference = () =>
    handleAddData(
      "jobpreference",
      { jobPreference },
      () => setJobPreference(""),
      getJobPreference
    );

  useEffect(() => {
    const fetchAllData = async () => {
      await getSkills();
      await getExperience();
      await getEducation();
      await getLocation();
      await getCertificate();
      await getLangauge();
      await getJobPreference();
    };
    fetchAllData();
  }, []);

  const fetchCollectionData = async (collectionName, setter) => {
    const id = await AsyncStorage.getItem("USER_ID");
    const snapshot = await firebase
      .firestore()
      .collection(collectionName)
      .where("userId", "==", id)
      .get();
    let temp = [];
    snapshot.docs.forEach((item) => {
      temp.push({ ...item.data(), id: item.id });
    });
    setter(temp);
  };

  const getSkills = () => fetchCollectionData("skills", setSkillList);
  const getCertificate = () => fetchCollectionData("certificate", setCertList);
  const getExperience = () => fetchCollectionData("experience", setExpList);
  const getEducation = () => fetchCollectionData("education", setEducationList);
  const getLocation = () => fetchCollectionData("location", setLocationList);
  const getLangauge = () => fetchCollectionData("language", setLanguageList);
  const getJobPreference = () =>
    fetchCollectionData("jobpreference", setJobPreferenceList);

  const deleteData = async (collectionName, id, getFunction) => {
    await firebase.firestore().collection(collectionName).doc(id).delete();
    getFunction();
  };

  const deleteSkill = (id) => deleteData("skills", id, getSkills);
  const deleteExp = (id) => deleteData("experience", id, getExperience);
  const deleteEdu = (id) => deleteData("education", id, getEducation);
  const deleteCer = (id) => deleteData("certificate", id, getCertificate);
  const deleteLanguage = (id) => deleteData("language", id, getLangauge);
  const deleteLocation = (id) => deleteData("location", id, getLocation);

  const deleteJobPreference = (id) =>
    deleteData("jobpreference", id, getJobPreference);

  const handleSaveProfile = async () => {
    const id = await AsyncStorage.getItem("USER_ID");

    const updateObject = {
      location,
      certificate,
      language,
      jobPreference,
    };

    // Adding skills if there are any
    if (skillList.length > 0) {
      updateObject.skills = skillList;
    }

    // Adding experience if there are any
    if (expList.length > 0) {
      updateObject.experience = expList;
    }

    // Adding education if there are any
    if (educationList.length > 0) {
      updateObject.education = educationList;
    }

    try {
      await firebase
        .firestore()
        .collection("users")
        .doc(id)
        .update(updateObject);
      Alert.alert("Profile Updated");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again later.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {!isLogin && (
        <NoLoginComp
          desc={
            "Manage Your Professional Profile/Portfolio for attracting many jobs"
          }
          heading={"Easy Manage For Profile/Portfolio"}
        />
      )}
      {isLogin && (
        <View style={styles.mainView}>
          <View style={styles.profileHeader}>
            <TouchableOpacity>
              {ProfileImg != undefined ? (
                <Image
                  style={styles.profile}
                  source={{ uri: ProfileImg || dp }}
                ></Image>
              ) : (
                <Image
                  style={styles.profile}
                  source={require("../../../images/profile.png")}
                ></Image>
              )}
            </TouchableOpacity>

            <View style={styles.profileInfo}>
              <Text style={styles.name}>{userData ? userData.name : "NA"}</Text>
              <Text style={styles.email}>
                {userData ? userData.email : "NA"}
              </Text>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => {
                  navigation.navigate("Profile Picture");
                }}
              >
                <Text style={styles.editBtnText}>Change Profile Picture</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Skills Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Skills</Text>
              <Text style={styles.addBtn} onPress={() => setSkillModal(true)}>
                +
              </Text>
            </View>
            <FlatList
              data={skillList}
              renderItem={({ item }) => (
                <View style={styles.skillItem}>
                  <Text style={styles.skillName}>{item.skill}</Text>
                  <TouchableOpacity onPress={() => deleteSkill(item.id)}>
                    <Text style={styles.deleteSkill}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          {/* Experience Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Experience</Text>
              <Text style={styles.addBtn} onPress={() => setExpModal(true)}>
                +
              </Text>
            </View>
            <FlatList
              data={expList}
              renderItem={({ item }) => (
                <View style={styles.skillItem}>
                  <Text style={styles.skillName}>{item.company}</Text>
                  <Text style={styles.skillDetails}>
                    {item.profile} ({item.startYear} - {item.endYear})
                  </Text>
                  <TouchableOpacity onPress={() => deleteExp(item.id)}>
                    <Text style={styles.deleteSkill}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          {/* Education Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Education</Text>
              <Text style={styles.addBtn} onPress={() => setOpenEduModal(true)}>
                +
              </Text>
            </View>
            <FlatList
              data={educationList}
              renderItem={({ item }) => (
                <View style={styles.skillItem}>
                  <Text style={styles.skillName}>{item.college}</Text>
                  <Text style={styles.skillDetails}>
                    {item.course} ({item.startCollegeYear} -{" "}
                    {item.endCollegeYear})
                  </Text>
                  <TouchableOpacity onPress={() => deleteEdu(item.id)}>
                    <Text style={styles.deleteSkill}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          {/* Certificates Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Certificates</Text>
              <Text
                style={styles.addBtn}
                onPress={() => setOpenCertificateModal(true)}
              >
                +
              </Text>
            </View>
            <FlatList
              data={CertList}
              renderItem={({ item }) => (
                <View style={styles.skillItem}>
                  <Text style={styles.skillName}>{item.certificate}</Text>
                  <TouchableOpacity onPress={() => deleteCer(item.id)}>
                    <Text style={styles.deleteSkill}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          {/* Languages Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Languages</Text>
              <Text
                style={styles.addBtn}
                onPress={() => setOpenLanguageModal(true)}
              >
                +
              </Text>
            </View>
            <FlatList
              data={LanguageList}
              renderItem={({ item }) => (
                <View style={styles.skillItem}>
                  <Text style={styles.skillName}>{item.language}</Text>
                  <TouchableOpacity onPress={() => deleteLanguage(item.id)}>
                    <Text style={styles.deleteSkill}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          {/* Location Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Location</Text>
              <Text
                style={styles.addBtn}
                onPress={() => setOpenLocationModal(true)}
              >
                +
              </Text>
            </View>
            <FlatList
              data={LocationList}
              renderItem={({ item }) => (
                <View style={styles.skillItem}>
                  <Text style={styles.skillName}>{item.location}</Text>
                  <TouchableOpacity onPress={() => deleteLocation(item.id)}>
                    <Text style={styles.deleteSkill}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          {/* Job Preferences Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Job Preferences</Text>
              <Text
                style={styles.addBtn}
                onPress={() => setOpenJobPreferenceModal(true)}
              >
                +
              </Text>
            </View>
            <FlatList
              data={JobPreferenceList}
              renderItem={({ item }) => (
                <View style={styles.skillItem}>
                  <Text style={styles.skillName}>{item.jobPreference}</Text>
                  <TouchableOpacity
                    onPress={() => deleteJobPreference(item.id)}
                  >
                    <Text style={styles.deleteSkill}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          {/* Modals for adding data */}
          <Modal isVisible={openSkillModal}>
            <View style={styles.modalContainer}>
              <TextInput
                placeholder="Enter Skill"
                style={styles.modalInput}
                value={skill}
                onChangeText={setSkill}
              />
              <TouchableOpacity style={styles.modalBtn} onPress={addSkill}>
                <Text style={styles.modalBtnText}>Add Skill</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setSkillModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <Modal isVisible={openExpModal}>
            <View style={styles.modalContainer}>
              <TextInput
                placeholder="Company Name"
                style={styles.modalInput}
                value={company}
                onChangeText={setCompany}
              />
              <TextInput
                placeholder="Profile"
                style={styles.modalInput}
                value={profile}
                onChangeText={setProfile}
              />
              <TextInput
                placeholder="Start Year"
                style={styles.modalInput}
                value={startYear}
                onChangeText={setStartYear}
              />
              <TextInput
                placeholder="End Year"
                style={styles.modalInput}
                value={endYear}
                onChangeText={setEndYear}
              />
              <TouchableOpacity style={styles.modalBtn} onPress={addExperience}>
                <Text style={styles.modalBtnText}>Add Experience</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setExpModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <Modal isVisible={openEduModal}>
            <View style={styles.modalContainer}>
              <TextInput
                placeholder="College Name"
                style={styles.modalInput}
                value={college}
                onChangeText={setCollege}
              />
              <TextInput
                placeholder="Course"
                style={styles.modalInput}
                value={course}
                onChangeText={setCourse}
              />
              <TextInput
                placeholder="Start Year"
                style={styles.modalInput}
                value={startCollegeYear}
                onChangeText={setStartCollegeYear}
              />
              <TextInput
                placeholder="End Year"
                style={styles.modalInput}
                value={endCollegeYear}
                onChangeText={setEndCollegeYear}
              />
              <TouchableOpacity style={styles.modalBtn} onPress={addEducation}>
                <Text style={styles.modalBtnText}>Add Education</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setOpenEduModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <Modal isVisible={openCertificateModal}>
            <View style={styles.modalContainer}>
              <TextInput
                placeholder="Enter Certificate"
                style={styles.modalInput}
                value={certificate}
                onChangeText={setCertificate}
              />
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={addCertificate}
              >
                <Text style={styles.modalBtnText}>Add Certificate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setOpenCertificateModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <Modal isVisible={openLocationModal}>
            <View style={styles.modalContainer}>
              <TextInput
                placeholder="Enter Location"
                style={styles.modalInput}
                value={location}
                onChangeText={setLocation}
              />
              <TouchableOpacity style={styles.modalBtn} onPress={addLocation}>
                <Text style={styles.modalBtnText}>Add Location</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setOpenLocationModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <Modal isVisible={openLanguageModal}>
            <View style={styles.modalContainer}>
              <TextInput
                placeholder="Enter Language"
                style={styles.modalInput}
                value={language}
                onChangeText={setLanguage}
              />
              <TouchableOpacity style={styles.modalBtn} onPress={addLanguage}>
                <Text style={styles.modalBtnText}>Add Language</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setOpenLanguageModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <Modal isVisible={openJobPreferenceModal}>
            <View style={styles.modalContainer}>
              <TextInput
                placeholder="Enter Job Preference"
                style={styles.modalInput}
                value={jobPreference}
                onChangeText={setJobPreference}
              />
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={addJobPreference}
              >
                <Text style={styles.modalBtnText}>Add Job Preference</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setOpenJobPreferenceModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  bottomSection: {
    padding: 20,
    alignItems: "center",
    marginTop: 20,
  },
  saveBtn: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  mainView: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
    borderWidth:1.5,
    borderColor:"#9370DB",
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "#888",
  },
  editBtn: {
    marginTop: 10,
    backgroundColor: "#9370DB",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  editBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#F8F8FF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#9370DB",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color:'#9370DB' 
  },
  addBtn: {
    fontSize: 18,
    color: "#9370DB",
  },
  skillItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  skillName: {
    fontSize: 16,
    fontWeight: "bold",
    color:'#2F4F4F'
  },
  skillDetails: {
    fontSize: 14,
    color: "#778899",
  },
  deleteSkill: {
    color: "#FF6347",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#9370DB",
    marginBottom: 15,
    fontSize: 16,
  },
  modalBtn: {
    backgroundColor: "#9370DB",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelBtn: {
    backgroundColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  cancelBtnText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Profile;
