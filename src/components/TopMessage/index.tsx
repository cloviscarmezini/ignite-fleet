import React from 'react';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components';

import {
  Container,
  Title
} from './styles';
import { IconBoxProps } from '../IconButton';

type TopMessageProps = {
  icon?: IconBoxProps;
  title: string;
}

export function TopMessage({ title, icon: Icon }: TopMessageProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const paddingTop = insets.top;

  return (
    <Container
      style={{ paddingTop }}
    >
      { Icon &&
        <Icon
          size={18}
          weight='bold'
          color={theme.COLORS.GRAY_100}
        />
      }
      <Title>
        { title }
      </Title>
    </Container>
  );
}