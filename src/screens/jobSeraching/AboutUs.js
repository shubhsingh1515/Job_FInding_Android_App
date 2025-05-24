import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';
// import { COLORS, FONTS } from '../../utils/Colors';

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
    inputBorder: "#bdc3c7",
    inputBackground: "#ecf0f1",
    searchBoxBorder: "#9e9e9e",
    gray: "gray",
  };
  
 const FONTS = {
    regular: "Roboto-Regular",
    bold: "Roboto-Bold",
    italic: "Roboto-Italic",
  };

const AboutUs = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
       
        <Text style={styles.heading}>About Us</Text>
        <Text style={styles.description}>
          Welcome to our app! We are dedicated to providing the best job
          opportunities for you. Our mission is to connect job seekers with
          employers in the most efficient way possible. We believe in
          transparency, trust, and building a community where everyone can
          thrive.
        </Text>
        <Text style={styles.description}>
          Our platform offers a wide range of features to help you in your job
          search, including personalized job recommendations, saved job lists,
          and much more. Join us today and take the next step in your career!
        </Text>
        <Text style={styles.heading}>Our Team</Text>
        <Text style={styles.description}>
          Our team is comprised of industry professionals with years of
          experience in recruitment and technology. We are passionate about
          helping you succeed and are constantly working to improve our
          services.
        </Text>
        <Text style={styles.heading}>Contact Us</Text>
        <Text style={styles.description}>
          If you have any questions or feedback, feel free to reach out to us at
          yamanrajsingh@gmail.com. We are here to help!
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  contentContainer: {
    padding: moderateScale(20),
  },
  image: {
    width: '100%',
    height: verticalScale(150),
    resizeMode: 'contain',
    marginBottom: moderateScale(20),
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#9370DB",
    marginBottom: moderateScale(10),
  
  },
  description: {
    fontSize: 16,
    color: 'gray',
    marginBottom: moderateScale(15),
  
  },
});

export default AboutUs;
