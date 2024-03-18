import { Text, Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, Center, HStack, Pressable, ScrollView, VStack } from '@gluestack-ui/themed'

interface TimerModalProps {
  isOpen: boolean
  minutes: number
  seconds: number
  onClose: () => void
  onMinutesChange: (value: number) => void
  onSecondsChange: (value: number) => void
}

export default function TimerModal({ minutes, seconds, isOpen, onClose, onMinutesChange, onSecondsChange }: TimerModalProps) {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent maxHeight="75%">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <HStack>
            <VStack p={20}>
              <ScrollView height="$56">
                {Array.from({ length: 60 }, (_, index) => (
                  <Pressable key={index} onPress={() => onMinutesChange(index)}>
                    <Center>
                      <Text
                        color={index === minutes ? "$purple600" : undefined}
                        size="lg"
                        bold={index === minutes}
                      >
                        {index} min.
                      </Text>
                    </Center>
                  </Pressable>
                ))}
              </ScrollView>
            </VStack>
            <VStack p={20}>
              <ScrollView height="$56">
                {Array.from({ length: 60 }, (_, index) => (
                  <Pressable key={index} onPress={() => onSecondsChange(index)}>
                    <Center>
                      <Text
                        color={index === seconds ? "$purple600" : undefined}
                        size="lg"
                        bold={index === seconds}
                      >
                        {index} sec.
                      </Text>
                    </Center>
                  </Pressable>
                ))}
              </ScrollView>
            </VStack>
          </HStack>
        </ActionsheetContent>
      </Actionsheet>
  )
}
