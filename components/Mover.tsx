import { useState } from "react";
import { StyleSheet, LayoutChangeEvent } from "react-native";
import { HStack, Text, VStack, Box } from "@gluestack-ui/themed";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";

import { config } from "../gluestack-style.config";

const SIZE = 40;
const CONTAINER_SIZE = 300;
const FULL_SIZE = SIZE * 61 - CONTAINER_SIZE;

interface MoverProps {
  label: string;
  value?: number;
  onChange: (value: number) => void
}

export default function App({ value, label, onChange }: MoverProps) {
  const [selected, setSelected] = useState(value ?? 0);
  const offset = useSharedValue(0);
  const height = useSharedValue(0);

  const onLayout = (event: LayoutChangeEvent) => {
    const layoutHeight = event.nativeEvent.layout.height;

    if (selected > 0) {
      offset.value = withTiming(-selected * SIZE + layoutHeight / 2 - SIZE / 2);
    } else {
      offset.value = withTiming(layoutHeight / 2 - SIZE / 2);
    }

    height.value = layoutHeight;
  };

  const pan = Gesture.Pan()
    .onChange((event) => {
      offset.value += event.changeY;
    })
    .onFinalize(
      (event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
        offset.value = withDecay(
          {
            velocity: event.velocityY,
            rubberBandEffect: true,
            clamp: [
              -FULL_SIZE + SIZE / 2 - height.value / 2,
              height.value / 2 - SIZE / 2,
            ],
          },
          () => {
            for (let index = 0; index < 62; index++) {
              if (height.value / 2 - offset.value < index * SIZE) {
                let pos = index - 1;
                runOnJS(setSelected)(pos);
                runOnJS(onChange)(pos);
                offset.value = withTiming(
                  -pos * SIZE + height.value / 2 - SIZE / 2,
                  {
                    duration: 100,
                  }
                );
                break;
              }
            }
          }
        );
      }
    );

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  return (
    <HStack space="md" alignItems="center" justifyContent="flex-start">
      <Box height={CONTAINER_SIZE}>
        <VStack onLayout={onLayout} style={styles.wrapper}>
          {Array.from({ length: 61 }, (_, index) => (
            <GestureDetector key={index} gesture={pan}>
              <Animated.View style={[styles.box, animatedStyles]}>
                <Text
                  size="xl"
                  style={[
                    styles.label,
                    selected === index ? styles.selected : undefined,
                  ]}
                >
                  {index}
                </Text>
              </Animated.View>
            </GestureDetector>
          ))}
        </VStack>
      </Box>
      <Box style={styles.select} />
      <Text fontWeight="bold">{label}</Text>
    </HStack>
  );
}

const styles = StyleSheet.create({
  label: {
    width: "100%",
    color: config.tokens.colors["secondary600"],
    textAlign: "center",
  },
  select: {
    position: "absolute",
    height: SIZE,
    width: SIZE,
    borderColor: config.tokens.colors["primary600"],
    borderWidth: 1
  },
  selected: {
    fontWeight: "bold",
    color: config.tokens.colors["primary600"],
  },
  wrapper: {
    flex: 1,
    height: 200,
    overflow: "hidden",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  box: {
    height: SIZE,
    width: SIZE,
    cursor: "grab",
    alignItems: "center",
    justifyContent: "center",
  },
});
