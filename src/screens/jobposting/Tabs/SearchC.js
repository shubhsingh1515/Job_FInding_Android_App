import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebase } from "../../../../Config";

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
  cardBackground: "#ffeaa7",
  cardBorder: "#fdcb6e",
  cardShadow: "#d63031",
  titleText: "#e17055",
  descriptionText: "#6c5ce7",
  detailText: "#00b894",
};

const SearchC = () => {
  const navigation = useNavigation();
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const searchJob = async (txt) => {
    setLoading(true);
    const email = await AsyncStorage.getItem("EMAIL");
    firebase
      .firestore()
      .collection("jobs")
      .where("jobTitle", "==", txt)
      .where("posterEmail", "==", email)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          console.log("No matching documents.");
          setJobs([]);
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
          source={require("../../../images/search.png")}
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
            <TouchableOpacity style={styles.list} onPress={() => {}}>
              <View style={styles.topview}>
                <Text style={styles.listText}>{item.jobTitle}</Text>
              </View>
              <Text style={styles.jobDescription}>{item.jobDescription}</Text>
              <Text style={styles.jobDetails}>
                {"Job Category: " + item.category}
              </Text>
             
              <View style={styles.bottomView}>
                <TouchableOpacity
                  style={styles.editbtn}
                  onPress={() => {
                    navigation.navigate("EditJob", { data: item });
                  }}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default SearchC;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0FFFF",
  },
  searchBox: {
    width: "90%",
    height: verticalScale(40),
    borderWidth: 0.4,
    marginTop: moderateScale(50),
    alignSelf: "center",
    borderRadius: moderateScale(30),
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
    tintColor: "gray",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    width: "90%",
    padding: moderateScale(15),
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    marginTop: moderateScale(20),
    marginBottom: moderateScale(20),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: "#20B2AA",
    shadowColor: "#20B2AA",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  listText: {
    fontSize: moderateScale(25),
    color: "green",
    flex: 1,
    fontWeight: "600",
  },
  topview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(10),
  },
  staricon: {
    width: moderateScale(24),
    height: moderateScale(24),
    tintColor: COLORS.primary,
  },
  jobDescription: {
    fontSize: moderateScale(19),
    color: "black",
  },
  jobDetails: {
    fontSize: moderateScale(16),
    color: "#708090",
    marginVertical: moderateScale(2),
  },
  bottomView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: moderateScale(20),
    alignItems: "center",
  },
  editbtn: {
    width: "50%",
    height: moderateScale(40),
    backgroundColor: "#20B2AA",
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.buttonText,
    fontSize: moderateScale(16),
  },
  emptyView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
