import { forwardRef, useState, ForwardedRef } from 'react'
import {
  Text,
  Modal,
  VStack,
  Center,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  Heading,
  ModalCloseButton,
  Icon,
  CloseIcon,
  HStack,
  ModalBody,
  ScrollView,
  ModalFooter,
} from "@gluestack-ui/themed";
import { useForm, Controller } from "react-hook-form";
// import DatePicker from 'react-native-date-picker'

import Button from "../components/Button";
import TimePicker from "../components/TimePicker";
import TimeTime from '../components/TimeTime'

import { TimerSettings } from "../types";

interface TimerModalProps {
  isOpen: boolean
  settings?: TimerSettings
  onClose: () => void
  onSubmit: (settings: TimerSettings) => void
}

type FormValues = {
  wait?: number
  rest?: number
  minutes?: number
  seconds: number
}

function TimerModal(props: TimerModalProps, ref: ForwardedRef<HTMLButtonElement>) {
  const {
    isOpen,
    settings,
    onClose,
    onSubmit,
  } = props
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm(settings ? {
    defaultValues: {
      rest: settings.rest,
      wait: settings.wait,
      seconds: settings.round,
      minutes: Math.ceil(settings.round / 60)
    }
  } : undefined);
  const [date, setDate] = useState(new Date())

  const prepairDate = (values: FormValues) => {
    let round = values.seconds

    if (values.minutes) {
      round = round + values.minutes * 60
    }

    onSubmit({ wait: values.wait, rest: values.rest, round, count: 1 })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} finalFocusRef={ref}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="lg">Engage with Modals</Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <VStack space="lg" reversed={false}>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Center>
                  <Text>Rest: {value}</Text>
                  <TimePicker value={value} onChange={onChange} />
                </Center>
              )}
              name="rest"
            />

            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Center>
                  <Text>Wait: {value}</Text>
                  <TimePicker value={value} onChange={onChange} />
                </Center>
              )}
              name="wait"
            />

            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Center>
                  <Text>Minutes: {value}</Text>
                  <TimePicker value={value} onChange={onChange} />
                </Center>
              )}
              name="minutes"
            />

            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <Center>
                  <Text>Seconds: {value}</Text>
                  <TimePicker value={value} onChange={onChange} />
                </Center>
              )}
              name="seconds"
            />
          </VStack>
          {errors.seconds && <Text>This is required.</Text>}

          <TimeTime />
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            size="sm"
            action="secondary"
            mr="$3"
            title="Cancel"
            onPress={onClose}
          />
          <Button
            size="sm"
            action="positive"
            borderWidth="$0"
            title="Explore"
            onPress={handleSubmit(prepairDate)}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default forwardRef(TimerModal)
