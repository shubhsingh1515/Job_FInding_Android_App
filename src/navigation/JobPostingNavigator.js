import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginforCompany from "../screens/jobposting/LoginforCompany";
import SignUpForCompany from "../screens/jobposting/SignUpForCompany";
import DashboardForCompany from "../screens/jobposting/DashboardForCompany";
import AddJob from "../screens/jobposting/Tabs/AddJob";
const STACK = createStackNavigator();
const JobPostingNavigator = () => {
  return (
    <STACK.Navigator>
      <STACK.Screen
        name="LoginForCompany"
        options={{ headerShown: false }}
        component={LoginforCompany}
      />
      <STACK.Screen
        name="SignUpForCompany"
        options={{ headerShown: false }}
        component={SignUpForCompany}
      />
      <STACK.Screen
        name="DashboardForCompany"
        options={{ headerShown: false }}
        component={DashboardForCompany}
      />
      <STACK.Screen
        name="AddJob"
        options={{ headerShown: true }}
        component={AddJob}
      />
    </STACK.Navigator>
  );
};
export default JobPostingNavigator;
