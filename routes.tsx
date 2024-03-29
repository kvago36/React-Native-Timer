import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from "@react-navigation/drawer";
import { Directions } from 'react-native-gesture-handler';

import { config } from "./gluestack-style.config";

import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Timer from "./pages/Timer";
import Test from "./pages/Test";

const Drawer = createDrawerNavigator();

export default function Navigation() {
  const screenOptions: DrawerNavigationOptions = {
    headerStyle: {
      backgroundColor: "#121212", 
    },
    drawerStyle: {
      width: "62%",
    },
    headerTintColor: "#fff",
    // swipeEnabled: false,
    drawerActiveTintColor: config.tokens.colors.primary600,
    drawerInactiveTintColor: "#1f1f1f",
    drawerActiveBackgroundColor: "#fff",
  };

  return (
    <NavigationContainer>
      <Drawer.Navigator screenOptions={screenOptions}>
        <Drawer.Screen name="Timer" component={Timer} />
        <Drawer.Screen name="Profile" component={Profile} />
        <Drawer.Screen name="Settings" component={Settings} />
        <Drawer.Screen name="Test" component={Test} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
