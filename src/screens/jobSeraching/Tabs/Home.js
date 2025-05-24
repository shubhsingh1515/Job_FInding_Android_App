import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Text_COLOR } from "../../../utils/Colors";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebase } from "../../../../Config"; // Make sure to import your firebase config
import Loader from "../../../common/Loader"; // Import the Loader component

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
  inputBorder: "#bdc3c7",
  inputBackground: "#ecf0f1",
  searchBoxBorder: "#9e9e9e",
  gray: "gray",
};

const Home = () => {
  const [isLogin, SetisLogin] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    getdata();
    fetchJobs();
  }, [isFocused]);

  const getdata = async () => {
    const id = await AsyncStorage.getItem("USER_ID");
    const type = await AsyncStorage.getItem("USER_TYPE");
    if (id != null && type != null) {
      if (type == "user") {
        SetisLogin(true);
      }
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const querySnapshot = await firebase.firestore().collection("jobs").get();
      const jobsArray = [];
      querySnapshot.forEach((doc) => {
        jobsArray.push({ id: doc.id, ...doc.data() });
      });
      setJobs(jobsArray);
    } catch (error) {
      console.error("Error fetching jobs: ", error);
    }
    setLoading(false);
  };

  const renderJobItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        navigation.navigate("Jobdetails", { data: item });
      }}
    >
      <Text style={styles.jobTitle}>{item.jobTitle}</Text>
      <Text style={styles.jobDescription}>{item.jobDescription}</Text>
      <Text style={styles.label}>Category: {item.category} </Text>
      <Text style={styles.jobDetails}>
        <Text style={styles.label}>Company: </Text>
        {item.company}
      </Text>
      <Text style={styles.jobDetails}>
        <Text style={styles.label}>Location: </Text>
        {item.location}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to Job Genie</Text>
      <Text style={styles.welcomeSubText}>
        Explore the latest job opportunities
      </Text>
      {!isLogin && (
        <View>
          <Text style={styles.subhead}>
            You are one step away from getting a good job
          </Text>
          <View style={styles.notes}>
            <Image
              source={require("../../../images/star.png")}
              style={styles.star}
            />
            <Text style={styles.subtitle}>
              Get Jobs after creating account{" "}
            </Text>
          </View>
          <View style={styles.notes}>
            <Image
              source={require("../../../images/star.png")}
              style={styles.star}
            />
            <Text style={styles.subtitle}>
              Explore your job preference role
            </Text>
          </View>
          <View style={styles.btnView}>
            <TouchableOpacity
              style={styles.loginbtn}
              onPress={() => navigation.navigate("LoginForUser")}
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.signupbtn}
              onPress={() => navigation.navigate("SignUpForUser")}
            >
              <Text style={[styles.loginText, { color: COLORS.Text_COLOR }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {loading ? (
        <Loader />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={renderJobItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={() => (
            <View style={styles.emptyview}>
              <Text style={styles.emptyText}>No Jobs Available</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(10),
    backgroundColor: "#FFFFFF",
  },
  welcomeText: {
    fontSize: moderateScale(28),
    color: "#2F4F4F",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: verticalScale(20),
  },
  welcomeSubText: {
    fontSize: moderateScale(18),
    color: "#808080",
    textAlign: "center",
    marginVertical: verticalScale(10),
  },
  subhead: {
    fontWeight: "600",
    fontSize: moderateScale(21),
    alignSelf: "center",
    width: "90%",
    marginTop: moderateScale(20),
    color: "#2F4F4F",
    textAlign: "center",
  },
  notes: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    marginTop: moderateScale(10),
    alignItems: "center",
  },
  star: {
    width: moderateScale(15),
    height: moderateScale(15),
  },
  subtitle: {
    marginLeft: moderateScale(10),
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#808080",
  },
  btnView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: moderateScale(35),
    marginBottom: moderateScale(35),
  },
  loginbtn: {
    width: "40%",
    height: verticalScale(40),
    backgroundColor: "#9370DB",
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signupbtn: {
    width: "40%",
    height: verticalScale(40),
    borderColor: "#9370DB",
    borderWidth: 1,
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // elevation: 5,
  },
  loginText: {
    color: "#FFF",
    fontWeight: "500",
  },
  listContainer: {
    padding: moderateScale(10),
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: moderateScale(10),
    padding: moderateScale(15),
    marginVertical: moderateScale(10),
    shadowColor: "#7B68EE",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: "#9370DB",
  },
  jobTitle: {
    fontSize: moderateScale(24),
    color: "#9370DB",
    fontWeight: "bold",
  },
  jobDescription: {
    fontSize: moderateScale(20),
    color: "#778899",
    marginVertical: moderateScale(5),
  },
  jobDetails: {
    fontSize: moderateScale(17),
    color: "#2F4F4F",
    marginVertical: moderateScale(2),
  },
  label: {
    fontWeight: "bold",
    color: "#2F4F4F",
    fontSize: moderateScale(18),
  },
  emptyview: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: moderateScale(18),
    color: "#666",
  },
});
