import { Checkbox, CheckIcon, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "@gluestack-ui/themed";
import { ViewProps } from 'react-native'

interface UICheckbox extends ViewProps {
  label?: string
  value?: boolean
  onChange: (value: boolean) => void
}

export default function UICheckbox(props: UICheckbox) {
  return (
    // @ts-expect-error
    <Checkbox defaultIsChecked={props.value} onChange={props.onChange} size="md">
      <CheckboxIndicator mr="$2">
        <CheckboxIcon as={CheckIcon} />
      </CheckboxIndicator>
      <CheckboxLabel>{props.label}</CheckboxLabel>
    </Checkbox>
  )
}