import { useState, useEffect } from "react";
import {
  Text,
  VStack,
  HStack,
  FormControl,
  Switch,
  Button,
  ButtonText,
  Pressable,
  Box,
  Spinner,
  Progress,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  ChevronDownIcon,
  CloseIcon,
  Icon,
  useToast,
  SelectItem,
  Select,
  SelectContent,
  SelectDragIndicator,
  SelectIcon,
  SelectDragIndicatorWrapper,
  SelectBackdrop,
  SelectInput,
  SelectTrigger,
  SelectPortal,
  ProgressFilledTrack,
  ButtonIcon,
  Toast,
  ToastDescription,
  ToastTitle,
} from "@gluestack-ui/themed";
import { MaterialIcons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS = ["volume", "vibration", "language"] as const;

export default function Settings({ navigation }) {
  const [volume, setVolume] = useState(50);
  const [vibration, setVibration] = useState(true);
  const [lg, setLg] = useState("en");
  const [isLoading, setIsloading] = useState(true);
  const toast = useToast();


  useEffect(() => {
    (async function () {
      const data = await AsyncStorage.multiGet(SETTINGS);

      if (!data) {
        setIsloading(false);
      } else {
        const settings = data.reduce(
          (acc, [key, value]) => ({ ...acc, [key]: value }),
          {}
        );

        console.log(settings);

        setVolume(+settings.volume);
        setVibration(settings.vibration === "enabled");
        setLg(settings.language);
        setIsloading(false);
      }
    })();
  }, []);

  const onConfirm = (id: number) => {
    toast.close(id)
    navigation.navigate('Timer')
  }

  const onSubmit = async () => {
    const vibrationValue = vibration ? "enabled" : "disabled";
    const keyValues: [string, string][] = [
      ["volume", volume.toString()],
      ["vibration", vibrationValue],
      ["language", lg],
    ];
    await AsyncStorage.multiSet(keyValues);

    toast.show({
      placement: "bottom",
      render: ({ id }) => (
        <Toast bgColor="$success300" width="100%" nativeID={"toast-" + id} action="success">
          <VStack space="xs">
            <ToastTitle>Settings updated!</ToastTitle>
            <ToastDescription>
              <HStack space="xs" alignContent="center">
                <Text>Go to</Text>
                <Pressable onPress={() => onConfirm(id)}>
                  <Text textDecorationLine="underline" color="$primary600">Timer</Text>
                </Pressable>
              </HStack>
            </ToastDescription>
          </VStack>
          <Pressable top={5} right={5} position="absolute" mt="$1" onPress={() => toast.close(id)}>
            <Icon as={CloseIcon} color="$coolGray50" />
          </Pressable>
        </Toast>
      ),
    });
  };

  return (
    <Box>
      {isLoading && (
        <Box
          zIndex={4}
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="center"
          position="absolute"
        >
          <Box
            zIndex={10}
            opacity={0.6}
            backgroundColor="white"
            width="100%"
            height="100%"
          />
          <Spinner position="absolute" size="large" />
        </Box>
      )}
      <VStack px="$6" py="$2" space="xl">
        {/* <VStack>
          <Heading>Change Settings</Heading>
          <Text size="sm">Make modifications to the settings with ease.</Text>
        </VStack> */}
        <FormControl>
          <FormControlLabel>
            <Icon
              mr="$1"
              size="xl"
              name={volume ? "volume-up" : "volume-mute"}
              as={MaterialIcons}
            />
            <FormControlLabelText>Volume</FormControlLabelText>
          </FormControlLabel>
          <HStack alignItems="center" space="md">
            <Button
              isDisabled={volume === 0}
              onPress={() => setVolume((value) => value - 10)}
              width={20}
              height={30}
            >
              <ButtonIcon name="remove" as={MaterialIcons} />
            </Button>
            <Progress flex={1} value={volume} h="$1">
              <ProgressFilledTrack h="$1" />
            </Progress>
            <Button
              isDisabled={volume === 100}
              onPress={() => setVolume((value) => value + 10)}
              width={20}
              height={30}
            >
              <ButtonIcon name="add" as={MaterialIcons} />
            </Button>
          </HStack>
          <FormControlHelper>
            <FormControlHelperText>
              Must be at least 6 characters.
            </FormControlHelperText>
          </FormControlHelper>
        </FormControl>
        <FormControl>
          <HStack space="sm">
            <Icon
              size="xl"
              name={vibration ? "vibration" : "smartphone"}
              as={MaterialIcons}
            />
            <Switch
              onChange={() => setVibration((value) => !value)}
              value={vibration}
              size="lg"
            />
            <FormControlLabelText>Vibrations</FormControlLabelText>
          </HStack>
          <FormControlHelper>
            <FormControlHelperText>
              Must be at least 6 characters.
            </FormControlHelperText>
          </FormControlHelper>
        </FormControl>
        {/* <FormControl>
          <HStack space="sm">
            <Icon size="xl" name="volume-up" as={MaterialIcons} />
            <Switch size="lg" />
            <FormControlLabelText>Orientaion</FormControlLabelText>
          </HStack>
          <FormControlHelper>
            <FormControlHelperText>
              Must be at least 6 characters.
            </FormControlHelperText>
          </FormControlHelper>
        </FormControl> */}
        <FormControl>
          <Select onValueChange={setLg}>
            <SelectTrigger>
              <SelectInput placeholder="Language" />
              <SelectIcon mr="$3">
                <Icon as={ChevronDownIcon} />
              </SelectIcon>
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                <SelectItem label="English" value="en" />
                <SelectItem label="Русский" value="ru" />
              </SelectContent>
            </SelectPortal>
          </Select>
        </FormControl>
        <Button size="lg" mt="$4" onPress={onSubmit}>
          <ButtonText>Save Changes</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
