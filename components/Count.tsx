import {
  VStack,
  HStack,
  Box,
  Text,
  Button,
  ButtonIcon,
  Center,
  ChevronUpIcon,
  ChevronDownIcon
} from "@gluestack-ui/themed";
import { useEffect, useState } from "react";

interface CountProps {
  min?: number
  max?: number
  startValue?: number
  onChange: (count: number) => void
}

export default function Count({ startValue, min = 0, max = 20, onChange }: CountProps) {
  const [count, setCount] = useState(min ?? 0)

  useEffect(() => {
    if (count !== null) {
      onChange(count)
    }
  }, [count])

  return (
    <Box bg="$primary500" p="$1">
      <HStack >
        <Center w={40}>
          <Text bold size="lg" color="white">{count}</Text>
        </Center>
        <VStack space="xs" reversed={false}>
          <Button
            isDisabled={count === max}
            onPress={() => setCount(value => value + 1)}
            size="xs"
          >
            <ButtonIcon as={ChevronUpIcon} size="xl" />
          </Button>
          <Button
            isDisabled={count === min}
            onPress={() => setCount(value => value - 1)}
            size="xs"
          >
            <ButtonIcon as={ChevronDownIcon} size="xl" />
          </Button>
        </VStack>
      </HStack>
    </Box>
  );
}
