import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { firebase } from "../../../Config";
import { useNavigation } from "@react-navigation/native";

const COLORS = {
  background: "#f5f5f5",
  primary: "#3498db",
  secondary: "#2ecc71",
  textPrimary: "#2c3e50",
  textSecondary: "#8e44ad",
  listBackground: "#ffffff",
  buttonBackground: "#e74c3c",
  buttonText: "#ffffff",
  emptyText: "#95a5a6",
};

const Jobsearch = () => {
  const navigation = useNavigation();
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const searchJob = (txt) => {
    setLoading(true);
    firebase
      .firestore()
      .collection("jobs")
      .where("jobTitle", "==", txt)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          setJobs([]); // clear jobs if no matches
          setLoading(false);
          return;
        }
        const jobsArray = [];
        querySnapshot.forEach((doc) => {
          jobsArray.push({ id: doc.id, ...doc.data() });
        });
        setJobs(jobsArray);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
        setLoading(false);
      });
  };

  const toggleSaveJob = (jobId) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter((id) => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };
  const clearSearch = () => {
    setSearchText("");
    setJobs([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Image
          source={require("../../images/search.png")}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search Job here..."
          style={styles.inp}
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            searchJob(text);
          }}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>X</Text>
          </TouchableOpacity>
        )}
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
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
              <View style={styles.cardHeader}>
                <Text style={styles.jobTitle}>{item.jobTitle}</Text>
              </View>
              <Text style={styles.jobDescription}>{item.jobDescription}</Text>
              <Text style={styles.jobDetails}>
                {"Job Category: " + item.category}
              </Text>
              <Text style={styles.jobDetails}>
                {"Company: " + item.company}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyView}>
              <Text style={styles.emptyText}>No Jobs Available</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Jobsearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  searchBox: {
    width: "90%",
    height: verticalScale(40),
    borderWidth: 0.4,
    marginTop: moderateScale(10),
    alignSelf: "center",
    borderRadius: moderateScale(30),
    borderColor: "#9370DB",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: moderateScale(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIcon: {
    width: moderateScale(17),
    height: moderateScale(17),
    tintColor: "#9370DB",
  },
  inp: {
    flex: 1,
    height: "100%",
    fontSize: moderateScale(16),
    color: COLORS.textPrimary,
    marginLeft: moderateScale(10),
  },
  clearButton: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.4,
    backgroundColor: "black",
  },
  clearButtonText: {
    fontSize: moderateScale(18),
    color: "white",
    fontWeight: "600",
  },
  card: {
    width: "90%",
    padding: moderateScale(15),
    alignSelf: "center",
    backgroundColor: "#F8F8FF",
    marginTop: moderateScale(20),
    marginBottom: moderateScale(30),
    borderRadius: moderateScale(10),
    shadowColor: "#BA55D3",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  jobTitle: {
    fontSize: moderateScale(24),
    color: "#9370DB",
    fontWeight: "bold",
  },
  starIcon: {
    width: moderateScale(24),
    height: moderateScale(24),
    tintColor: COLORS.primary,
  },
  jobDescription: {
    fontSize: moderateScale(18),
    color: "#9370DB",
    marginVertical: moderateScale(5),
  },
  jobDetails: {
    fontSize: moderateScale(17),
    color: "#2F4F4F",
    marginVertical: moderateScale(2),
  },
  emptyView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop:moderateScale(180)
  },
  emptyText: {
    fontSize: moderateScale(18),
    color: COLORS.emptyText,
  },
});
