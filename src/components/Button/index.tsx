import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import {
  Container,
  Loading,
  Title
} from './styles';

type ButtonProps = TouchableOpacityProps & {
  title: string;
  loading?: boolean;
}

export function Button({ title, loading, ...rest }: ButtonProps){
  return (
    <Container
      activeOpacity={0.7}
      disabled={loading}
      { ...rest }
    >
      { loading
        ? <Loading />
        : (
          <Title>
            { title }
          </Title>
        )
      }
    </Container>
  );
}