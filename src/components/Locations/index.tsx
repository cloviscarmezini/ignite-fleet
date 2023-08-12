import React from 'react';

import {
  Container,
  Line
} from './styles';

import { LocationInfo, LocationInfoProps } from '../LocationInfo';
import { Car, FlagCheckered } from 'phosphor-react-native';

type LocationsProps = {
  departure: LocationInfoProps;
  arrival?: LocationInfoProps | null;
};

export const Locations = (({ departure, arrival = null }: LocationsProps) => {
  return (
    <Container>
      <LocationInfo
        icon={Car}
        label={departure.label}
        description={departure.description}
      />

      {arrival && (
        <>
          <Line />
    
          <LocationInfo
            icon={FlagCheckered}
            label={arrival.label}
            description={arrival.description}
          />
        </>
      )}
    </Container >
  );
})