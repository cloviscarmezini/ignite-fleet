import React from 'react';

import { TouchableOpacityProps } from 'react-native';
import { IconProps } from 'phosphor-react-native';
import { useTheme } from 'styled-components';

import {
  Container
} from './styles';

export type IconBoxProps = (props: IconProps) => JSX.Element;

export type IconButtonProps = TouchableOpacityProps & {
  icon: IconBoxProps;
}

export function IconButton({ icon: Icon, ...rest }: IconButtonProps){
  const { COLORS } = useTheme();

  return (
    <Container
      activeOpacity={0.7}
      { ...rest }
    >
      <Icon
        size={24}
        color={COLORS.BRAND_MID}
      />
    </Container>
  );
}