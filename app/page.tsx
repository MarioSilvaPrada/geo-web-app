'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Search, ArrowRight, Loader2, Building2, BarChart3 } from 'lucide-react';

export default function Home() {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setIsLoading(true);
    try {
      const encodedAddress = encodeURIComponent(address);
      router.push(`/results?address=${encodedAddress}`);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-20 blur-3xl transform -translate-x-32 translate-y-32"></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
              <MapPin className="w-4 h-4 mr-2" />
              Powered by OpenStreetMap & Overpass API
            </div>
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Discover</span>
              <br />
              <span className="text-gray-900">What's around you</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Transform any address into rich insights. Explore nearby amenities, businesses, and hidden gems with our powerful location intelligence platform.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-16">
            <form onSubmit={handleSubmit} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative flex items-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-2">
                <div className="flex-1 flex items-center pl-4">
                  <Search className="w-6 h-6 text-gray-400 mr-3" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter street address (e.g., 123 Main St, New York, NY)"
                    className="w-full py-4 text-lg bg-transparent border-none outline-none placeholder-gray-500 text-gray-900"
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !address.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Exploring...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span>Explore</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="group">
              <div className="glass-card rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Geocoding</h3>
                <p className="text-gray-600 leading-relaxed">Convert any address to precise coordinates with advanced geocoding technology</p>
              </div>
            </div>
            
            <div className="group">
              <div className="glass-card rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Nearby Discovery</h3>
                <p className="text-gray-600 leading-relaxed">Find restaurants, shops, services, and amenities in your vicinity instantly</p>
              </div>
            </div>
            
            <div className="group">
              <div className="glass-card rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Rich Analytics</h3>
                <p className="text-gray-600 leading-relaxed">Get detailed insights and metrics about any location with beautiful visualizations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}