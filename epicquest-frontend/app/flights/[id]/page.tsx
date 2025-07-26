'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import amadeusApi, { FlightOfferParams } from '@/lib/api/amadeusApi';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlane, FaArrowRight, FaClock, FaCalendarAlt, FaUser, FaSuitcase, FaInfoCircle, FaCheck } from 'react-icons/fa';

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

const FlightDetailsPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const flightId = params.id as string;
  
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [airlines, setAirlines] = useState<Record<string, Airline>>({});
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'fare'
  
  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // In a real application, we would call the API to get flight details
        // For demo purposes, we'll create mock data
        const mockFlight = createMockFlightData(flightId);
        
        setFlight(mockFlight);
        
        // Create airline data
        const airlineData: Record<string, Airline> = {};
        mockFlight.validatingAirlineCodes.forEach((code: string) => {
          if (!airlineData[code]) {
            airlineData[code] = {
              code,
              name: getAirlineName(code),
              logo: `/airlines/${code.toLowerCase()}.png`,
            };
          }
        });
        
        mockFlight.itineraries.forEach((itinerary: Itinerary) => {
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
        
        setAirlines(airlineData);
      } catch (err) {
        console.error('Error fetching flight details:', err);
        setError('Failed to fetch flight details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [flightId]);

  // Helper function to create mock flight data for demo purposes
  const createMockFlightData = (id: string): Flight => {
    const origin = searchParams.get('origin') || 'JFK';
    const destination = searchParams.get('destination') || 'LAX';
    const departureDate = searchParams.get('departureDate') || '2023-12-15';
    const returnDate = searchParams.get('returnDate') || '2023-12-22';
    const tripType = searchParams.get('tripType') || 'roundtrip';
    const cabinClass = searchParams.get('cabinClass') || 'economy';
    
    const createSegment = (from: string, to: string, date: string, duration: string, carrier: string): Segment => {
      const departureTime = new Date(date);
      departureTime.setHours(Math.floor(Math.random() * 24));
      
      const arrivalTime = new Date(departureTime);
      const durationHours = parseInt(duration.replace('PT', '').replace('H', ''), 10);
      arrivalTime.setHours(arrivalTime.getHours() + durationHours);
      
      return {
        departure: {
          iataCode: from,
          terminal: '1',
          at: departureTime.toISOString(),
        },
        arrival: {
          iataCode: to,
          terminal: '2',
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
    
    const carrier = 'AA';
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
    
    return {
      id,
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
              cabin: cabinClass.toUpperCase(),
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
    };
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

  // Helper function to calculate total passengers
  const getTotalPassengers = (): number => {
    const adults = parseInt(searchParams.get('adults') || '1', 10);
    const children = parseInt(searchParams.get('children') || '0', 10);
    const infants = parseInt(searchParams.get('infants') || '0', 10);
    
    return adults + children + infants;
  };

  // Handle booking
  const handleBooking = () => {
    if (!flight) return;
    
    // In a real application, we would call the API to get flight offer price
    // For demo purposes, we'll navigate directly to the checkout page
    router.push(
      `/flights/checkout?flightId=${flight.id}&origin=${searchParams.get('origin')}&destination=${searchParams.get('destination')}&departureDate=${searchParams.get('departureDate')}&returnDate=${searchParams.get('returnDate')}&adults=${searchParams.get('adults')}&children=${searchParams.get('children')}&infants=${searchParams.get('infants')}&cabinClass=${searchParams.get('cabinClass')}`
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Flight Details</h1>
        
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

        {/* Flight details */}
        {!loading && flight && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Flight information */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="mb-6 border-b border-gray-200">
                <div className="flex">
                  <button
                    className={`py-3 px-6 font-medium text-sm sm:text-base transition-colors duration-200 ${
                      activeTab === 'details'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('details')}
                  >
                    Flight Details
                  </button>
                  <button
                    className={`py-3 px-6 font-medium text-sm sm:text-base transition-colors duration-200 ${
                      activeTab === 'fare'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('fare')}
                  >
                    Fare Information
                  </button>
                </div>
              </div>
              
              {/* Flight details tab */}
              {activeTab === 'details' && (
                <div>
                  {/* Airline info */}
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center mb-4">
                      {flight.validatingAirlineCodes.map((code) => (
                        <div key={code} className="flex items-center mr-4">
                          <div className="w-10 h-10 mr-2 relative">
                            {airlines[code]?.logo ? (
                              <Image
                                src={airlines[code].logo}
                                alt={airlines[code].name}
                                fill
                                style={{ objectFit: 'contain' }}
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold">{code}</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{airlines[code]?.name}</div>
                            <div className="text-sm text-gray-500">Operated by {airlines[code]?.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p>
                        This flight is operated by {airlines[flight.validatingAirlineCodes[0]]?.name}. 
                        Please check in at the {airlines[flight.validatingAirlineCodes[0]]?.name} counter.
                      </p>
                    </div>
                  </div>
                  
                  {/* Itineraries */}
                  {flight.itineraries.map((itinerary, itineraryIndex) => (
                    <div 
                      key={itineraryIndex}
                      className="bg-white rounded-lg shadow-md p-6 mb-6"
                    >
                      <div className="flex items-center mb-4">
                        <h2 className="text-xl font-semibold">
                          {itineraryIndex === 0 ? 'Outbound Flight' : 'Return Flight'}
                        </h2>
                        <div className="ml-4 text-sm text-gray-600">
                          <FaClock className="inline mr-1" />
                          {formatDuration(itinerary.duration)}
                        </div>
                      </div>
                      
                      {itinerary.segments.map((segment, segmentIndex) => (
                        <div 
                          key={segmentIndex}
                          className={`${segmentIndex > 0 ? 'mt-8 pt-8 border-t border-dashed border-gray-200' : ''}`}
                        >
                          <div className="flex items-center mb-4">
                            <div className="w-8 h-8 mr-2 relative">
                              {airlines[segment.carrierCode]?.logo ? (
                                <Image
                                  src={airlines[segment.carrierCode]?.logo || ''}
                                  alt={airlines[segment.carrierCode]?.name || ''}
                                  fill
                                  style={{ objectFit: 'contain' }}
                                />
                              ) : (
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-bold">{segment.carrierCode}</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">
                                {airlines[segment.carrierCode]?.name} {segment.number}
                              </div>
                              <div className="text-sm text-gray-500">
                                {getCabinClassName(flight.travelerPricings[0].fareDetailsBySegment[0].cabin)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col md:flex-row md:items-center mb-6">
                            {/* Departure */}
                            <div className="flex-1">
                              <div className="text-2xl font-bold">{formatTime(segment.departure.at)}</div>
                              <div className="text-gray-600">{segment.departure.iataCode}</div>
                              <div className="text-sm text-gray-500">{formatDate(segment.departure.at)}</div>
                              {segment.departure.terminal && (
                                <div className="text-sm text-gray-500">Terminal {segment.departure.terminal}</div>
                              )}
                            </div>
                            
                            {/* Flight info */}
                            <div className="flex flex-col items-center py-4 md:py-0">
                              <div className="text-sm text-gray-500 mb-1">
                                {formatDuration(segment.duration)}
                              </div>
                              <div className="relative w-full md:w-48 h-0.5 bg-gray-300">
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-500"></div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Direct Flight
                              </div>
                            </div>
                            
                            {/* Arrival */}
                            <div className="flex-1 text-right">
                              <div className="text-2xl font-bold">{formatTime(segment.arrival.at)}</div>
                              <div className="text-gray-600">{segment.arrival.iataCode}</div>
                              <div className="text-sm text-gray-500">{formatDate(segment.arrival.at)}</div>
                              {segment.arrival.terminal && (
                                <div className="text-sm text-gray-500">Terminal {segment.arrival.terminal}</div>
                              )}
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-md">
                            <div className="text-sm">
                              <div className="mb-2">
                                <span className="font-medium">Aircraft:</span> {segment.aircraft.code}
                              </div>
                              <div className="mb-2">
                                <span className="font-medium">Distance:</span> Approximately 2,475 miles
                              </div>
                              <div>
                                <span className="font-medium">Baggage Allowance:</span> {flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity} checked bag(s) included
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Fare information tab */}
              {activeTab === 'fare' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Fare Information</h2>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Fare Rules</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-2" />
                        <div>
                          <span className="font-medium">Cancellation:</span> Cancellations allowed up to 24 hours before departure with a fee of $100.
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-2" />
                        <div>
                          <span className="font-medium">Changes:</span> Changes allowed up to 24 hours before departure with a fee of $75.
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-2" />
                        <div>
                          <span className="font-medium">Baggage:</span> {flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity} checked bag(s) included per passenger. Additional bags can be purchased.
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-2" />
                        <div>
                          <span className="font-medium">Seat Selection:</span> Standard seat selection included. Premium seats available for an additional fee.
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Price Breakdown</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Base Fare ({getTotalPassengers()} passenger{getTotalPassengers() > 1 ? 's' : ''})</span>
                        <span>${parseFloat(flight.travelerPricings[0].price.base) * getTotalPassengers()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxes & Fees</span>
                        <span>
                          ${flight.travelerPricings[0].price.taxes.reduce((total, tax) => total + parseFloat(tax.amount), 0) * getTotalPassengers()}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold pt-2 border-t border-gray-200 mt-2">
                        <span>Total</span>
                        <span>${parseFloat(flight.price.total) * getTotalPassengers()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Additional Information</h3>
                    <div className="text-sm text-gray-600">
                      <p className="mb-2">
                        Prices are guaranteed once the booking is confirmed. Fares are subject to availability and may change without notice.
                      </p>
                      <p>
                        Please review all fare rules and restrictions before completing your booking.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Booking summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
                
                {/* Flight summary */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <FaPlane className="text-blue-600 mr-2" />
                    <div className="font-medium">
                      {searchParams.get('origin')} to {searchParams.get('destination')}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {searchParams.get('tripType') === 'roundtrip' ? 'Round Trip' : 'One Way'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <FaCalendarAlt className="mr-1" />
                    <span>
                      {searchParams.get('departureDate')}
                      {searchParams.get('tripType') === 'roundtrip' && ` - ${searchParams.get('returnDate')}`}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <FaUser className="mr-1" />
                    <span>
                      {searchParams.get('adults')} Adults
                      {parseInt(searchParams.get('children') || '0') > 0 && `, ${searchParams.get('children')} Children`}
                      {parseInt(searchParams.get('infants') || '0') > 0 && `, ${searchParams.get('infants')} Infants`}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {getCabinClassName(flight.travelerPricings[0].fareDetailsBySegment[0].cabin)}
                  </div>
                </div>
                
                {/* Price breakdown */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Fare</span>
                    <span>${parseFloat(flight.travelerPricings[0].price.base) * getTotalPassengers()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Taxes & Fees</span>
                    <span>
                      ${flight.travelerPricings[0].price.taxes.reduce((total, tax) => total + parseFloat(tax.amount), 0) * getTotalPassengers()}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2">
                    <span>Total</span>
                    <span>${parseFloat(flight.price.total) * getTotalPassengers()}</span>
                  </div>
                </div>
                
                {/* Booking button */}
                <button
                  onClick={handleBooking}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-150 ease-in-out"
                >
                  Continue to Booking
                </button>
                
                {/* Fare conditions */}
                <div className="mt-4 text-xs text-gray-500">
                  By clicking "Continue to Booking", you agree to the fare rules and restrictions.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default FlightDetailsPage;