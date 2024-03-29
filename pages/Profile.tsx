import { useState, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import {
  Text,
  VStack,
  Center,
  Heading,
  HStack,
  Pressable,
  SafeAreaView,
  Button,
  ButtonText,
  ButtonIcon,
  ArrowRightIcon
} from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { config } from "../gluestack-style.config";

import ProfileModal from '../view/ProfileModal'

import { TimerSettings, ProfileNames } from "../types";

import { TIMER_SETTINGS, PROFILES } from '../constants'

import { getTimerData } from "../utils/";

const PROFILES_NAMES = ["box", "mma", "custom"] as const;

export default function Settings({ navigation }) {
  const [profile, setProfile] = useState<ProfileNames>();
  const [settings, setSettings] = useState<TimerSettings>();
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const timerDataRef = useRef<TimerSettings>();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const saved: ProfileNames | null = (await AsyncStorage.getItem(
          "profile"
        )) as ProfileNames;

        if (saved) {
          setProfile(saved);
        } else {
          // load from storage current settings
          setProfile("custom");
        }
      } catch (e) {
        // read error
      }

      console.log("Done.");
    };

    getProfile();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const timerData = await getTimerData();
      const isValid = (value: string | null) =>
        value && Number.isInteger(+value);

      console.log(timerData);

      if (timerData && Object.values(timerData).every(isValid)) {
        timerDataRef.current = timerData;
        setShowAlertDialog(true);
      } else {
        setSettings(PROFILES.custom);
      }
    };

    if (profile === "custom") {
      if (!timerDataRef.current) {
        loadData();
      } else {
        setSettings(timerDataRef.current)
      }
    } else if (profile) {
      setSettings(PROFILES[profile]);
    }
  }, [profile]);

  return (
    <SafeAreaView style={styles.container}>
      <VStack space="xs" mb="$4">
        <Heading>Select profile</Heading>
        <Text size="sm">You can select predifined timer settings like rounds count or duration on the round</Text>
      </VStack>
      {/* <Button onPress={() => setShowAlertDialog(true)}>
        <ButtonText>Click me</ButtonText>
      </Button> */}
      <HStack justifyContent="center" space="lg">
        {PROFILES_NAMES.map((name) => (
          <Pressable key={name} onPress={() => setProfile(name)}>
            <Center
              style={[
                styles.box,
                {
                  backgroundColor:
                    profile === name
                      ? config.tokens.colors.primary600
                      : "transparent",
                },
              ]}
              paddingVertical="$2"
              paddingHorizontal="$5"
            >
              <Text
                style={[
                  styles.label,
                  {
                    color:
                      profile !== name
                        ? config.tokens.colors.primary600
                        : "#fff",
                  },
                ]}
              >
                {name}
              </Text>
            </Center>
          </Pressable>
        ))}
      </HStack>
      {settings && (
        <VStack space="md">
          {TIMER_SETTINGS.map((prop) => (
            <HStack justifyContent="space-between" key={prop}>
              <Text>{prop}</Text>
              <Text>{settings[prop]}</Text>
            </HStack>
          ))}
        </VStack>
      )}
      <Button onPress={() => navigation.navigate('Timer')} variant="link">
        <ButtonText size="xl">Open timer</ButtonText>
        <ButtonIcon
          as={ArrowRightIcon}
          h="$6"
          w="$6"
          color="$primary600"
          ml="$1"
        />
      </Button>
      <ProfileModal
        isOpen={showAlertDialog}
        onClose={() => setShowAlertDialog(false)}
        onSubmit={() => setSettings(timerDataRef.current)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    color: config.tokens.colors.primary600,
    borderWidth: 2,
    borderRadius: 2,
    borderColor: config.tokens.colors.primary600,
  },
  selected_box: {
    backgroundColor: config.tokens.colors.primary600,
  },
  label: {
    fontWeight: "600",
    color: config.tokens.colors.primary600,
  },
});
