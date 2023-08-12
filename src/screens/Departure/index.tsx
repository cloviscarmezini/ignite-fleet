import React, { useEffect, useRef, useState } from 'react';

import {
  Container,
  Content,
  Message
} from './styles';

import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Alert, ScrollView, TextInput } from 'react-native';
import { licensePlateValidate } from '../../utils/licensePlateValidate';

import { useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import { useUser } from '@realm/react';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  LocationAccuracy,
  useForegroundPermissions,
  watchPositionAsync,
  LocationSubscription,
  LocationObjectCoords,
  requestBackgroundPermissionsAsync
} from 'expo-location';
import { getAddressLocation } from '../../utils/getAddressLocation';
import { Loading } from '../../components/Loading';
import { LocationInfo } from '../../components/LocationInfo';
import { Car } from 'phosphor-react-native';
import { Map } from '../../components/Map';
import { startLocationTask } from '../../tasks/backgroundLocationTask';

export function Departure() {
  const [description, setDescription] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [currentCoords, setCurrentCoords] = useState<LocationObjectCoords | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [locationForegroundPermission, requestLocationForegroundPermission] = useForegroundPermissions();

  const { goBack } = useNavigation();
  const user = useUser();
  const realm = useRealm();

  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);

  async function handleDepartureRegister() {
    try {
      if(!licensePlateValidate(licensePlate)) {
        Alert.alert('Placa inválida', 'Informe a placa correta do veículo');
        return licensePlateRef.current?.focus();
      }
      if(description.trim().length === 0) {
        Alert.alert('Finalidade', 'Por favor, informe a finalidade da utilização do veículo');
        return descriptionRef.current?.focus();
      }

      if(!currentCoords?.latitude || !currentCoords.longitude) {
        return Alert.alert('Localização', 'Não foi possível obter a localização atual. Tente novamente!');
      }

      setIsSubmitting(true);

      const backgroundPermissions = await requestBackgroundPermissionsAsync();

      if(!backgroundPermissions.granted) {
        setIsSubmitting(false);

        return Alert.alert('Localização', 'É necessário permitir que acesso a localização em segundo plano.');
      }

      startLocationTask();

      realm.write(() => {
        realm.create('Historic', Historic.generate({
          user_id: user!.id,
          description,
          license_plate: licensePlate,
          coords: [
            {
              latitude: currentCoords.latitude,
              longitude: currentCoords.longitude,
              timestamp: new Date().getTime()
            }
          ]
        }))
      })

      Alert.alert('Saída', 'Sua saída foi registrada com sucesso!');

      return goBack();
    } catch(error){
      setIsSubmitting(false);
      console.log(error);
      Alert.alert('Erro', 'Não foi possível registrar a saída do veículo');
    }
  }

  useEffect(() => {
    requestLocationForegroundPermission();
  }, []);

  useEffect(() => {
    if(!locationForegroundPermission?.granted) return;

    let subscription: LocationSubscription;
    
    watchPositionAsync({
      accuracy: LocationAccuracy.High,
      timeInterval: 1000
    }, (location) => {
      setCurrentCoords(location.coords);

      getAddressLocation(location.coords).then(address=> {
        if(address) {
          setCurrentAddress(address?.street)
        }
      }).finally(() => setIsLoadingLocation(false))
    }).then(response=> {
      subscription = response;
    })

    return () => subscription?.remove();
  }, [locationForegroundPermission]);

  if(!locationForegroundPermission?.granted) {
    return (
      <Container>
        <Header
          title='Saída'
        />
        <Message>
          Você precisa que o app tenha acesso a localização para utilizar essa funcionalidade. 
          Por favor acesse as configurações do seu dispositivo para conceder essa funcionalidade.
        </Message>
      </Container>
    )
  }

  if(isLoadingLocation) {
    return <Loading />
  }

  return (
    <Container>
      <Header
        title='Saída'
      />

      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView>
          { currentCoords && (
            <Map
              coordinates={[currentCoords]}
            />
          )}
          <Content>
            { currentAddress && (
              <LocationInfo
                icon={Car}
                label="Localização atual"
                description={currentAddress}
              />
            )}

            <LicensePlateInput
              ref={licensePlateRef}
              label='Placa do veículo'
              placeholder="FHV-9189"
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType="next"
              value={licensePlate}
              onChangeText={setLicensePlate}
            />

            <TextAreaInput
              ref={descriptionRef}
              label='Finalidade'
              placeholder="Vou utilizar o veículo para..."
              onSubmitEditing={handleDepartureRegister}
              returnKeyType='send'
              blurOnSubmit
              value={description}
              onChangeText={setDescription}
            />

            <Button
              title='Registrar Saída'
              onPress={handleDepartureRegister}
              loading={isSubmitting}
            />
          </Content>
        </ScrollView>
      </KeyboardAwareScrollView>
    </Container>
  );
}