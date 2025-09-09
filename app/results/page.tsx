"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";
import {
  AlertTriangle,
  AlertCircle,
  ArrowLeft,
  MapPin,
  Map,
  Building2,
  Info,
  TrendingUp,
  Footprints,
  Car,
  Building,
  BarChart3,
} from "lucide-react";
import { Coordinates, GeocodeResult, Place } from "@/types";

interface GeocodeApiResponse {
  coordinates: { lat: number; lon: number };
  geocode: GeocodeResult[];
  places: Place[];
}

import {
  calculateDrivingScore,
  calculateUrbanIndex,
  calculateWalkingScore,
} from "@/utils/calculations";
import { categorizeAmenities, getCategoryIcon } from "@/utils/categories";

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import("../components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg"></div>
  ),
});

export default function Results() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [geocodeResult, setGeocodeResult] = useState<GeocodeResult | null>(
    null
  );

  const searchParams = useSearchParams();
  const router = useRouter();
  const address = searchParams.get("address");

  useEffect(() => {
    if (address) {
      geocodeAddress(address);
    }
  }, [address]);

  const geocodeAddress = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get<GeocodeApiResponse>("/api/geocode", {
        params: { address: query },
      });

      if (
        response.data.coordinates &&
        response.data.geocode &&
        response.data.places
      ) {
        const geocoded = response.data.geocode[0];

        setCoordinates(response.data.coordinates);
        setPlaces(response.data.places);
        setGeocodeResult(geocoded);
      } else {
        throw new Error("No results found for this address");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to geocode address"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="glass-card rounded-2xl p-12 text-center shadow-2xl border max-w-md mx-4">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-900">
            No Address Provided
          </h1>
          <p className="text-gray-600 mb-8">
            Please provide an address to analyze
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="glass-card rounded-2xl p-12 text-center shadow-2xl border max-w-md mx-4">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Error</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/")}
              className="w-full px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Try Another Address
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const categorizedPlaces =
    places.length > 0 ? categorizeAmenities(places) : {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.push("/")}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 bg-white/70 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white/90 border shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </button>
          </div>
          <div className="glass-card rounded-2xl p-8 shadow-xl border">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Location Analysis
                </h1>
                <p className="text-lg text-gray-700 mb-4">
                  {geocodeResult?.display_name || address}
                </p>
                {coordinates && (
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>Found {places.length} nearby places</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="w-4 h-4 mr-1" />
                      <span>Analysis within 3 mile radius</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="glass-card rounded-2xl p-12 text-center shadow-xl border">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              Analyzing Location...
            </h2>
            <p className="text-gray-600">
              Finding nearby amenities and calculating scores
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Location Scores - Top Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Walking Score */}
              <div className="glass-card rounded-2xl p-6 shadow-xl border hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                    <Footprints className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Walking Score
                  </h3>
                </div>
                {coordinates && (
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {calculateWalkingScore(coordinates, places)}
                    </div>
                    <div className="text-sm text-gray-600">Out of 100</div>
                    <div className="mt-3 text-xs text-gray-500">
                      Based on walkable amenities within 1 mile
                    </div>
                  </div>
                )}
              </div>

              {/* Driving Score */}
              <div className="glass-card rounded-2xl p-6 shadow-xl border hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <Car className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Driving Score
                  </h3>
                </div>
                {coordinates && (
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {calculateDrivingScore(coordinates, places)}
                    </div>
                    <div className="text-sm text-gray-600">Out of 100</div>
                    <div className="mt-3 text-xs text-gray-500">
                      Based on car-accessible amenities within 10 miles
                    </div>
                  </div>
                )}
              </div>

              {/* Urban/Suburban Index */}
              <div className="glass-card rounded-2xl p-6 shadow-xl border hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <Building className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Urban Index
                  </h3>
                </div>
                {coordinates && (
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {calculateUrbanIndex(coordinates, places).score}
                    </div>
                    <div className="text-sm text-gray-600">Out of 100</div>
                    <div className="mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                      {calculateUrbanIndex(coordinates, places).type}
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      {calculateUrbanIndex(coordinates, places).description}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Map (spans 2 columns on large screens) */}
              <div className="lg:col-span-2">
                <div className="glass-card rounded-2xl p-6 shadow-xl border hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                      <Map className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Interactive Map
                    </h2>
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-lg h-96">
                    {coordinates && (
                      <MapComponent center={coordinates} places={places} />
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="glass-card rounded-2xl p-6 shadow-xl border hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Area Statistics
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {places.length}
                        </div>
                        <div className="text-sm font-medium text-blue-700">
                          Total Places
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {
                            Object.keys(categorizedPlaces).filter(
                              (cat) => categorizedPlaces[cat].length > 0
                            ).length
                          }
                        </div>
                        <div className="text-sm font-medium text-green-700">
                          Categories
                        </div>
                      </div>
                    </div>

                    {coordinates && (
                      <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border">
                        <div className="text-sm text-gray-700">
                          <div className="flex items-center mb-2">
                            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                            <strong>Precise Coordinates</strong>
                          </div>
                          <div className="grid grid-cols-1 gap-1 text-xs ml-6">
                            <div>
                              Latitude:{" "}
                              <span className="font-mono text-blue-600">
                                {coordinates.lat.toFixed(6)}
                              </span>
                            </div>
                            <div>
                              Longitude:{" "}
                              <span className="font-mono text-blue-600">
                                {coordinates.lon.toFixed(6)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section - Nearby Amenities (Full Width) */}
            <div className="glass-card rounded-2xl p-6 shadow-xl border hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Nearby Amenities
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(categorizedPlaces).map(
                  ([category, categoryPlaces]) => {
                    if (categoryPlaces.length === 0) return null;

                    return (
                      <div
                        key={category}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <span className="text-xl mr-3">
                              {getCategoryIcon(category)}
                            </span>
                            <h3 className="font-semibold text-gray-900 text-sm">
                              {category}
                            </h3>
                          </div>
                          <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-medium rounded-full">
                            {categoryPlaces.length}
                          </span>
                        </div>
                        <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                          {categoryPlaces.slice(0, 4).map((place, index) => (
                            <div
                              key={place.id || index}
                              className="flex items-start p-2 hover:bg-white rounded-lg transition-colors duration-150"
                            >
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-medium text-gray-900 truncate">
                                  {place.tags?.name ||
                                    place.tags?.amenity ||
                                    "Unnamed"}
                                </div>
                                {place.tags?.addr_street && (
                                  <div className="text-xs text-gray-500 truncate">
                                    {place.tags.addr_street}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          {categoryPlaces.length > 4 && (
                            <div className="text-xs text-gray-500 pl-4 pt-1">
                              +{categoryPlaces.length - 4} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
