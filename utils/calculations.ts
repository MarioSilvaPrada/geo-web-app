import { Coordinates, Place, UrbanIndexResult } from '../types';

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param lat1 Latitude of the first point
 * @param lon1 Longitude of the first point
 * @param lat2 Latitude of the second point
 * @param lon2 Longitude of the second point
 * @returns Distance in miles
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Calculate Walking Score (0-100) based on amenities within 1 mile
 * @param userCoords User's coordinates
 * @param places Array of nearby places
 * @returns Walking score from 0 to 100
 */
export const calculateWalkingScore = (userCoords: Coordinates, places: Place[]): number => {
  if (!userCoords || places.length === 0) return 0;

  const walkingRadius = 1; // 1 mile
  const nearbyPlaces = places.filter(place => {
    const distance = calculateDistance(userCoords.lat, userCoords.lon, place.lat, place.lon);
    return distance <= walkingRadius;
  });

  // Weight different amenity types
  const weights: Record<string, number> = {
    'restaurant': 3,
    'cafe': 2,
    'grocery': 5,
    'pharmacy': 4,
    'bank': 2,
    'gym': 3,
    'school': 2,
    'hospital': 4,
    'public_transport': 5
  };

  let score = 0;
  nearbyPlaces.forEach(place => {
    const amenity = place.tags?.amenity || '';
    const shop = place.tags?.shop || '';
    
    if (weights[amenity]) {
      score += weights[amenity];
    } else if (shop === 'supermarket' || shop === 'grocery') {
      score += 5;
    } else if (amenity || shop) {
      score += 1; // Basic score for any amenity
    }
  });

  // Normalize to 0-100 scale
  return Math.min(100, Math.round(score / 2));
};

/**
 * Calculate Driving Score (0-100) based on amenities within 10 miles
 * @param userCoords User's coordinates
 * @param places Array of nearby places
 * @returns Driving score from 0 to 100
 */
export const calculateDrivingScore = (userCoords: Coordinates, places: Place[]): number => {
  if (!userCoords || places.length === 0) return 0;

  const drivingRadius = 10; // 10 miles
  const nearbyPlaces = places.filter(place => {
    const distance = calculateDistance(userCoords.lat, userCoords.lon, place.lat, place.lon);
    return distance <= drivingRadius;
  });

  // Different weights for driving (accessibility matters more than walkability)
  const weights: Record<string, number> = {
    'restaurant': 1,
    'cafe': 1,
    'grocery': 3,
    'pharmacy': 2,
    'bank': 1,
    'gym': 1,
    'school': 1,
    'hospital': 3,
    'shopping_mall': 4,
    'entertainment': 2
  };

  let score = 0;
  nearbyPlaces.forEach(place => {
    const amenity = place.tags?.amenity || '';
    const shop = place.tags?.shop || '';
    
    if (weights[amenity]) {
      score += weights[amenity];
    } else if (shop === 'supermarket' || shop === 'mall') {
      score += 3;
    } else if (amenity || shop) {
      score += 0.5; // Lower base score for driving
    }
  });

  // Normalize to 0-100 scale
  return Math.min(100, Math.round(score / 3));
};

/**
 * Calculate Urban/Suburban Index
 * @param userCoords User's coordinates
 * @param places Array of nearby places
 * @returns Urban index result with type, score, and description
 */
export const calculateUrbanIndex = (userCoords: Coordinates, places: Place[]): UrbanIndexResult => {
  if (!userCoords || places.length === 0) {
    return { type: 'Rural', score: 0, description: 'Very low amenity density' };
  }

  const oneMile = places.filter(place => {
    const distance = calculateDistance(userCoords.lat, userCoords.lon, place.lat, place.lon);
    return distance <= 1;
  }).length;

  const halfMile = places.filter(place => {
    const distance = calculateDistance(userCoords.lat, userCoords.lon, place.lat, place.lon);
    return distance <= 0.5;
  }).length;

  // Count specific urban indicators
  const restaurants = places.filter(p => 
    ['restaurant', 'cafe', 'bar', 'pub', 'fast_food'].includes(p.tags?.amenity || '')
  ).length;

  const publicTransport = places.filter(p => 
    ['bus_station', 'subway_entrance', 'taxi'].includes(p.tags?.amenity || '')
  ).length;

  // Calculate density score
  const densityScore = (halfMile * 2) + oneMile + (restaurants * 1.5) + (publicTransport * 2);

  if (densityScore >= 100) {
    return { 
      type: 'Urban', 
      score: Math.min(100, densityScore), 
      description: 'High density of amenities and services' 
    };
  } else if (densityScore >= 30) {
    return { 
      type: 'Suburban', 
      score: densityScore, 
      description: 'Moderate amenity density with good accessibility' 
    };
  } else {
    return { 
      type: 'Rural', 
      score: densityScore, 
      description: 'Lower density, more spread out amenities' 
    };
  }
};
