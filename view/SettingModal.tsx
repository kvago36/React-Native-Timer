import { forwardRef, useState, ForwardedRef, ReactNode } from "react";
import {
  Text,
  Modal,
  VStack,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Icon,
  CloseIcon,
  CheckIcon,
  HStack,
  ModalBody,
  Button,
  ModalFooter,
  ButtonIcon,
} from "@gluestack-ui/themed";

import Count from "../components/Count";
import TimeSelect from "../components/TimeSelect";

import { TimerSettings } from "../types";

interface TimerModalProps {
  isOpen: boolean;
  settings?: TimerSettings;
  onClose: () => void;
  onSubmit: (settings: Partial<TimerSettings>) => void;
}

type FormValues = {
  wait?: number;
  rest?: number;
  minutes?: number;
  seconds: number;
};

type FieldProps = {
  label: string;
  description: string;
  children: ReactNode;
};

const Field = ({ label, children, description }: FieldProps) => (
  <HStack justifyContent="space-between">
    <VStack>
      <Text color="$secondary900" size="xl">
        {label}
      </Text>
      <Text color="$secondary400" size="sm">
        {description}
      </Text>
    </VStack>
    {children}
  </HStack>
);

function TimerModal(
  props: TimerModalProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  const { isOpen, settings, onClose, onSubmit } = props;
  // const [isClean, setIsClean] = useState(true) // TODO: alert user about close window
  const [count, setCount] = useState(settings ? settings.count : 1);
  const [rest, setRest] = useState(settings ? settings.rest : 0);
  const [wait, setWait] = useState(settings ? settings.wait : 0);

  const handleSubmit = () => {
    onClose();
    onSubmit({ wait, rest, count });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} finalFocusRef={ref}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader justifyContent="flex-end">
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody height={"$48"}>
          <VStack space="lg" reversed={false}>
            <Field label="Count:" description="rounds count">
              <Count value={count} min={1} max={10} onChange={setCount} />
            </Field>

            <Field label="Wait:" description="rounds count">
              <TimeSelect onSubmit={setWait} value={wait} />
            </Field>

            <Field label="Rest:" description="rounds count">
              <TimeSelect onSubmit={setRest} value={rest} />
            </Field>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button size="sm" borderWidth="$0" onPress={handleSubmit}>
            <ButtonIcon as={CheckIcon} />
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default forwardRef(TimerModal);
