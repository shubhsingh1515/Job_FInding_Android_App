import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  BG_COLOR,
  Text_COLOR,
  ACCENT_COLOR,
  PRIMARY_COLOR,
} from "../../utils/Colors";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { moderateScale } from "react-native-size-matters";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "firebase/compat/app";

const JobDetails = () => {
  const route = useRoute();
  const [issavedJob, SetissavedJob] = useState(false);
  const [isappliedJob, SetisappliedJob] = useState(false);

  const [isLogin, SetisLogin] = useState(false);
  const [savedJobId, SetsavedJobId] = useState("");
  const [appliedJobId, SetappliedJobId] = useState("");

  const navigation = useNavigation();
  const isFoucused = useIsFocused();

  useEffect(() => {
    getdata();
    getsavedjobs();
    getappliedjobs();
  }, [isFoucused]);

  const getdata = async () => {
    try {
      const id = await AsyncStorage.getItem("USER_ID");
      const type = await AsyncStorage.getItem("USER_TYPE");
      if (id && type === "user") {
        SetisLogin(true);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const savejobs = async () => {
    try {
      const id = await AsyncStorage.getItem("USER_ID");
      if (id) {
        const docRef = await firebase
          .firestore()
          .collection("saved_jobs")
          .add({
            ...route.params.data,
            userId: id,
          });
        SetsavedJobId(docRef.id);
        SetissavedJob(true);
        Alert.alert("Success", "Job Saved Successfully");
      }
    } catch (error) {
      console.error("Error saving job:", error);
      Alert.alert("Error", "Failed to save job. Please try again.");
    }
  };

  const getsavedjobs = async () => {
    try {
      const id = await AsyncStorage.getItem("USER_ID");
      if (id) {
        const querySnapshot = await firebase
          .firestore()
          .collection("saved_jobs")
          .where("userId", "==", id)
          .get();
        let found = false;
        querySnapshot.forEach((doc) => {
          if (doc.data().id === route.params.data.id) {
            SetissavedJob(true);
            SetsavedJobId(doc.id); // Set the document ID here
            found = true;
          }
        });
        if (!found) {
          SetissavedJob(false);
          SetsavedJobId("");
        }
      }
    } catch (error) {
      console.error("Error retrieving saved jobs:", error);
      Alert.alert("Error", "Failed to retrieve saved jobs. Please try again.");
    }
  };

  const deleteSavedJob = async () => {
    try {
      if (savedJobId) {
        await firebase
          .firestore()
          .collection("saved_jobs")
          .doc(savedJobId)
          .delete();
        console.log("Saved job deleted successfully");
        SetissavedJob(false);
        SetsavedJobId("");
        Alert.alert("Success", "Saved job deleted successfully");
      } else {
        console.log("No saved job ID to delete");
      }
    } catch (error) {
      console.error("Error deleting saved job:", error);
      Alert.alert("Error", "Failed to delete saved job. Please try again.");
    }
  };

  const applyjob = async () => {
    try {
      const id = await AsyncStorage.getItem("USER_ID");
      if (id) {
        const docRef = await firebase
          .firestore()
          .collection("applied_jobs")
          .add({
            ...route.params.data,
            userId: id,
          });
        getappliedjobs();
        Alert.alert("Success", "Applied Successfully");
      }
    } catch (error) {
      console.error("Error Applied job:", error);
      Alert.alert("Error", "Failed to Applied job. Please try again.");
    }
  };

  const getappliedjobs = async () => {
    try {
      const id = await AsyncStorage.getItem("USER_ID");
      if (id) {
        const querySnapshot = await firebase
          .firestore()
          .collection("applied_jobs")
          .where("userId", "==", id)
          .get();
        let found = false;
        querySnapshot.forEach((doc) => {
          if (doc.data().id === route.params.data.id) {
            SetisappliedJob(true);
            SetappliedJobId(doc.id); // Set the document ID here
            found = true;
          }
        });
        if (!found) {
          SetisappliedJob(false);
          SetappliedJobId("");
        }
      }
    } catch (error) {
      console.error("Error retrieving saved jobs:", error);
      Alert.alert("Error", "Failed to retrieve saved jobs. Please try again.");
    }
  };

  const deleteappliedJob = async (jobId) => {
    const userId = await AsyncStorage.getItem("USER_ID");
    try {
      if (appliedJobId) {
        await firebase
          .firestore()
          .collection("applied_jobs")
          .doc(appliedJobId)
          .delete();
        console.log("Applid job deleted successfully");
        getappliedjobs();
        Alert.alert("Success", "Applied job deleted successfully");
      } else {
        console.log("No applied job ID to delete");
      }
    } catch (error) {
      console.error("Error deleting Applied job:", error);
      Alert.alert("Error", "Failed to delete applied job. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{route.params.data.jobTitle}</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Job Description</Text>
        <Text style={styles.cardContent}>
          {route.params.data.jobDescription}
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Job Category</Text>
        <Text style={styles.cardContent}>{route.params.data.category}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Experience Required</Text>
        <Text style={styles.cardContent}>
          {route.params.data.experience} years
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Company</Text>
        <Text style={styles.cardContent}>{route.params.data.company}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Salary</Text>
        <Text style={styles.cardContent}>{route.params.data.package} LPA</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Skill Required</Text>
        <Text style={styles.cardContent}>{route.params.data.skill}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Location</Text>
        <Text style={styles.cardContent}>{route.params.data.location}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>HR Name</Text>
        <Text style={styles.cardContent}>{route.params.data.posterName}</Text>
      </View>

      <View style={styles.bottomview}>
        <TouchableOpacity
          style={[
            styles.savebtn,
            { borderColor: issavedJob ?  "#9370DB" :  "#9370DB" },
          ]}
          disabled={!isLogin}
          onPress={() => {
            if (issavedJob) {
              deleteSavedJob();
            } else {
              savejobs();
            }
          }}
        >
          <Image
            source={
              issavedJob
                ? require("../../images/saved.png")
                : require("../../images/save.png")
            }
            style={[
              styles.textbtn,
              { tintColor: issavedJob ?  "#9370DB" :  "#9370DB" },
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.applybtn,
            { backgroundColor: isLogin ?  "#9370DB" : "#9e9e9e" },
          ]}
          disabled={!isLogin}
          onPress={() => {
            if (!isappliedJob) {
              applyjob();
            } else {
              deleteappliedJob();
            }
          }}
        >
          <Text style={styles.applytext}>
            {isappliedJob ? "Applied" : "Apply"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default JobDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
    marginBottom: moderateScale(30),
  },
  title: {
    fontSize: moderateScale(30),
    fontWeight: "700",
    textAlign: "center",
    marginBottom: moderateScale(10),
    color:  "#9370DB",
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(10),
    marginLeft: moderateScale(10),
    marginRight: moderateScale(10),
    padding: moderateScale(15),
    marginVertical: moderateScale(10),
    shadowColor: "#9370DB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color:"#8A2BE2",
    marginBottom: moderateScale(5),
  },
  cardContent: {
    fontSize: moderateScale(16),
    fontWeight: "400",
    color: "#2F4F4F",
  },
  bottomview: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: moderateScale(10),
    width: "100%",
  },
  savebtn: {
    width: "45%",
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    borderColor:'#BA55D3',
    justifyContent: "center",
    alignItems: "center",
  },
  textbtn: {
    width: moderateScale(20),
    height: moderateScale(20),
    tintColor:'#BA55D3'
  },
  applybtn: {
    width: "45%",
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(20),

  },
  applytext: {
    fontWeight: "600",
    fontSize: moderateScale(17),
    color: BG_COLOR,
  },
});
