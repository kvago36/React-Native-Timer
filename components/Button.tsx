import { ButtonText, Button } from "@gluestack-ui/themed";
import { ButtonProps } from 'react-native'

interface UIButton extends ButtonProps {
  solid?: boolean
  isDisabled?: boolean
  action?: "primary" | "secondary" | "positive" | "negative" | "default" | undefined
  size?: "xs" | "sm" | "md" | "lg" | "xl" | undefined
  variant?: "link" | "solid" | "outline" | undefined
}


export default function UIButton(props: UIButton) {
  return <Button
  size="md"
  variant={props.variant}
  isDisabled={props.isDisabled}
  {...props}
>
  <ButtonText>{props.title}</ButtonText>
</Button>
}