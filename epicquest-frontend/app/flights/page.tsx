'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import amadeusApi, { FlightSearchParams } from '@/lib/api/amadeusApi';
import Link from 'next/link';
import Image from 'next/image';
import { FaPlane, FaArrowRight, FaExchangeAlt, FaClock, FaCalendarAlt, FaUser } from 'react-icons/fa';

// Types
interface Flight {
  id: string;
  itineraries: Itinerary[];
  price: {
    total: string;
    currency: string;
  };
  travelerPricings: TravelerPricing[];
  validatingAirlineCodes: string[];
}

interface Itinerary {
  duration: string;
  segments: Segment[];
}

interface Segment {
  departure: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  carrierCode: string;
  number: string;
  aircraft: {
    code: string;
  };
  operating: {
    carrierCode: string;
  };
  duration: string;
  stops?: Stop[];
}

interface Stop {
  iataCode: string;
  duration: string;
}

interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: {
    currency: string;
    total: string;
    base: string;
    taxes: Tax[];
  };
  fareDetailsBySegment: FareDetails[];
}

interface Tax {
  amount: string;
  code: string;
}

interface FareDetails {
  segmentId: string;
  cabin: string;
  fareBasis: string;
  class: string;
  includedCheckedBags: {
    quantity: number;
  };
}

interface Airline {
  code: string;
  name: string;
  logo?: string;
}

