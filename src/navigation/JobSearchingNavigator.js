import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Main1 from "../screens/jobSeraching/Main1";
import Jobsearch from "../screens/jobSeraching/Jobsearch";
import Jobdetails from "../screens/jobSeraching/Jobdetails";
import LoginForUser from "../screens/jobSeraching/LoginForUser";
import SignUpForUser from "../screens/jobSeraching/SignUpForUser";
import SavedJobs from "../screens/jobSeraching/SavedJobs";
const Stack = createStackNavigator();
export default function JobSearchingNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main1"
        component={Main1}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Jobsearch"
        component={Jobsearch}
        options={{ headerShown: true, title: "Job Search" }}
      />
      <Stack.Screen
        name="Jobdetails"
        component={Jobdetails}
        options={{ headerShown: true, title: "Job Details" }}
      />
      <Stack.Screen
        name="LoginForUser"
        component={LoginForUser}
        options={{ headerShown: true, title: "Login" }}
      />
      <Stack.Screen
        name="SignUpForUser"
        component={SignUpForUser}
        options={{ headerShown: true, title: "SignUp" }}
      />

      <Stack.Screen
        name="SavedJobs"
        component={SavedJobs}
        options={{ headerShown: true, title: "SavedJobs" }}
      />
    </Stack.Navigator>
  );
}
