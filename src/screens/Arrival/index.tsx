import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { BSON } from 'realm';

import { getAddressLocation } from '../../utils/getAddressLocation';
import { getStorageLocation } from '../../libs/asyncStorage/locationStorage';
import { stopLocationTask } from '../../tasks/backgroundLocationTask';
import { getLastSyncTimestamp } from '../../libs/asyncStorage/asyncStorage';

import {
  Container,
  Content,
  Description,
  Footer,
  Label,
  LicensePlate,
  AsyncMessage
} from './styles';

import { Historic } from '../../libs/realm/schemas/Historic';
import { useObject, useRealm } from '../../libs/realm';
import { useNavigation, useRoute } from '@react-navigation/native';
import { X } from 'phosphor-react-native';
import { LatLng } from 'react-native-maps';
import dayjs from 'dayjs';

import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { Map } from '../../components/Map';
import { Locations } from '../../components/Locations';
import { LocationInfoProps } from '../../components/LocationInfo';
import { Loading } from '../../components/Loading';

type RouteParamsProps = {
  id: string;
}

export function Arrival() {
  const [isLoading, setIsLoading] = useState(true);
  const [dataNotSynced, setDataNotSynced] = useState(false);
  const [coordinates, setCoordinates] = useState<LatLng[]>([]);
  const [departure, setDeparture] = useState<LocationInfoProps>({} as LocationInfoProps);
  const [arrival, setArrival] = useState<LocationInfoProps | null>(null);

  const route = useRoute();
  const { id } = route.params as RouteParamsProps;
  const historic = useObject(Historic,  new BSON.UUID(id));

  const { goBack } = useNavigation();
  const realm = useRealm();

  const title = historic?.status === 'departure' ? 'Chegada' : 'Detalhes';

  function handleRemoveVehicleUsage() {
    Alert.alert(
      'Cancelar',
      'Cancelar a utilização do veículo',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: () => removeVehicleUsage() }
      ]
    )
  }

  async function removeVehicleUsage() {
    realm.write(() => {
      realm.delete(historic);
    })

    await stopLocationTask();

    goBack();
  }

  async function handleArrivalRegister() {
    try {
      if(!historic) {
        return Alert.alert('Erro', 'Não foi possível obter os dados para registrar a chegada do veículo');
      }

      const locations = await getStorageLocation();

      realm.write(() => {
        historic.status = 'arrival';
        historic.updated_at = new Date();
        historic.coords.push(...locations);
      });

      await stopLocationTask();

      Alert.alert('Chegada', 'Chegada registrada com sucesso');

      goBack();
    } catch(error) {
      Alert.alert('Erro', 'Não foi possível registrar a chegada do veívulo');
    }
  }

  async function getLocationsInfo() {
    if(!historic) {
      return;
    }

    try {
      const lastSync = await getLastSyncTimestamp();
      const updatedAt = historic!.updated_at.getTime();
      setDataNotSynced(updatedAt > lastSync);
  
      if(historic?.coords[0]) {
        const departureLocale = await getAddressLocation(historic?.coords[0]);
        
        setDeparture({
          label: `Saindo em  ${departureLocale?.street ?? 'endereço não identificado'}`,
          description: dayjs(new Date(historic?.coords[0].timestamp)).format('DD/MM/YYYY [às] HH:mm')
        })
      }
  
      if(historic?.status === 'departure') {
        const locationStorage = await getStorageLocation();
        return setCoordinates(locationStorage)
      }
  
      const arrivalCoords = historic?.coords[historic?.coords.length - 1];
      const arrivalLocale = await getAddressLocation(arrivalCoords);
      
      setArrival({
        label: `Chegando em  ${arrivalLocale?.street ?? 'endereço não identificado'}`,
        description: dayjs(new Date(arrivalCoords.timestamp)).format('DD/MM/YYYY [às] HH:mm')
      })
  
      setCoordinates(historic?.coords ?? []);
    } catch(error) {
      Alert.alert('Ops...', 'Algo deu errado, tente novamente.');
    } finally {
      setIsLoading(false);
    }

  }

  useEffect(() => {
    getLocationsInfo();
  }, [historic]);

  if(isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <Container>
      <Header title={title}/>

      {coordinates.length > 0 && (
        <Map
          coordinates={coordinates}
        />
      )}

      <Content>
        <Locations
          departure={departure}
          arrival={arrival}
        />
        <Label>Placa do veículo</Label>
        <LicensePlate>{ historic?.license_plate }</LicensePlate>

        <Label>Finalidade</Label>
        <Description>
          {historic?.description}
        </Description>

        { historic?.status === 'departure' && (
          <Footer>
            <IconButton
              icon={X}
              onPress={handleRemoveVehicleUsage}
            />
            <Button
              title='Registrar chegada'
              onPress={handleArrivalRegister}
            />
          </Footer>
        )}
      </Content>

      {dataNotSynced && (
        <AsyncMessage>
          Sincronização da
          { historic?.status === 'departure' ? " partida " : " chegada "}
          pendente
        </AsyncMessage>
      )}
    </Container>
  );
}