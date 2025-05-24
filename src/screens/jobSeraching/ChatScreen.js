import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { moderateScale } from "react-native-size-matters";

const ChatScreen = () => {




  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  messagesList: {
    padding: moderateScale(10),
  },
  messageContainer: {
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    marginVertical: moderateScale(5),
    maxWidth: "80%",
  },
  myMessage: {
    backgroundColor: "#3498db",
    alignSelf: "flex-end",
  },
  theirMessage: {
    backgroundColor: "#ecf0f1",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: moderateScale(16),
    color: "#2c3e50",
  },
  inputContainer: {
    flexDirection: "row",
    padding: moderateScale(10),
    borderTopWidth: 1,
    borderColor: "#ecf0f1",
  },
  input: {
    flex: 1,
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    backgroundColor: "#ecf0f1",
  },
  sendButton: {
    marginLeft: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3498db",
    paddingHorizontal: moderateScale(15),
    borderRadius: moderateScale(10),
  },
  sendButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
  },
});
