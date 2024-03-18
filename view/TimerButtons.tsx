import {
  HStack,
  Text,
  Icon,
  Pressable,
  Center,
} from "@gluestack-ui/themed";
import { useRef, useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

interface TimerButtonsProps {
  data: number[];
  pre: string;
  onClick: (value: number) => void;
  icon: any;
}

export default function TimerButtons(props: TimerButtonsProps) {
  return (
    <Animated.View
      style={styles.wrapper}
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
    >
      <HStack
        space="md"
        reversed={false}
      >
        {props.data.map((value) => (
          <Pressable
            key={value}
            onPress={() => props.onClick(value)}
            borderStyle="solid"
            borderRadius="$full"
            bg="rgba(151, 81, 236, 0.8)"
            borderWidth={2}
            borderColor="$indigo600"
          >
            <Center width="$12" height="$12">
              <Text bold color="$indigo600" size="sm">
                {value}
              </Text>
              <Text bold color="$indigo600" size="sm">
                {props.pre}
              </Text>
            </Center>
          </Pressable>
        ))}
        <Pressable
          onPress={() => props.onClick(0)}
          borderRadius="$full"
          bg="$primary500"
          $hover-bg="$primary400"
        >
          <Center p="$1" width="$16" height="$16">
            <Icon size="xl" color="white" as={props.icon} />
          </Center>
        </Pressable>
      </HStack>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 120
  },
});
