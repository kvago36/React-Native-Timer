import {
  ChevronDownIcon,
  Icon,
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
} from "@gluestack-ui/themed";
import { useState } from "react";

interface TimePickerProps {
  isOptional?: boolean;
  onChange: (value: string) => void
}

export default function TimePicker({ isOptional, onChange, value }: TimePickerProps) {
  const [isEnabled, setIsEnabled] = useState(!isOptional);

  return (
    <Select defaultValue={value} selectedValue={value} onValueChange={onChange}>
      <SelectTrigger variant="outline" size="md">
        <SelectInput placeholder="Select option" />
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
          {Array.from({ length: 61 }, (value, index) => (
            <SelectItem label={String(index)} value={index} />
          ))}
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}
