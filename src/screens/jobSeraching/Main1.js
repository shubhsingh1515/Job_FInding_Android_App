import { View, Text } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerScreen from "./DrawerScreen";
import CustomDrawer from "./CustomDrawer";
const draw = createDrawerNavigator();
const Main1 = () => {
  return (
    <draw.Navigator drawerContent={(props) => <CustomDrawer {...props} />}>
      <draw.Screen
        name="Drawer"
        component={DrawerScreen}
        options={{ title: "Job Genie" }}
      />
    </draw.Navigator>
  );
};

export default Main1;
