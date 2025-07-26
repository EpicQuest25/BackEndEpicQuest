'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import hotelbedsApi, { HotelDetailsParams } from '@/lib/api/hotelbedsApi';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaMapMarkerAlt, FaWifi, FaParking, FaSwimmingPool, FaUtensils, FaCoffee, FaGlassMartiniAlt, FaSpa, FaConciergeBell, FaCheck } from 'react-icons/fa';

// Types
interface HotelDetails {
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
  description: string;
  address: string;
  postalCode: string;
  city: string;
  email: string;
  phones: string[];
  rooms: Room[];
  facilities: Facility[];
  images: Image[];
  web: string;
}

interface Room {
  code: string;
  name: string;
  rates: Rate[];
  description: string;
  images: Image[];
  facilities: Facility[];
}

interface Rate {
  rateKey: string;
  rateClass: string;
  rateType: string;
  net: string;
  allotment: number;
  paymentType: string;
  packaging: boolean;
  boardCode: string;
  boardName: string;
  cancellationPolicies: CancellationPolicy[];
}

interface CancellationPolicy {
  amount: string;
  from: string;
}

interface Facility {
  code: string;
  name: string;
  description: string;
}

interface Image {
  url: string;
  type: string;
}

const HotelDetailsPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const hotelId = params.id as string;
  
  const [hotel, setHotel] = useState<HotelDetails | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Get search parameters from URL
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const rooms = parseInt(searchParams.get('rooms') || '1', 10);
  const adults = parseInt(searchParams.get('adults') || '2', 10);
  const children = parseInt(searchParams.get('children') || '0', 10);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Validate required parameters
        if (!hotelId) {
          setError('Missing hotel ID');
          setLoading(false);
          return;
        }

        // Create params object
        const detailsParams: HotelDetailsParams = {
          hotelCode: hotelId,
        };

        // Call API to get hotel details
        const response = await hotelbedsApi.getHotelDetails(detailsParams);
        
        // For demo purposes, if the API doesn't return data, create mock data
        const hotelDetails = response.hotel || createMockHotelDetails(hotelId);
        
        setHotel(hotelDetails);
      } catch (err) {
        console.error('Error fetching hotel details:', err);
        setError('Failed to fetch hotel details. Please try again.');
        
        // For demo purposes, create mock data on error
        const mockHotel = createMockHotelDetails(hotelId);
        setHotel(mockHotel);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [hotelId]);

  // Helper function to create mock hotel details for demo purposes
  const createMockHotelDetails = (id: string): HotelDetails => {
    return {
      code: id,
      name: 'Luxury Hotel & Spa',
      categoryCode: '5',
      categoryName: '5 STAR',
      destinationCode: 'NYC',
      destinationName: 'New York',
      zoneCode: 'MAN',
      zoneName: 'Manhattan',
      latitude: '40.7128',
      longitude: '-74.0060',
      description: 'This luxurious hotel offers stunning views of the city skyline and is located in the heart of Manhattan. Featuring elegant rooms, a world-class spa, and exceptional dining options, it provides the perfect base for exploring New York City. The hotel is within walking distance of major attractions, shopping districts, and public transportation.',
      address: '123 Broadway',
      postalCode: '10001',
      city: 'New York',
      email: 'info@luxuryhotel.com',
      phones: ['+1 212-555-1234'],
      rooms: [
        {
          code: 'DBL',
          name: 'Deluxe Double Room',
          description: 'Spacious room with a king-size bed, city views, and a luxurious bathroom with a rainfall shower.',
          rates: [
            {
              rateKey: 'DBL-1',
              rateClass: 'NOR',
              rateType: 'BOOKABLE',
              net: '299.00',
              allotment: 10,
              paymentType: 'AT_WEB',
              packaging: false,
              boardCode: 'BB',
              boardName: 'Bed & Breakfast',
              cancellationPolicies: [
                {
                  amount: '149.50',
                  from: '2023-12-15T00:00:00',
                },
              ],
            },
          ],
          images: [
            {
              url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80',
              type: 'ROOM',
            },
          ],
          facilities: [
            {
              code: 'WIFI',
              name: 'Free WiFi',
              description: 'Complimentary high-speed WiFi',
            },
            {
              code: 'MINIBAR',
              name: 'Minibar',
              description: 'Fully stocked minibar',
            },
          ],
        },
        {
          code: 'SUI',
          name: 'Executive Suite',
          description: 'Luxurious suite with separate living area, king-size bed, and panoramic city views.',
          rates: [
            {
              rateKey: 'SUI-1',
              rateClass: 'NOR',
              rateType: 'BOOKABLE',
              net: '499.00',
              allotment: 5,
              paymentType: 'AT_WEB',
              packaging: false,
              boardCode: 'HB',
              boardName: 'Half Board',
              cancellationPolicies: [
                {
                  amount: '249.50',
                  from: '2023-12-15T00:00:00',
                },
              ],
            },
          ],
          images: [
            {
              url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
              type: 'ROOM',
            },
          ],
          facilities: [
            {
              code: 'WIFI',
              name: 'Free WiFi',
              description: 'Complimentary high-speed WiFi',
            },
            {
              code: 'MINIBAR',
              name: 'Minibar',
              description: 'Fully stocked minibar',
            },
            {
              code: 'BATHTUB',
              name: 'Bathtub',
              description: 'Luxury bathtub',
            },
          ],
        },
      ],
      facilities: [
        {
          code: 'WIFI',
          name: 'Free WiFi',
          description: 'Complimentary high-speed WiFi throughout the property',
        },
        {
          code: 'POOL',
          name: 'Swimming Pool',
          description: 'Indoor heated swimming pool',
        },
        {
          code: 'SPA',
          name: 'Spa',
          description: 'Full-service spa offering massages and treatments',
        },
        {
          code: 'GYM',
          name: 'Fitness Center',
          description: '24-hour fitness center with modern equipment',
        },
        {
          code: 'RESTAURANT',
          name: 'Restaurant',
          description: 'Fine dining restaurant serving international cuisine',
        },
        {
          code: 'BAR',
          name: 'Bar/Lounge',
          description: 'Elegant bar serving cocktails and light snacks',
        },
        {
          code: 'PARKING',
          name: 'Parking',
          description: 'Valet parking available',
        },
        {
          code: 'CONCIERGE',
          name: 'Concierge',
          description: '24-hour concierge service',
        },
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
          type: 'GENERAL',
        },
        {
          url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
          type: 'LOBBY',
        },
        {
          url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
          type: 'POOL',
        },
        {
          url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
          type: 'RESTAURANT',
        },
      ],
      web: 'https://www.luxuryhotel.com',
    };
  };

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

  // Helper function to render facility icon
  const renderFacilityIcon = (code: string) => {
    switch (code.toUpperCase()) {
      case 'WIFI':
        return <FaWifi />;
      case 'POOL':
        return <FaSwimmingPool />;
      case 'RESTAURANT':
        return <FaUtensils />;
      case 'PARKING':
        return <FaParking />;
      case 'BAR':
        return <FaGlassMartiniAlt />;
      case 'SPA':
        return <FaSpa />;
      case 'CONCIERGE':
        return <FaConciergeBell />;
      case 'COFFEE':
        return <FaCoffee />;
      default:
        return <FaCheck />;
    }
  };

  // Handle room selection
  const handleRoomSelection = (roomCode: string) => {
    setSelectedRoom(roomCode === selectedRoom ? null : roomCode);
  };

  // Calculate total price
  const calculateTotalPrice = (rate: Rate) => {
    const pricePerNight = parseFloat(rate.net);
    const nights = calculateNights(checkIn, checkOut);
    return (pricePerNight * nights).toFixed(2);
  };

  // Calculate number of nights
  const calculateNights = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return 1;
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 1;
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
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

        {/* Hotel details */}
        {!loading && hotel && (
          <div>
            {/* Hotel header */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
                <div className="flex items-center mb-2">
                  {renderStarRating(hotel.categoryName)}
                  <span className="ml-2 text-gray-600">{hotel.categoryName}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{hotel.address}, {hotel.city}, {hotel.destinationName}</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <Link 
                  href={`/hotels/checkout?hotelId=${hotel.code}&checkIn=${checkIn}&checkOut=${checkOut}&rooms=${rooms}&adults=${adults}&children=${children}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-150 ease-in-out"
                >
                  Book Now
                </Link>
              </div>
            </div>

            {/* Hotel images */}
            <div className="mb-8">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <Image
                  src={hotel.images[activeImageIndex]?.url || '/placeholder-hotel.jpg'}
                  alt={hotel.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="flex mt-2 space-x-2 overflow-x-auto pb-2">
                {hotel.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`relative h-20 w-32 rounded-md overflow-hidden cursor-pointer ${
                      activeImageIndex === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <Image
                      src={image.url}
                      alt={`${hotel.name} - ${image.type}`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Hotel description */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">About this hotel</h2>
              <p className="text-gray-700">{hotel.description}</p>
            </div>

            {/* Hotel facilities */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {hotel.facilities.map((facility) => (
                  <div key={facility.code} className="flex items-center">
                    <div className="text-blue-600 mr-2">
                      {renderFacilityIcon(facility.code)}
                    </div>
                    <span>{facility.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room selection */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Available Rooms</h2>
              <div className="space-y-4">
                {hotel.rooms.map((room) => (
                  <div 
                    key={room.code}
                    className={`border rounded-lg overflow-hidden transition-shadow duration-300 ${
                      selectedRoom === room.code ? 'border-blue-500 shadow-md' : 'border-gray-200'
                    }`}
                  >
                    <div 
                      className="flex flex-col md:flex-row cursor-pointer"
                      onClick={() => handleRoomSelection(room.code)}
                    >
                      {/* Room image */}
                      <div className="relative h-48 md:h-auto md:w-1/3">
                        <Image
                          src={room.images[0]?.url || '/placeholder-room.jpg'}
                          alt={room.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      
                      {/* Room details */}
                      <div className="p-4 md:w-2/3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                            <p className="text-gray-700 mb-4">{room.description}</p>
                            
                            {/* Room facilities */}
                            <div className="flex flex-wrap gap-4 mb-4">
                              {room.facilities.map((facility) => (
                                <div key={facility.code} className="flex items-center text-sm text-gray-600">
                                  <div className="text-blue-600 mr-1">
                                    {renderFacilityIcon(facility.code)}
                                  </div>
                                  <span>{facility.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Room price */}
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              ${room.rates[0]?.net}
                            </div>
                            <div className="text-sm text-gray-500">per night</div>
                          </div>
                        </div>
                        
                        {/* Expand/collapse indicator */}
                        <div className="flex justify-end mt-2">
                          <span className="text-blue-600">
                            {selectedRoom === room.code ? 'Hide details' : 'Show details'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded details */}
                    {selectedRoom === room.code && (
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2">Rate Details</h4>
                          <div className="space-y-2">
                            {room.rates.map((rate) => (
                              <div key={rate.rateKey} className="p-4 bg-white rounded-md shadow-sm">
                                <div className="flex justify-between mb-2">
                                  <span className="font-medium">{rate.boardName}</span>
                                  <span className="text-blue-600 font-bold">${rate.net} per night</span>
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                  Payment type: {rate.paymentType.replace('_', ' ')}
                                </div>
                                {rate.cancellationPolicies.length > 0 && (
                                  <div className="text-sm text-gray-600">
                                    <span className="font-medium">Cancellation policy:</span> Free cancellation until{' '}
                                    {new Date(rate.cancellationPolicies[0].from).toLocaleDateString()}
                                  </div>
                                )}
                                <div className="mt-4 flex justify-between items-center">
                                  <div>
                                    <div className="text-sm text-gray-600">
                                      Total for {calculateNights(checkIn, checkOut)} nights:
                                    </div>
                                    <div className="text-xl font-bold text-blue-600">
                                      ${calculateTotalPrice(rate)}
                                    </div>
                                  </div>
                                  <Link 
                                    href={`/hotels/checkout?hotelId=${hotel.code}&roomId=${room.code}&rateKey=${rate.rateKey}&checkIn=${checkIn}&checkOut=${checkOut}&rooms=${rooms}&adults=${adults}&children=${children}`}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
                                  >
                                    Book Now
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default HotelDetailsPage;