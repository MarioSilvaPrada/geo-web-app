export interface Coordinates {
  lat: number;
  lon: number;
}

export interface Place {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
}

export interface GeocodeResult {
  place_id: number;
  licence: string;
  lat: string;
  lon: string;
  display_name: string;
  address: Record<string, string>;
}

export interface UrbanIndexResult {
  type: string;
  score: number;
  description: string;
}
