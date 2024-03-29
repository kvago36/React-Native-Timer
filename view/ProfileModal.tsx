import {
  Text,
  Heading,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Button,
  ButtonGroup,
  ButtonText,
  CloseIcon,
  Icon,
} from "@gluestack-ui/themed";

// setSettings(timerDataRef.current);


interface ProfileModalProps {
  isOpen: boolean
  onSubmit: () => void
  onClose: () => void
}

export default function ProfileModal({ isOpen, onSubmit, onClose }: ProfileModalProps) {
  return (
    <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="lg">Export Settings</Heading>
            <AlertDialogCloseButton>
              <Icon as={CloseIcon} />
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text size="sm">
              Export Settings from memorie? Your data will be permanently
              removed and cannot be undone.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup space="lg">
              <Button
                variant="outline"
                action="secondary"
                onPress={onClose}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                bg="$success600"
                action="positive"
                onPress={onSubmit}
              >
                <ButtonText>Export</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  )
}
