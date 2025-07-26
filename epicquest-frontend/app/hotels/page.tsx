'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import hotelbedsApi, { HotelSearchParams } from '@/lib/api/hotelbedsApi';
import Link from 'next/link';
import Image from 'next/image';
import { FaStar, FaMapMarkerAlt, FaWifi, FaParking, FaSwimmingPool, FaUtensils } from 'react-icons/fa';

// Types
interface Hotel {
  code: string;
  name: string;
  categoryCode: string;
  categoryName: string;
  destinationCode: string;
  destinationName: string;
  zoneCode: string;
  zoneName: string;
  latitude: string;
  longitude: string;
  minRate: string;
  maxRate: string;
  currency: string;
  rooms: number;
  adults: number;
  children: number;
  checkIn: string;
  checkOut: string;
  thumbnailUrl?: string;
}

const HotelSearchResults = () => {
  const searchParams = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get search parameters from URL
        const destination = searchParams.get('destination') || '';
        const checkIn = searchParams.get('checkIn') || '';
        const checkOut = searchParams.get('checkOut') || '';
        const rooms = parseInt(searchParams.get('rooms') || '1', 10);
        const adults = parseInt(searchParams.get('adults') || '2', 10);
        const children = parseInt(searchParams.get('children') || '0', 10);

        // Validate required parameters
        if (!destination || !checkIn || !checkOut) {
          setError('Missing required search parameters');
          setLoading(false);
          return;
        }

        // Create search params object
        const searchParamsObj: HotelSearchParams = {
          destination,
          checkIn,
          checkOut,
          rooms,
          adults,
          children,
        };

        // Call API to search hotels
        const response = await hotelbedsApi.searchHotels(searchParamsObj);
        
        // Transform API response to our Hotel type
        const transformedHotels: Hotel[] = response.hotels.map((hotel: any) => ({
          ...hotel,
          rooms,
          adults,
          children,
          checkIn,
          checkOut,
          // Add a placeholder image URL if none is provided
          thumbnailUrl: hotel.thumbnailUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        }));

        setHotels(transformedHotels);
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError('Failed to fetch hotels. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [searchParams]);

  // Helper function to render star rating
  const renderStarRating = (category: string) => {
    const stars = parseInt(category.replace('STAR', '').trim(), 10) || 0;
    return (
      <div className="flex">
        {[...Array(stars)].map((_, i) => (
          <FaStar key={i} className="text-yellow-400" />
        ))}
      </div>
    );
  };

  // Helper function to render hotel amenities
  const renderAmenities = (hotel: Hotel) => {
    // In a real app, these would come from the API
    // For now, we'll randomly assign some amenities
    const amenities = [
      { icon: <FaWifi />, name: 'Free WiFi' },
      { icon: <FaParking />, name: 'Parking' },
      { icon: <FaSwimmingPool />, name: 'Pool' },
      { icon: <FaUtensils />, name: 'Restaurant' },
    ];

    return (
      <div className="flex flex-wrap gap-3 mt-2">
        {amenities.slice(0, Math.floor(Math.random() * 4) + 1).map((amenity, index) => (
          <div key={index} className="flex items-center text-sm text-gray-500">
            <span className="mr-1">{amenity.icon}</span>
            <span>{amenity.name}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Hotel Search Results</h1>
        
        {/* Search summary */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2 text-blue-600" />
              <span className="font-medium">Destination:</span>
              <span className="ml-1">{searchParams.get('destination')}</span>
            </div>
            <div>
              <span className="font-medium">Check-in:</span>
              <span className="ml-1">{searchParams.get('checkIn')}</span>
            </div>
            <div>
              <span className="font-medium">Check-out:</span>
              <span className="ml-1">{searchParams.get('checkOut')}</span>
            </div>
            <div>
              <span className="font-medium">Guests:</span>
              <span className="ml-1">
                {searchParams.get('adults')} Adults, {searchParams.get('children')} Children
              </span>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* No results */}
        {!loading && !error && hotels.length === 0 && (
          <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg mb-6">
            <p>No hotels found matching your search criteria. Please try different dates or destination.</p>
          </div>
        )}

        {/* Hotel list */}
        {!loading && !error && hotels.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <Link 
                href={`/hotels/${hotel.code}?checkIn=${hotel.checkIn}&checkOut=${hotel.checkOut}&rooms=${hotel.rooms}&adults=${hotel.adults}&children=${hotel.children}`}
                key={hotel.code}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={hotel.thumbnailUrl || '/placeholder-hotel.jpg'}
                    alt={hotel.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold mb-1">{hotel.name}</h2>
                    {renderStarRating(hotel.categoryName)}
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>{hotel.destinationName}, {hotel.zoneName}</span>
                  </div>
                  
                  {renderAmenities(hotel)}
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-end">
                    <div>
                      <span className="text-sm text-gray-500">From</span>
                      <div className="text-2xl font-bold text-blue-600">${hotel.minRate}</div>
                      <span className="text-sm text-gray-500">per night</span>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-150 ease-in-out">
                      View Deal
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default HotelSearchResults;