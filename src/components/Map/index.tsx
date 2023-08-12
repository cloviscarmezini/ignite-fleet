import React, { useRef } from 'react';
import MapView, { LatLng, MapViewProps, PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import { IconBox } from '../IconBox';
import { Car, FlagCheckered } from 'phosphor-react-native';
import { useTheme } from 'styled-components';

type MapProps = MapViewProps & {
    coordinates: LatLng[];
}

export function Map({ coordinates, ...rest }: MapProps) {
    const mapRef = useRef<MapView>(null);
    const { COLORS } = useTheme();
    const lastCoordinates = coordinates[coordinates.length - 1];

    async function onMapLoaded() {
        if(coordinates.length > 1) {
            mapRef.current?.fitToSuppliedMarkers(['departure', 'arrival'], {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }
            })
        }
    }

    return (
        <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={{
                width: '100%',
                height: 200
            }}
            region={{
                latitude: lastCoordinates.latitude,
                longitude: lastCoordinates.longitude,
                latitudeDelta: 0.0005,
                longitudeDelta: 0.0005,
            }}
            onMapLoaded={onMapLoaded}
            { ...rest }
        >
            <Marker
                identifier='departure'
                coordinate={coordinates[0]}
            >
                <IconBox size="SMALL" icon={Car}/>
            </Marker>

            { coordinates.length > 1 && (
                <>
                    <Marker
                        identifier='arrival'
                        coordinate={lastCoordinates}
                    >
                        <IconBox size="SMALL" icon={FlagCheckered}/>
                    </Marker>

                    <Polyline
                        coordinates={[...coordinates]}
                        strokeColor={COLORS.GRAY_700}
                        strokeWidth={7}
                    />
                </>
            )}
        </MapView>
    );
}