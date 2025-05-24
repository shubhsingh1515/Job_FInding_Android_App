import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import NoLoginComp from "../../../common/NoLoginComp";
import { FlatList } from "react-native-gesture-handler";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebase } from "../../../../Config";
import { moderateScale } from "react-native-size-matters";
import Loader from "../../../common/Loader"; // Import Loader component

const COLORS = {
  background: "#f5f5f5",
  primary: "#3498db",
  secondary: "#2ecc71",
  textPrimary: "#2c3e50",
  textSecondary: "#8e44ad",
  listBackground: "#ecf0f1",
  buttonBackground: "#e74c3c",
  buttonText: "#ffffff",
  emptyText: "#95a5a6",
  cardBorder: "#bdc3c7",
  jobTitle: "#34495e",
  jobDescription: "#7f8c8d",
  company: "#27ae60",
  posterName: "#2980b9",
  category: "#8e44ad",
};

const Apply = () => {
  const [isLogin, SetisLogin] = useState(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    getdata();
  }, [isFocused]);

  const getdata = async () => {
    const id = await AsyncStorage.getItem("USER_ID");
    const type = await AsyncStorage.getItem("USER_TYPE");
    if (id != null && type != null) {
      if (type === "user") {
        SetisLogin(true);
      }
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  const getJobs = async () => {
    setLoading(true); // Start loading
    const id = await AsyncStorage.getItem("USER_ID");

    firebase
      .firestore()
      .collection("applied_jobs")
      .where("userId", "==", id)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          setJobs([]); // Clear jobs if no matches
          setLoading(false); // End loading
          return;
        }
        const jobsArray = [];
        querySnapshot.forEach((doc) => {
          jobsArray.push({ id: doc.id, ...doc.data() });
        });
        setJobs(jobsArray);
        setLoading(false); // End loading
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
        setLoading(false); // End loading
      });
  };

  const deleteSavedJob = async (jobId) => {
    const userId = await AsyncStorage.getItem("USER_ID");

    try {
      if (jobId && userId) {
        await firebase
          .firestore()
          .collection("applied_jobs")
          .doc(jobId)
          .delete();
        console.log("Applied job deleted successfully");
        getJobs();
        Alert.alert("Success", "Applied job deleted successfully");
      } else {
        console.log("No Applied job ID to delete");
      }
    } catch (error) {
      console.error("Error deleting saved job:", error);
      Alert.alert("Error", "Failed to delete saved job. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {!isLogin && (
        <NoLoginComp
          heading={"One place to track your Application"}
          desc={
            "Track all your jobs which you applied but for that you need to create an account first"
          }
        />
      )}
      {isLogin && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Here you can track all the jobs you have applied
          </Text>
        </View>
      )}
      {isLogin && loading ? (
        <Loader /> // Show loader while loading
      ) : jobs.length > 0 ? (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                navigation.navigate("Jobdetails", { data: item });
              }}
            >
              <View style={styles.topview}>
                <Text style={styles.jobTitle}>{item.jobTitle}</Text>
                {/* <TouchableOpacity
                  onPress={() => {
                    deleteSavedJob(item.id);
                  }}
                >
                  <Image
                    source={require("../../../images/saved.png")}
                    style={styles.deleteIcon}
                  />
                </TouchableOpacity> */}
              </View>
              <Text style={styles.jobDescription}>{item.jobDescription}</Text>
              <Text style={styles.jobDetails}>
                <Text style={styles.label}>Job Category: </Text>
                <Text style={styles.category}>{item.category}</Text>
              </Text>
              <Text style={styles.jobDetails}>
                <Text style={styles.label}>Company: </Text>
                <Text style={styles.company}>{item.company}</Text>
              </Text>
              <Text style={styles.jobDetails}>
                <Text style={styles.label}>Location: </Text>
                <Text style={styles.posterName}>{item.location}</Text>
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyview}>
          {isLogin && <Text style={styles.emptyText}>No Jobs Applied</Text>}
        </View>
      )}
    </View>
  );
};

export default Apply;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  infoBox: {
     marginTop: moderateScale(20),
  },
  infoText: {
    fontSize: moderateScale(22),
    color: "#2F4F4F",
    textAlign: "center",
    marginBottom: moderateScale(10),
  },
  card: {
    backgroundColor: "white",
    borderRadius: moderateScale(10),
    padding: moderateScale(15),
    marginLeft:moderateScale(10),
    marginRight:moderateScale(10),
    marginVertical: moderateScale(10),
    shadowColor: "#9370DB",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: "#C0C0C0",
    borderWidth: 1,
  },
  topview: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(10),
  },
  deleteIcon: {
    width: moderateScale(20),
    height: moderateScale(20),
  },
  jobTitle: {
    fontSize: moderateScale(20),
    color: "#9370DB",
    fontWeight: "bold",
  },
  jobDescription: {
    fontSize: moderateScale(16),
    color: "#696969",
    fontWeight:'500'
  },
  jobDetails: {
    fontSize: moderateScale(14),
    color: "#696969",
    marginVertical: moderateScale(2),
  },
  label: {
    fontWeight: "bold",
    color: "#2F4F4F",
  },
  category: {
    color:"#708090",
  },
  company: {
    color:"#708090",
  },
  posterName: {
    color:"#708090",
  },
  emptyview: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: moderateScale(20),
    color: COLORS.emptyText,
  },
});
