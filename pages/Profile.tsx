import { useState } from "react";
import { SafeAreaView } from "react-native";
import {
  Text,
  VStack,
  HStack,
  FormControl,
  AlertCircleIcon,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  Textarea,
  TextareaInput,
  ChevronDownIcon,
  Heading,
  Icon,
  Switch,
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Input from "../components/Input";
import Checkbox from "../components/Checkbox";
import Button from "../components/Button";

const schema = yup
  .object({
    rest: yup.number().positive().integer(),
    signal: yup.number().positive().integer(),
    count: yup.number().positive().integer().required(),
    duration: yup.number().positive().integer().required(),
  })

export default function Settings({ navigation }) {
  const [y, setY] = useState(false);
  const [x, setX] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      duration: 0,
      count: 0,
      rest: 0,
      signal: 0,
    },
  });

  const readData = async (keys: string[]) => {
    try {
    return await AsyncStorage.multiGet(keys)
    } catch (e) {
      // saving error
    }
  };

  const storeData = async (data) => {
    try {
    await AsyncStorage.multiSet(Object.entries(data))
    } catch (e) {
      // saving error
    }
  };

  const onSubmit = (data) => {
    // storeData(data)
    storeData(data)
    console.log(data);
  };

  return (
    <SafeAreaView>
      <VStack space="xs" mb="$4">
        <Heading>Change Settings</Heading>
        <Text size="sm">Make modifications to the settings with ease.</Text>
      </VStack>
      <VStack py="$2" space="xl">
        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Volume</FormControlLabelText>
          </FormControlLabel>
          <Slider defaultValue={60} sliderTrackHeight={4}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </FormControl>
        <FormControl>
          <HStack space="sm">
            <Switch size="sm" />
            <FormControlLabelText>Vibrations</FormControlLabelText>
          </HStack>
        </FormControl>
        <FormControl>
          <HStack space="sm">
            <Switch size="sm" />
            <FormControlLabelText>Orientaion</FormControlLabelText>
          </HStack>
        </FormControl>
        <FormControl>
          <Select defaultValue="en">
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
      </VStack>
      <Button mt="$4" title="Save Changes" onPress={() => {}} />
    </SafeAreaView>
  );
}
