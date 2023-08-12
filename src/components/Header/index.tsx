import React from 'react';

import { ArrowLeft } from 'phosphor-react-native';
import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import theme from '../../theme';

import {
  Container,
  Title
} from './styles';

type HeaderProps = {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const paddingTop = insets.top + 32;

  function handleGoBack() {
    if(navigation.canGoBack()) {
      navigation.goBack();
    }
  }

  return (
    <Container
      style={{ paddingTop }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleGoBack}
      >
        <ArrowLeft
          size={24}
          weight='bold'
          color={theme.COLORS.BRAND_LIGHT}
        />
      </TouchableOpacity>
      <Title>
        { title }
      </Title>
    </Container>
  );
}