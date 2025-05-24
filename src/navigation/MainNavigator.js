import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import JobPostingNavigator from "./JobPostingNavigator";
import JobSearchingNavigator from "./JobSearchingNavigator";
import SelectUser from "../screens/onboarding/SelectUser";
import Splash from "../screens/onboarding/Splash";
import DashboardForCompany from "../screens/jobposting/DashboardForCompany";
import AddJob from '../screens/jobposting/Tabs/AddJob'
import EditJob from "../screens/jobposting/Tabs/EditJobs";
import UpdateProfile from "../screens/jobposting/UpdateProfile";
import ChangeProfilePicComp from "../screens/jobposting/ChangeProfilePicComp";
import main from "../screens/jobSeraching/Main1";
import ChangePic from "../screens/jobSeraching/ChangePic";
import ContactUs from "../screens/jobSeraching/ContactUs";
import AboutUs from "../screens/jobSeraching/AboutUs";
import ChatScreen from "../screens/jobSeraching/ChatScreen";
import SearchC from "../screens/jobposting/Tabs/SearchC";
import UserProfile from "../screens/jobposting/UserProfile";
const STACK = createStackNavigator()
const MainNavigator=()=> {
  return (
    <NavigationContainer>
      <STACK.Navigator>
      <STACK.Screen
          name='Splash'
          component={Splash}
          options={{ headerShown: false }}
        />
      <STACK.Screen
          name='SelectUser'
          component={SelectUser}
          options={{ headerShown: false }}
        />
        <STACK.Screen
          name='Search Company'
          component={SearchC}
          options={{ headerShown: true }}
        />
        <STACK.Screen
          name='JobPostingNavigator'
          component={JobPostingNavigator}
          options={{ headerShown: false }}
        />
          <STACK.Screen
          name='ChatScreen'
          component={ChatScreen}
          options={{ headerShown: false }}
        />
        <STACK.Screen
          name='JobSearchingNavigator'
          component={JobSearchingNavigator}
          options={{ headerShown: false }}
        />
         <STACK.Screen
          name='Change Profile Picture'
          component={ChangeProfilePicComp}
          options={{ headerShown: true }}
        />
          <STACK.Screen
          name='User Profile'
          component={UserProfile}
          options={{ headerShown: true }}
        />
         <STACK.Screen
          name='Profile Picture'
          component={ChangePic}
          options={{ headerShown: true }}
        />
          <STACK.Screen
          name='Contact Us'
          component={ContactUs}
          options={{ headerShown: true }}
        />
         <STACK.Screen
          name='About Us'
          component={AboutUs}
          options={{ headerShown: true }}
        />
         <STACK.Screen
          name='Update Profile'
          component={UpdateProfile}
          options={{ headerShown: true }}
        />
         <STACK.Screen
          name='DashboardForCompany'
          component={DashboardForCompany}
          options={{ headerShown: false }}
        />
        <STACK.Screen
        name="AddJob"
        component={AddJob}
        options={{ headerShown: true }}
      />
       <STACK.Screen
        name="EditJob"
        options={{ headerShown: true }}
        component={EditJob}
      />
      </STACK.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigator;
