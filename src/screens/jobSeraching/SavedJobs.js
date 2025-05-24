import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  BG_COLOR,
  Text_COLOR,
  PRIMARY_COLOR,
  ACCENT_COLOR,
} from "../../utils/Colors";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { firebase } from "../../../Config";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NoLoginComp from "../../common/NoLoginComp";

const COLORS = {
  background: "#ffffff",
  primary: "#3498db",
  secondary: "#2ecc71",
  textPrimary: "#2c3e50",
  textSecondary: "#8e44ad",
  listBackground: "#ecf0f1",
  buttonBackground: "#e74c3c",
  buttonText: "#ffffff",
  emptyText: "#95a5a6",
};

// Example fonts, ensure these fonts are available in your project
const FONTS = {
  regular: "Roboto-Regular",
  bold: "Roboto-Bold",
  italic: "Roboto-Italic",
};
const SavedJobs = () => {
  const navigation = useNavigation();
  const [jobs, setJobs] = useState([]);
  const [savedid, Setsavedid] = useState("");
  const [islogin, setislogin] = useState(false);

  useEffect(() => {
    getJobs();
  }, []); // Dependency array should be empty since we only want to run this once

  const getJobs = async () => {
    const id = await AsyncStorage.getItem("USER_ID");
    const type = await AsyncStorage.getItem("USER_TYPE");

    firebase
      .firestore()
      .collection("saved_jobs")
      .where("userId", "==", id)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          console.log("No matching documents.");
          setJobs([]); // clear jobs if no matches
          return;
        }
        const jobsArray = [];
        querySnapshot.forEach((doc) => {
          jobsArray.push({ id: doc.id, ...doc.data() });
          if (type == "user") setislogin(true);
          Setsavedid(doc.id);
        });
        setJobs(jobsArray);
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
      });
  };

  const deleteSavedJob = async () => {
    try {
      if (savedid) {
        await firebase
          .firestore()
          .collection("saved_jobs")
          .doc(savedid)
          .delete();
        console.log("Saved job deleted successfully");
        getJobs();
        Alert.alert("Success", "Saved job deleted successfully");
      } else {
        console.log("No saved job ID to delete");
      }
    } catch (error) {
      console.error("Error deleting saved job:", error);
      Alert.alert("Error", "Failed to delete saved job. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {!islogin && (
        <NoLoginComp
          heading={"Easy Manage Your Saved Jobs"}
          desc={"Manage Your Saved Jobs For Future Plans"}
        />
      )}
      {jobs.length > 0 ? (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.list}
              onPress={() => {
                navigation.navigate("Jobdetails", { data: item });
              }}
            >
              <View style={styles.card}>
                <View style={styles.topview}>
                  <Text style={styles.listText}>{item.jobTitle}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      deleteSavedJob();
                    }}
                  >
                    <Image
                      source={require("../../images/saved.png")}
                      style={styles.staricon}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.cardContent}>{item.jobDescription}</Text>
                <Text style={styles.cardDetail}>
                  {"Job Category: " + item.category}
                </Text>
                <Text style={styles.cardDetail}>
                  {"Company: " + item.company}
                </Text>
                <Text style={styles.cardDetail}>
                  {"Posted By: " + item.posterName}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyview}>
          <Text style={styles.listText}>{!islogin ?"":"No Jobs Applied"}</Text>
        </View>
      )}
    </View>
  );
};
export default SavedJobs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
    padding: moderateScale(10),
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
  listText: {
    fontSize: moderateScale(22),
    color: "#9370DB",
    fontWeight: "bold",
  },
  cardContent: {
    fontSize: moderateScale(16),
    color: "#708090",
    marginTop: moderateScale(10),
  },
  cardDetail: {
    fontSize: moderateScale(14),
    color: "#708090",
    fontWeight: "bold",
    marginTop: moderateScale(5),
  },
  topview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  staricon: {
    width: moderateScale(26),
    height: moderateScale(26),
    tintColor: "#9370DB",
  },
  emptyview: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: moderateScale(20),
    color: COLORS.emptyText,
    fontFamily: FONTS.regular,
  },
});
