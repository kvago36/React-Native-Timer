import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import {
  Pressable,
  Center,
  Text,
  HStack,
  ScrollView,
} from "@gluestack-ui/themed";

export default function TimeTime() {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(30);
  const [offset, setOffset] = useState({ a: 0, b: 0 })
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <Pressable
        onPress={() => setIsOpen(true)}
        p="$5"
        bg="$primary500"
        $hover-bg="$primary400"
      >
        <Text color="white">Press me</Text>
      </Pressable>
    );
  }

  // useEffect(() => {
  //   setOffset({ a: 120, b: 120 })
  // }, [seconds, minutes])

  return (
    <HStack styles={styles.container} width="$48" reversed={false}>
      <ScrollView contentOffset={{ x: 0, y: offset.a }} height="$24">
        {Array.from({ length: 61 }, (value, index) => (
          <Pressable key={index} onPress={() => setMinutes(index)}>
            <Center>
              <Text size="lg" bold={minutes === index}>
                {index} min.
              </Text>
            </Center>
          </Pressable>
        ))}
      </ScrollView>
      <ScrollView contentOffset={{ x: 0, y: offset.b }} height="$24">
        {Array.from({ length: 61 }, (value, index) => (
          <Pressable key={index} onPress={() => setSeconds(index)}>
            <Center>
              <Text size="lg" bold={seconds === index}>
                {index} sec.
              </Text>
            </Center>
          </Pressable>
        ))}
      </ScrollView>
    </HStack>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
});
