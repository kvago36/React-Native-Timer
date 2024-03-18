import "react-native-gesture-handler";

import { GluestackUIProvider } from "@gluestack-ui/themed";

import { config } from "./gluestack-style.config"

import Navigation from './routes'

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <Navigation />
    </GluestackUIProvider>
  );
}
