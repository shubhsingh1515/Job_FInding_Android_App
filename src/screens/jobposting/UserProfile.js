import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useIsFocused, useRoute } from "@react-navigation/native";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { moderateScale } from "react-native-size-matters";
import Loader from "../../common/Loader";

const Profile = () => {
  const isFocused = useIsFocused();
  const route = useRoute();
  const { userId } = route.params;
  const [ProfileImg, SetProfileImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [skillList, setSkillList] = useState([]);
  const [expList, setExpList] = useState([]);
  const [educationList, setEducationList] = useState([]);
  const [CertList, setCertList] = useState([]);
  const [LanguageList, setLanguageList] = useState([]);
  const [LocationList, setLocationList] = useState([]);
  const [JobPreferenceList, setJobPreferenceList] = useState([]);
  const dp ="../../images/profile.png";

  useEffect(() => {
    const fetchInitialData = async () => {
      await getProfileData();
    };
    if (isFocused) {
      fetchInitialData();
    }
    getPicData();
  }, [isFocused]);

  const getPicData = async () => {
    firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          SetProfileImg(doc.data().profileImage);
        }
      });
  };

  const getProfileData = async () => {
    if (userId) {
      setLoading(true);
      const doc = await firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .get();
      if (doc.exists) {
        setUserData(doc.data());
      }
    }
    setLoading(false);
  };

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
    const snapshot = await firebase
      .firestore()
      .collection(collectionName)
      .where("userId", "==", userId)
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

  const renderSectionHeader = (title) => (
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  );

  const renderItem = ({ item, section }) => (
    <View style={styles.skillItem}>
      <Text style={styles.skillName}>
        {item.skill ||
          item.company ||
          item.college ||
          item.certificate ||
          item.language ||
          item.location ||
          item.jobPreference}
      </Text>
      {item.profile && (
        <Text style={styles.skillDetails}>
          {item.profile} ({item.startYear} - {item.endYear})
        </Text>
      )}
      {item.course && (
        <Text style={styles.skillDetails}>
          {item.course} ({item.startCollegeYear} - {item.endCollegeYear})
        </Text>
      )}
    </View>
  );

  const sections = [
    { title: "Skills", data: skillList },
    { title: "Experience", data: expList },
    { title: "Education", data: educationList },
    { title: "Certificates", data: CertList },
    { title: "Languages", data: LanguageList },
    { title: "Location", data: LocationList },
    { title: "Job Preferences", data: JobPreferenceList },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sections}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {renderSectionHeader(item.title)}
            <FlatList
              data={item.data}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.mainView}>
            <View style={styles.profileHeader}>
              <Image style={styles.profile} source={{ uri: ProfileImg || dp  }} />
              <View style={styles.profileInfo}>
                <Text style={styles.name}>
                  {userData ? userData.name : "NA"}
                </Text>
                <Text style={styles.email}>
                  {userData ? userData.email : "NA"}
                </Text>
              </View>
            </View>
          </View>
        }
      />
      <Loader visible={loading} />
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0FFFF",
  },
  mainView: {
    padding: 10,
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
  card: {
    backgroundColor: "#F5FFFA",
    borderRadius: 10,
    padding: 10,
    marginLeft: moderateScale(10),
    marginBottom: moderateScale(15),
    marginRight: moderateScale(10),
    shadowColor: "#20B2AA",
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
    color: "#00CED1",
  },
  skillItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  skillName: {
    fontSize: 16,
    fontWeight: "500",
  },
  skillDetails: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
});
