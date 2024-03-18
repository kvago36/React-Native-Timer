import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from "@react-navigation/drawer";

import { config } from "./gluestack-style.config";

import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Timer from "./pages/Timer";

const Drawer = createDrawerNavigator();

export default function Navigation() {
  const screenOptions: DrawerNavigationOptions = {
    headerStyle: {
      backgroundColor: "#121212",
    },
    headerTintColor: "#fff",
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
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