const FlightSearchResults = () => {
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [airlines, setAirlines] = useState<Record<string, Airline>>({});

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get search parameters from URL
        const tripType = (searchParams.get('tripType') || 'roundtrip') as 'oneway' | 'roundtrip';
        const origin = searchParams.get('origin') || '';
        const destination = searchParams.get('destination') || '';
        const departureDate = searchParams.get('departureDate') || '';
        const returnDate = searchParams.get('returnDate') || '';
        const adults = parseInt(searchParams.get('adults') || '1', 10);
        const children = parseInt(searchParams.get('children') || '0', 10);
        const infants = parseInt(searchParams.get('infants') || '0', 10);
        const cabinClass = searchParams.get('cabinClass') || 'economy';

        // Validate required parameters
        if (!origin || !destination || !departureDate || (tripType === 'roundtrip' && !returnDate)) {
          setError('Missing required search parameters');
          setLoading(false);
          return;
        }

        // Create search params object
        const searchParamsObj: FlightSearchParams = {
          tripType,
          origin,
          destination,
          departureDate,
          returnDate: tripType === 'roundtrip' ? returnDate : undefined,
          adults,
          children,
          infants,
          cabinClass,
        };

        // Call API to search flights
        const response = await amadeusApi.searchFlights(searchParamsObj);
        
        // For demo purposes, if the API doesn't return data, create mock data
        const flightData = response.data?.length > 0 ? response.data : createMockFlightData(searchParamsObj);
        
        setFlights(flightData);
        
        // Create airline data
        const airlineData: Record<string, Airline> = {};
        flightData.forEach((flight: Flight) => {
          flight.validatingAirlineCodes.forEach((code: string) => {
            if (!airlineData[code]) {
              airlineData[code] = {
                code,
                name: getAirlineName(code),
                logo: `/airlines/${code.toLowerCase()}.png`,
              };
            }
          });
          
          flight.itineraries.forEach((itinerary: Itinerary) => {
            itinerary.segments.forEach((segment: Segment) => {
              if (!airlineData[segment.carrierCode]) {
                airlineData[segment.carrierCode] = {
                  code: segment.carrierCode,
                  name: getAirlineName(segment.carrierCode),
                  logo: `/airlines/${segment.carrierCode.toLowerCase()}.png`,
                };
              }
            });
          });
        });
        
        setAirlines(airlineData);
      } catch (err) {
        console.error('Error fetching flights:', err);
        setError('Failed to fetch flights. Please try again.');
        
        // For demo purposes, create mock data on error
        const mockSearchParams: FlightSearchParams = {
          tripType: (searchParams.get('tripType') || 'roundtrip') as 'oneway' | 'roundtrip',
          origin: searchParams.get('origin') || 'JFK',
          destination: searchParams.get('destination') || 'LAX',
          departureDate: searchParams.get('departureDate') || '2023-12-15',
          returnDate: searchParams.get('returnDate') || '2023-12-22',
          adults: parseInt(searchParams.get('adults') || '1', 10),
          children: parseInt(searchParams.get('children') || '0', 10),
          infants: parseInt(searchParams.get('infants') || '0', 10),
          cabinClass: searchParams.get('cabinClass') || 'economy',
        };
        
        const mockFlights = createMockFlightData(mockSearchParams);
        setFlights(mockFlights);
        
        // Create airline data
        const airlineData: Record<string, Airline> = {};
        mockFlights.forEach((flight: Flight) => {
          flight.validatingAirlineCodes.forEach((code: string) => {
            if (!airlineData[code]) {
              airlineData[code] = {
                code,
                name: getAirlineName(code),
                logo: `/airlines/${code.toLowerCase()}.png`,
              };
            }
          });
        });
        
        setAirlines(airlineData);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [searchParams]);

  // Helper function to create mock flight data for demo purposes
  const createMockFlightData = (params: FlightSearchParams): Flight[] => {
    const { tripType, origin, destination, departureDate, returnDate } = params;
    
    const createSegment = (from: string, to: string, date: string, duration: string, carrier: string): Segment => {
      const departureTime = new Date(date);
      departureTime.setHours(Math.floor(Math.random() * 24));
      
      const arrivalTime = new Date(departureTime);
      const durationHours = parseInt(duration.replace('PT', '').replace('H', ''), 10);
      arrivalTime.setHours(arrivalTime.getHours() + durationHours);
      
      return {
        departure: {
          iataCode: from,
          at: departureTime.toISOString(),
        },
        arrival: {
          iataCode: to,
          at: arrivalTime.toISOString(),
        },
        carrierCode: carrier,
        number: `${carrier}${Math.floor(Math.random() * 1000) + 100}`,
        aircraft: {
          code: 'A320',
        },
        operating: {
          carrierCode: carrier,
        },
        duration,
      };
    };
    
    const carriers = ['AA', 'DL', 'UA', 'B6', 'WN'];
    const mockFlights: Flight[] = [];
    
    for (let i = 0; i < 10; i++) {
      const carrier = carriers[Math.floor(Math.random() * carriers.length)];
      const price = Math.floor(Math.random() * 500) + 200;
      
      const outboundSegments = [
        createSegment(origin, destination, departureDate, 'PT5H', carrier),
      ];
      
      const inboundSegments = tripType === 'roundtrip' && returnDate
        ? [createSegment(destination, origin, returnDate, 'PT5H', carrier)]
        : [];
      
      const itineraries = [
        {
          duration: 'PT5H',
          segments: outboundSegments,
        },
      ];
      
      if (inboundSegments.length > 0) {
        itineraries.push({
          duration: 'PT5H',
          segments: inboundSegments,
        });
      }
      
      mockFlights.push({
        id: `MOCK-${i}`,
        itineraries,
        price: {
          total: price.toString(),
          currency: 'USD',
        },
        travelerPricings: [
          {
            travelerId: '1',
            fareOption: 'STANDARD',
            travelerType: 'ADULT',
            price: {
              currency: 'USD',
              total: price.toString(),
              base: (price * 0.8).toString(),
              taxes: [
                {
                  amount: (price * 0.2).toString(),
                  code: 'TAX',
                },
              ],
            },
            fareDetailsBySegment: [
              {
                segmentId: '1',
                cabin: params.cabinClass.toUpperCase(),
                fareBasis: 'ELIGHT',
                class: 'E',
                includedCheckedBags: {
                  quantity: 1,
                },
              },
            ],
          },
        ],
        validatingAirlineCodes: [carrier],
      });
    }
    
    return mockFlights;
  };

  // Helper function to get airline name from code
  const getAirlineName = (code: string): string => {
    const airlineNames: Record<string, string> = {
      AA: 'American Airlines',
      DL: 'Delta Air Lines',
      UA: 'United Airlines',
      B6: 'JetBlue Airways',
      WN: 'Southwest Airlines',
      LH: 'Lufthansa',
      BA: 'British Airways',
      AF: 'Air France',
      EK: 'Emirates',
      QR: 'Qatar Airways',
    };
    
    return airlineNames[code] || `Airline ${code}`;
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Helper function to format time
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Helper function to calculate duration in hours and minutes
  const formatDuration = (duration: string): string => {
    const hours = duration.match(/(\d+)H/);
    const minutes = duration.match(/(\d+)M/);
    
    let result = '';
    if (hours) result += `${hours[1]}h `;
    if (minutes) result += `${minutes[1]}m`;
    
    return result.trim();
  };

  // Helper function to get cabin class name
  const getCabinClassName = (cabin: string): string => {
    const cabinNames: Record<string, string> = {
      ECONOMY: 'Economy',
      PREMIUM_ECONOMY: 'Premium Economy',
      BUSINESS: 'Business',
      FIRST: 'First Class',
    };
    
    return cabinNames[cabin] || cabin;
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Flight Search Results</h1>
        
        {/* Search summary */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <FaPlane className="mr-2 text-blue-600" />
              <span className="font-medium">Route:</span>
              <span className="ml-1">
                {searchParams.get('origin')} to {searchParams.get('destination')}
                {searchParams.get('tripType') === 'roundtrip' && ' (Round Trip)'}
              </span>
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-600" />
              <span className="font-medium">Dates:</span>
              <span className="ml-1">
                {searchParams.get('departureDate')}
                {searchParams.get('tripType') === 'roundtrip' && ` - ${searchParams.get('returnDate')}`}
              </span>
            </div>
            <div className="flex items-center">
              <FaUser className="mr-2 text-blue-600" />
              <span className="font-medium">Passengers:</span>
              <span className="ml-1">
                {searchParams.get('adults')} Adults
                {parseInt(searchParams.get('children') || '0') > 0 && `, ${searchParams.get('children')} Children`}
                {parseInt(searchParams.get('infants') || '0') > 0 && `, ${searchParams.get('infants')} Infants`}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium">Class:</span>
              <span className="ml-1">
                {searchParams.get('cabinClass')?.charAt(0).toUpperCase()}
                {searchParams.get('cabinClass')?.slice(1)}
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
        {!loading && !error && flights.length === 0 && (
          <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg mb-6">
            <p>No flights found matching your search criteria. Please try different dates or destinations.</p>
          </div>
        )}

        {/* Flight list */}
        {!loading && !error && flights.length > 0 && (
          <div className="space-y-6">
            {flights.map((flight) => (
              <div 
                key={flight.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                {/* Flight header */}
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {flight.validatingAirlineCodes.map((code) => (
                        <div key={code} className="flex items-center mr-4">
                          <div className="w-8 h-8 mr-2 relative">
                            {airlines[code]?.logo ? (
                              <Image
                                src={airlines[code].logo}
                                alt={airlines[code].name}
                                fill
                                style={{ objectFit: 'contain' }}
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold">{code}</span>
                              </div>
                            )}
                          </div>
                          <span className="font-medium">{airlines[code]?.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      ${flight.price.total}
                    </div>
                  </div>
                </div>
                
                {/* Flight details */}
                <div className="p-4">
                  {flight.itineraries.map((itinerary, itineraryIndex) => (
                    <div 
                      key={itineraryIndex}
                      className={`${itineraryIndex > 0 ? 'mt-6 pt-6 border-t border-gray-200' : ''}`}
                    >
                      <div className="flex items-center mb-2">
                        <span className="font-medium text-gray-600">
                          {itineraryIndex === 0 ? 'Outbound' : 'Return'} • {formatDuration(itinerary.duration)}
                        </span>
                      </div>
                      
                      {itinerary.segments.map((segment, segmentIndex) => (
                        <div 
                          key={segmentIndex}
                          className={`${segmentIndex > 0 ? 'mt-4 pt-4 border-t border-dashed border-gray-200' : ''}`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center">
                            {/* Departure */}
                            <div className="flex-1">
                              <div className="text-2xl font-bold">{formatTime(segment.departure.at)}</div>
                              <div className="text-gray-600">{segment.departure.iataCode}</div>
                              <div className="text-sm text-gray-500">{formatDate(segment.departure.at)}</div>
                            </div>
                            
                            {/* Flight info */}
                            <div className="flex flex-col items-center py-4 md:py-0">
                              <div className="text-sm text-gray-500 mb-1">
                                {formatDuration(segment.duration)}
                              </div>
                              <div className="relative w-full md:w-32 h-0.5 bg-gray-300">
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-500"></div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {airlines[segment.carrierCode]?.name} {segment.number}
                              </div>
                            </div>
                            
                            {/* Arrival */}
                            <div className="flex-1 text-right">
                              <div className="text-2xl font-bold">{formatTime(segment.arrival.at)}</div>
                              <div className="text-gray-600">{segment.arrival.iataCode}</div>
                              <div className="text-sm text-gray-500">{formatDate(segment.arrival.at)}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  
                  {/* Fare details */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <div className="font-medium mb-1">
                          {getCabinClassName(flight.travelerPricings[0].fareDetailsBySegment[0].cabin)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity > 0
                            ? `${flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity} checked bag${
                                flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity > 1 ? 's' : ''
                              } included`
                            : 'No checked bags included'}
                        </div>
                      </div>
                      
                      <Link 
                        href={`/flights/${flight.id}?origin=${searchParams.get('origin')}&destination=${searchParams.get('destination')}&departureDate=${searchParams.get('departureDate')}&returnDate=${searchParams.get('returnDate')}&adults=${searchParams.get('adults')}&children=${searchParams.get('children')}&infants=${searchParams.get('infants')}&cabinClass=${searchParams.get('cabinClass')}`}
                        className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
                      >
                        Select
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default FlightSearchResults;