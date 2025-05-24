import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BG_COLOR, Text_COLOR } from "../../../utils/Colors";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { firebase } from "../../../../Config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import Loader from "../../../common/Loader";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
const MyJobs = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [loading, SetLoading] = useState(false);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getJobs();
  }, [isFocused]);

  const getJobs = async () => {
    let name = await AsyncStorage.getItem("NAME");
    if (name == null) navigation.navigate("SelectUser");
    SetLoading(true);
    let email = await AsyncStorage.getItem("EMAIL");
    firebase
      .firestore()
      .collection("jobs")
      .where("posterEmail", "==", email)
      .get()
      .then(async (data) => {
        SetLoading(false);
        let temp = [];
        data.docs.forEach((item) => {
          temp.push({ ...item.data(), id: item.id });
        });
        await AsyncStorage.setItem("JOBS", temp.length + "");
        setJobs(temp);
      });
  };

  const deltJob = (id) => {
    firebase
      .firestore()
      .collection("jobs")
      .doc(id)
      .delete()
      .then(() => {
        getJobs();
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Job Genie</Text>
      {loading && (
        <View>
          <FlatList
            data={[1, 2, 3]}
            renderItem={({ item, index }) => {
              return (
                <View style={styles.jobitem}>
                  <ShimmerPlaceHolder style={styles.title} />
                  <ShimmerPlaceHolder style={styles.desc} />
                  <ShimmerPlaceHolder style={styles.salary} />
                  <ShimmerPlaceHolder style={styles.label} />
                  <ShimmerPlaceHolder style={styles.label} />
                  <ShimmerPlaceHolder style={styles.label} />
                  <ShimmerPlaceHolder style={styles.label} />

                  <View style={styles.bottomView}>
                    <ShimmerPlaceHolder style={styles.editbtnl} />
                    <ShimmerPlaceHolder style={styles.dltbtnl} />
                  </View>
                </View>
              );
            }}
          />
        </View>
      )}

      {jobs.length > 0 ? (
        <FlatList
          data={jobs}
          renderItem={({ item, index }) => {
            return (
              <View style={styles.jobitem}>
                <Text style={styles.title}>{item.jobTitle}</Text>
                <Text style={styles.desc}>{item.jobDescription}</Text>
                <Text style={styles.salary}>
                  <Text style={styles.label}>Category: </Text>
                  {item.category}
                </Text>
                <Text style={styles.salary}>
                  <Text style={styles.label}>Company: </Text>
                  {item.company}
                </Text>
                <Text style={styles.salary}>
                  <Text style={styles.label}>Location: </Text>
                  {item.location}
                </Text>
                <Text style={styles.salary}>
                  <Text style={styles.label}>Experience: </Text>
                  {item.experience} year(s)
                </Text>
                <Text style={styles.salary}>
                  <Text style={styles.label}>Skills: </Text>
                  {item.skill}
                </Text>
                <Text style={styles.salary}>
                  <Text style={styles.label}>Package: </Text>
                  {item.package} L/year
                </Text>
                <View style={styles.bottomView}>
                  <TouchableOpacity
                    style={styles.editbtn}
                    onPress={() => {
                      navigation.navigate("EditJob", { data: item });
                    }}
                  >
                    <Text style={{ color: "white" }}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dltbtn}
                    onPress={() => {
                      deltJob(item.id);
                    }}
                  >
                    <Text style={{ color: "white" }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      ) : (
        <View style={styles.emptyView}>
          <Text style={styles.title}>No Jobs Available</Text>
        </View>
      )}
      <Loader visible={loading} />
    </View>
  );
};

export default MyJobs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(0),
    backgroundColor: "#E0FFFF",
  },
  heading: {
    fontSize: moderateScale(28),
    fontWeight: "700",
    color: "black",
    marginVertical: moderateScale(20),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: moderateScale(20),
  },
  logo: {
    width: moderateScale(30),
    height: moderateScale(30),
    marginLeft: moderateScale(10),
  },
  jobitem: {
    width: "90%",
    marginTop: moderateScale(20),
    marginBottom: moderateScale(10),
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(10),
    marginLeft: "5%",
    padding: moderateScale(15),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: "#20B2AA",
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  desc: {
    fontSize: moderateScale(16),
    fontWeight: "400",
    marginTop: moderateScale(10),
    color: "#666",
    textAlign: "justify",
  },
  salary: {
    fontSize: moderateScale(15),
    fontWeight: "500",
    marginTop: moderateScale(5),
    color: "#444",
  },
  label: {
    fontWeight: "bold",
    color: "#000",
  },
  bottomView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: moderateScale(20),
    alignItems: "center",
  },
  editbtn: {
    width: "45%",
    height: moderateScale(40),
    backgroundColor: "#20B2AA",
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  dltbtn: {
    width: "45%",
    height: moderateScale(40),
    backgroundColor: "#F44336",
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  emptyView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  editbtnl: {
    width: "45%",
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  dltbtnl: {
    width: "45%",
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
});
