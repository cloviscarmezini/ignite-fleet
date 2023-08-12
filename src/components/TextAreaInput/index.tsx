import React, { forwardRef } from 'react';

import {
  Container, Input, Label
} from './styles';

import { useTheme } from 'styled-components';
import { TextInput, TextInputProps } from 'react-native';

type InputProps = TextInputProps & {
  label: string;
};

export const TextAreaInput = forwardRef<TextInput, InputProps>(({ label, ...rest }, ref) => {
  const { COLORS } = useTheme();

  return (
    <Container>
      <Label>
        {label}
      </Label>

      <Input
        ref={ref}
        multiline
        autoCapitalize='sentences'
        placeholderTextColor={COLORS.GRAY_400}
        { ...rest }
      />
    </Container>
  );
});