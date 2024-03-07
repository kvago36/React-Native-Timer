import { Input, InputField } from '@gluestack-ui/themed';
import { TextInputProps } from 'react-native'

interface UIInput extends TextInputProps {
  isDisabled?: boolean
}

export default function UIInput(props: UIInput) {
  return (
    <Input
      variant="outline"
      size="md"
      isDisabled={props.isDisabled}
      {...props}
    >
      <InputField value={props.value} onChangeText={props.onChangeText} placeholder={props.placeholder} />
    </Input>
  )
}