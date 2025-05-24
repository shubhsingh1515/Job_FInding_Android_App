import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import { firebase } from "../../../../Config";
import Loader from "../../../common/Loader";
import { FlatList } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { moderateScale } from "react-native-size-matters";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const Notify = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const jobsSnapshot = await firebase
          .firestore()
          .collection("applied_jobs")
          .get();
        const jobs = jobsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const usersSnapshot = await firebase
          .firestore()
          .collection("users")
          .get();
        const users = usersSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data();
          return acc;
        }, {});

        const jobsWithUserDetails = jobs.map((job) => ({
          ...job,
          user: users[job.userId],
        }));

        setAppliedJobs(jobsWithUserDetails);
      } catch (error) {
        console.error("Error fetching applied jobs: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  const handleCardPress = (userId) => {
    navigation.navigate("User Profile", { userId });
  };

  return (
    <ScrollView>

  
    <FlatList
      contentContainerStyle={styles.container}
      data={loading ? Array.from({ length: 6 }) : appliedJobs}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) =>
        loading ? (
          <View style={styles.card}>
            <ShimmerPlaceHolder style={styles.title} />
            <ShimmerPlaceHolder style={styles.category} />
            <ShimmerPlaceHolder style={styles.description} />
            <ShimmerPlaceHolder style={styles.category} />
            <ShimmerPlaceHolder style={styles.description} />
            <ShimmerPlaceHolder style={styles.category} />
            <ShimmerPlaceHolder style={styles.description} />
          </View>
        ) : (
          <TouchableOpacity
            key={index}
            onPress={() => handleCardPress(item.userId)}
          >
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.title}>{item.jobTitle}</Text>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.description}>{item.jobDescription}</Text>
                <Text style={styles.appliedText}>User applied to this job:</Text>
                <Text style={styles.userName}>{item.user?.name}</Text>
                <Text style={styles.userEmail}>{item.user?.email}</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )
      }
      ListHeaderComponent={
        <Text style={styles.heading}>Application Form</Text>
      }
      ListFooterComponent={<Loader visible={loading} />}
    />
      </ScrollView>
  );
};
export default Notify;

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: "#E0FFFF",
    padding: moderateScale(10),
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop:moderateScale(20),
    marginLeft:moderateScale(10),

  },
  card: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ddd",
    height: moderateScale(160),
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    width: '80%',
    marginLeft: moderateScale(10),
  },
  category: {
    fontSize: 14,
    color: "#888",
    marginBottom: 6,
    marginLeft: moderateScale(10),
  },
  description: {
    fontSize: 16,
    marginBottom: 6,
    marginLeft: moderateScale(10),
  },
  appliedText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
    marginLeft: moderateScale(10),
  },
  userName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "green",
    marginLeft: moderateScale(10),
  },
  userEmail: {
    fontSize: 14,
    color: "green",
    marginLeft: moderateScale(10),
  },
});


