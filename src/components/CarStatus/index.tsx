import React from 'react';

import { TouchableOpacityProps } from 'react-native';
import { useTheme } from 'styled-components';
import { Car, Key } from 'phosphor-react-native'

import {
    Container, IconBox, Message, TextHighlight
} from './styles';

type CarStatusProps = TouchableOpacityProps & {
    licensePlate?: string;
}

export function CarStatus({ licensePlate, ...rest }: CarStatusProps) {
    const theme = useTheme();

    const Icon = licensePlate ? Car : Key;
    const message = licensePlate ? `Veículo ${licensePlate} em uso. ` : 'Nenhum veículo em uso. ';
    const status = licensePlate ? 'chegada' : 'saída';

    return (
        <Container { ...rest }>
            <IconBox>
                <Icon
                    size={52}
                    color={theme.COLORS.BRAND_LIGHT}
                />
            </IconBox>

            <Message>
                {message}

                <TextHighlight>
                    Clique aqui para registrar a { status }
                </TextHighlight>
            </Message>
        </Container>
    );
}