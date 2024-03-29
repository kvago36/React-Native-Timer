import {
  HStack,
  Text,
  Button,
  ButtonIcon,
} from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";

interface CountProps {
  min?: number;
  max?: number;
  value?: number;
  startValue?: number;
  onChange: (count: number) => void;
}

export default function Count({ value, min = 0, max = 20, onChange }: CountProps) {
  const [count, setCount] = useState(value ? value : min ?? 0);

  useEffect(() => {
    if (count !== null) {
      onChange(count);
    }
  }, [count]);

  return (

        <HStack alignItems="center" space="xs" reversed={false}>
          <Button
            variant="link"
            isDisabled={count === min}
            onPress={() => setCount((value) => value - 1)}
            size="xs"
          >
            <ButtonIcon
              name="minus-circle"
              color="$primary500"
              size="xl"
              width="$6"
              as={FontAwesome}
            />
          </Button>
          <Text
            textAlign="center"
            width="$8"
            size="2xl"
          >
            {count}
          </Text>
          <Button
            variant="link"
            isDisabled={count === max}
            onPress={() => setCount((value) => value + 1)}
            size="xs"
          >
            <ButtonIcon
              width="$6"
              name="plus-circle"
              color="$primary500"
              size="xl"
              as={FontAwesome}
            />
          </Button>
        </HStack>
  );
}
