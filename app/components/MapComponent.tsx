'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const amenityIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [1, -28],
  shadowSize: [32, 32]
});

interface Coordinates {
  lat: number;
  lon: number;
}

interface Place {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
}

interface MapComponentProps {
  center: Coordinates;
  places: Place[];
}

export default function MapComponent({ center, places }: MapComponentProps) {
  const getPlacePosition = (place: Place): [number, number] | null => {
    // For ways and relations, use center coordinates if available
    if (place.lat && place.lon && !isNaN(place.lat) && !isNaN(place.lon)) {
      return [place.lat, place.lon];
    }
    // Return null if coordinates are not valid
    return null;
  };

  const getAmenityColor = (amenity: string) => {
    const colors: Record<string, string> = {
      'restaurant': '#ff6b6b',
      'cafe': '#4ecdc4',
      'shop': '#45b7d1',
      'bank': '#96ceb4',
      'hospital': '#feca57',
      'school': '#ff9ff3',
      'fuel': '#54a0ff'
    };
    return colors[amenity] || '#718096';
  };

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <MapContainer
        center={[center.lat, center.lon]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Main location marker */}
        <Marker position={[center.lat, center.lon]} icon={defaultIcon}>
          <Popup>
            <div className="text-center">
              <strong>Searched Location</strong>
              <br />
              {center.lat.toFixed(6)}, {center.lon.toFixed(6)}
            </div>
          </Popup>
        </Marker>

        {/* Amenity markers */}
        {places.map((place, index) => {
          const position = getPlacePosition(place);
          if (!position) return null;

          return (
            <Marker 
              key={place.id || index} 
              position={position} 
              icon={amenityIcon}
            >
              <Popup>
                <div>
                  <strong>
                    {place.tags?.name || place.tags?.amenity || 'Unnamed Place'}
                  </strong>
                  <br />
                  <span className="text-sm text-gray-600">
                    Type: {place.tags?.amenity || 'Unknown'}
                  </span>
                  {place.tags?.addr_street && (
                    <>
                      <br />
                      <span className="text-sm text-gray-600">
                        Address: {place.tags.addr_street}
                        {place.tags.addr_housenumber && ` ${place.tags.addr_housenumber}`}
                      </span>
                    </>
                  )}
                  {place.tags?.phone && (
                    <>
                      <br />
                      <span className="text-sm text-gray-600">
                        Phone: {place.tags.phone}
                      </span>
                    </>
                  )}
                  {place.tags?.website && (
                    <>
                      <br />
                      <a 
                        href={place.tags.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Website
                      </a>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
