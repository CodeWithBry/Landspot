import axios from "axios"
const BASE_URL = "https://api.geoapify.com/v1";
const API_KEY = process.env.GEOAPIFY_API_KEY;
export type GeocodingResult = {
    lat: number,
    lng: number
}

export async function registerGeocode(address: string): Promise<GeocodingResult | null | undefined> {
    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

        const res = await fetch(url, {
            headers: { 'User-Agent': 'Landspot/1.0 contact@landspot.com' }
        })

        const data = (await res.json()) as Array<{ lat: string; lon: string }>;
        console.log(data)
        if (!data.length) return null;

        return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
        }
    } catch (error) {
        console.log("ERROR GEOCODE REGISTRING: " + error)
        throw error
    }
}

export interface GeoLocation {
    lat: number;
    lon: number;
    formatted: string;
    city: string | null;
    country: string | null;
}

// Forward Geocoding — address → coordinates
export const geocodeAddress = async (address: string): Promise<GeoLocation | null> => {
    const { data } = await axios.get(`${BASE_URL}/geocode/search`, {
        params: {
            text: address,
            apiKey: API_KEY,
            limit: 1,
        },
    });

    const feature = data?.features?.[0];
    if (!feature) return null;

    const { lat, lon, formatted, city, country } = feature.properties;

    return { lat, lon, formatted, city, country };
};

export async function registerGeocodeUsingGeoapify(address: string): Promise<GeocodingResult | null | undefined> {
    try {
        const getAddress = await geocodeAddress(address);
        if(!getAddress?.lat) return;
        return {lat: getAddress?.lat, lng: getAddress.lon};
    } catch (error) {
        console.log(error);
        throw error;
    }
}