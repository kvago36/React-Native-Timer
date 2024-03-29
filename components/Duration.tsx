import { useState } from "react";
import {
  HStack,
  Text,
  Icon,
  ChevronUpIcon,
  ChevronDownIcon,
  View,
  VStack,
  Box,
  Center,
  Button,
  Pressable,
} from "@gluestack-ui/themed";
import { useFonts } from "expo-font";

import { getSplittedTime, getFormatedTime } from "../utils";
import { boolean } from "yup";

interface DurationProps {
  label: string
  onChange: (duration: number) => void
  value?: number;
}

interface CustomProps {
  left?: boolean
  up?: boolean
  isDisabled: boolean
  onPress: () => void
}

const Custom = ({ isDisabled, left = false, up = false, onPress }: CustomProps) => (
  <Pressable
    onPress={onPress}
    bottom={up ? undefined : -6}
    top={up ? -6 : undefined}
    right={left ? undefined : 0}
    left={left ? 0 : undefined}
    disabled={isDisabled}
    height="$2"
    borderRadius={1}
    $disabled-bg="$primary100"
    backgroundColor="$primary600"
    position="absolute"
    width="$9"
    zIndex={10}
  >
    <Center flex={1} alignItems="center" justifyContent="center">
      {up ? (
        <ChevronUpIcon size="xs" color="$white" />
      ) : (
        <ChevronDownIcon size="xs" color="$white" />
      )}
    </Center>
  </Pressable>
);

export default function Duration({ onChange, label, value }: DurationProps) {
  const [duration, setDuration] = useState(value ?? 0);
  const [fontsLoaded, fontError] = useFonts({
    digital7: require("../assets/fonts/digital-7/digital-7.ttf"),
  });

  const { minutes, seconds } = getSplittedTime(duration);
  const timeString = getFormatedTime(minutes, seconds);
  const [m, s] = timeString.split(":");

  return (
    <HStack
      position="relative"
      alignItems="center"
      justifyContent="space-between"
      flexDirection="row"
    >
      <Text size="xl">{label}</Text>
      <HStack>
        <Box width="$10">
          <Custom isDisabled={minutes === 60} up onPress={() => setDuration((value) => value + 60)} />
          <Text textAlign="right" size="3xl">
            {m}
          </Text>
          <Custom isDisabled={minutes === 0} onPress={() => setDuration((value) => value - 60)} />
        </Box>
        <Text size="3xl">
          :
        </Text>
        <Box width="$10">
          <Custom isDisabled={seconds === 60} left up onPress={() => setDuration((value) => value + 1)} />
          <Text size="3xl">
            {s}
          </Text>
          <Custom isDisabled={seconds === 0} left onPress={() => setDuration((value) => value - 1)} />
        </Box>
      </HStack>
    </HStack>
  );
}
