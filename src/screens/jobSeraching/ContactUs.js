import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import emailjs from "emailjs-com";

const ContactUs = ({ navigation }) => {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const sendEmail = () => {
    const templateParams = {
      name,
      email,
      phone,
      message,
    };

    emailjs
      .send(
        "service_em6jrsx",
        "template_aef8itp",
        templateParams,
        "Bbe7-E2Ou5Vz9fAFw"
      )
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
        Alert.alert("Success", "Your message has been sent!");
        setName("");
        setSubject("");
        setEmail("");
        setPhone("");
        setMessage("");
      })
      .catch((err) => {
        console.log("FAILED...", err);
        Alert.alert("Error", "Failed to send your message.");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Contact Us</Text>
      <Text style={styles.subheading}>Feel Free to drop us a line below</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        placeholderTextColor={"gray"}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Your Email"
        placeholderTextColor={"gray"}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Your Phone Number"
        placeholderTextColor={"gray"}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Subject"
        placeholderTextColor={"gray"}
        value={subject}
        onChangeText={setSubject}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Your Message"
        placeholderTextColor={"gray"}
        multiline
        value={message}
        onChangeText={setMessage}
      />
      <TouchableOpacity style={styles.submitButton} onPress={sendEmail}>
        <Text style={styles.submitButtonText}>Send Message</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#9370DB",
    textAlign: "center",
  },
  subheading: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 20,
    textAlign: "center",
    color: "#2F4F4F",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#9370DB",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#F8F8FF",
    color: "#2c3e50",
  },
  submitButton: {
    backgroundColor: "#9370DB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 18,

  },
});

export default ContactUs;
