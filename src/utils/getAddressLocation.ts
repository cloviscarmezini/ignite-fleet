import { reverseGeocodeAsync, LocationObjectCoords } from "expo-location"

type AddressLocationProps = {
    latitude: number;
    longitude: number;
}

export async function getAddressLocation({ latitude, longitude }: AddressLocationProps) {
    try {
        const addressResponse = await reverseGeocodeAsync({ latitude, longitude });
        
        // return addressResponse[0]?.street;
        return addressResponse[0];
    } catch(error) {
        console.log(error)
    }
}