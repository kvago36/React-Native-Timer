import { useState } from "react";
import { StyleSheet } from "react-native";
import {
  Button,
  ButtonText,
  HStack,
  CloseIcon,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Icon,
} from "@gluestack-ui/themed";

import Mover from "./Mover";

import { getFullTime, getFormatedTime, getSplittedTime } from "../utils";

interface TimeSelectProps {
  value?: number
  submitLabel?: string
  onSubmit: (value: number) => void
}

type Time = {
  minutes: number
  seconds: number
}

export default function TimeSelect({ value, onSubmit }: TimeSelectProps) {
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [time, setTime] = useState<Time>(() => ({
    ...getSplittedTime(value ?? 0)
  }))

  const { minutes, seconds } = time
  const timeString = getFormatedTime(minutes, seconds)

  const handleUpdate = (value: number, props: keyof Time) => {
    setTime(time => ({ ...time, [props]: value }))
  }

  const handleSubmit = () => {
    setShowAlertDialog(false)
    onSubmit(getFullTime(minutes, seconds))
  }

  const handleClose = () => {
    setTime({ ...getSplittedTime(value ?? 0) })
    setShowAlertDialog(false)
  }

  if (!showAlertDialog) {
    return (
      <Button size="lg" variant="outline" onPress={() => setShowAlertDialog(true)}>
        <ButtonText color="$secondary500">{timeString}</ButtonText>
      </Button>
    )
  }

  return (
      <AlertDialog
        animationPreset="fade"
        isOpen={showAlertDialog}
        onClose={handleClose}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader justifyContent="flex-end">
            <AlertDialogCloseButton>
              <Icon as={CloseIcon} />
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <AlertDialogBody marginVertical="$8">
            <HStack space="xl">
              <Mover label="Minutes" onChange={(value: number) => handleUpdate(value, 'minutes')} value={minutes} />
              <Mover label="Seconds" onChange={(value: number) => handleUpdate(value, 'seconds')} value={seconds} />
            </HStack>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onPress={handleSubmit}>
              <ButtonText>Save</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  );
}
