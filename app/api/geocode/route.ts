import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
  }

  try {
    // Geocode the address using Nominatim
    const geocodeResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1,
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'Geo-Web-App/1.0'
      }
    });

    if (geocodeResponse.data.length === 0) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    const result = geocodeResponse.data[0];
    const coords = {
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon)
    };

    // Fetch nearby places using Overpass API
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["amenity"](around:1000,${coords.lat},${coords.lon});
        way["amenity"](around:1000,${coords.lat},${coords.lon});
        relation["amenity"](around:1000,${coords.lat},${coords.lon});
      );
      out center meta;
    `;

    const overpassResponse = await axios.post(
      'https://overpass-api.de/api/interpreter',
      overpassQuery,
      {
        headers: {
          'Content-Type': 'text/plain',
          'User-Agent': 'Geo-Web-App/1.0'
        }
      }
    );

    return NextResponse.json({
      geocode: result,
      coordinates: coords,
      places: overpassResponse.data.elements || []
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch location data' 
    }, { status: 500 });
  }
}
