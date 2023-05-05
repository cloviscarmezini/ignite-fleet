import React, { useEffect, useState } from 'react';

import backgroundImage from '../../assets/background.png';

import {
  Container,
  Slogan,
  Title
} from './styles';

import { Button } from '../../components/Button';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

import {
  ANDROID_CLIENT_ID,
  IOS_CLIENT_ID
} from '@env'

WebBrowser.maybeCompleteAuthSession();

export function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [ _, response, googleSignIn ] = Google.useIdTokenAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    scopes: ['profile', 'email']
  });

  function handleGoogleSignIn() {
    setIsAuthenticating(true);

    googleSignIn();
  }

  useEffect(() => {
    if(response?.type === 'success') {
      if(response.authentication?.idToken) {
        fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${response.authentication?.idToken}`)
        .then(response=>response.json())
        .then(response=>console.log(response))
      }
    } else {
      setIsAuthenticating(false);
    }
  }, [response])

  return (
    <Container source={backgroundImage}>
      <Title>
        Ignite Fleet
      </Title>

      <Slogan>
        Gestão de uso de veículos
      </Slogan>

      <Button
        title='Entrar com Google'
        onPress={handleGoogleSignIn}
        loading={isAuthenticating}
      />
    </Container>
  );
}