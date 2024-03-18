import { Button, ButtonIcon } from "@gluestack-ui/themed";
import { FontAwesome } from "@expo/vector-icons";

interface PlayerButtonProps {
  name: keyof typeof FontAwesome.glyphMap;
  onPress: () => void;
  isDisabled?: boolean
  iconStyle?: any
}

export default function PlayerButton(props: PlayerButtonProps) {
  return (
    <Button
      width="$16"
      height="$16"
      borderRadius="$full"
      size="md"
      bg="$primary600"
      {...props}
      onPress={props.onPress}
    >
      {/* EditIcon is imported from 'lucide-react-native' */}
      <ButtonIcon {...props.iconStyle} size={23} name={props.name} as={FontAwesome} />
    </Button>
  );
}
