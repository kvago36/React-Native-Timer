// import "react-native-gesture-handler";

import { GluestackUIProvider } from "@gluestack-ui/themed";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { config } from "./gluestack-style.config";

import Navigation from "./routes";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider config={config}>
        <Navigation />
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
