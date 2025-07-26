'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaExchangeAlt } from 'react-icons/fa';

type TripType = 'oneway' | 'roundtrip';
type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first';

const FlightSearchForm = () => {
  const router = useRouter();
  const [tripType, setTripType] = useState<TripType>('roundtrip');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | null>(new Date());
  const [returnDate, setReturnDate] = useState<Date | null>(
    new Date(new Date().setDate(new Date().getDate() + 7))
  );
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState<CabinClass>('economy');

  const handleSwapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format dates for URL
    const departureDateStr = departureDate ? departureDate.toISOString().split('T')[0] : '';
    const returnDateStr = returnDate ? returnDate.toISOString().split('T')[0] : '';
    
    // Navigate to search results page with query parameters
    router.push(
      `/flights?tripType=${tripType}&origin=${origin}&destination=${destination}&departureDate=${departureDateStr}${
        tripType === 'roundtrip' ? `&returnDate=${returnDateStr}` : ''
      }&adults=${adults}&children=${children}&infants=${infants}&cabinClass=${cabinClass}`
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      {/* Trip Type Selection */}
      <div className="mb-4">
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-blue-600"
              name="tripType"
              value="roundtrip"
              checked={tripType === 'roundtrip'}
              onChange={() => setTripType('roundtrip')}
            />
            <span className="ml-2">Round Trip</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-blue-600"
              name="tripType"
              value="oneway"
              checked={tripType === 'oneway'}
              onChange={() => setTripType('oneway')}
            />
            <span className="ml-2">One Way</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Origin */}
        <div>
          <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
            From
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMapMarkerAlt className="text-gray-400" />
            </div>
            <input
              type="text"
              id="origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="City or Airport"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Swap Button (visible only on larger screens) */}
        <div className="hidden md:flex items-center justify-center">
          <button
            type="button"
            onClick={handleSwapLocations}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <FaExchangeAlt className="text-gray-600" />
          </button>
        </div>

        {/* Destination */}
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
            To
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMapMarkerAlt className="text-gray-400" />
            </div>
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="City or Airport"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Swap Button (visible only on mobile) */}
        <div className="md:hidden flex items-center justify-center">
          <button
            type="button"
            onClick={handleSwapLocations}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <FaExchangeAlt className="text-gray-600" />
          </button>
        </div>

        {/* Departure Date */}
        <div>
          <label htmlFor="departure-date" className="block text-sm font-medium text-gray-700 mb-1">
            Departure
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCalendarAlt className="text-gray-400" />
            </div>
            <DatePicker
              id="departure-date"
              selected={departureDate}
              onChange={(date) => setDepartureDate(date)}
              selectsStart
              startDate={departureDate}
              endDate={returnDate}
              minDate={new Date()}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Return Date (only for round trip) */}
        {tripType === 'roundtrip' && (
          <div>
            <label htmlFor="return-date" className="block text-sm font-medium text-gray-700 mb-1">
              Return
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="text-gray-400" />
              </div>
              <DatePicker
                id="return-date"
                selected={returnDate}
                onChange={(date) => setReturnDate(date)}
                selectsEnd
                startDate={departureDate}
                endDate={returnDate}
                minDate={departureDate || new Date()}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required={tripType === 'roundtrip'}
              />
            </div>
          </div>
        )}

        {/* Passengers */}
        <div className={tripType === 'oneway' ? 'md:col-span-2' : ''}>
          <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
            Passengers
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
            <div className="flex space-x-2">
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Adult' : 'Adults'}
                  </option>
                ))}
              </select>
              <select
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Child' : 'Children'}
                  </option>
                ))}
              </select>
              <select
                value={infants}
                onChange={(e) => setInfants(Number(e.target.value))}
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {[0, 1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Infant' : 'Infants'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cabin Class */}
        <div className={tripType === 'oneway' ? 'md:col-span-2' : ''}>
          <label htmlFor="cabin-class" className="block text-sm font-medium text-gray-700 mb-1">
            Cabin Class
          </label>
          <select
            id="cabin-class"
            value={cabinClass}
            onChange={(e) => setCabinClass(e.target.value as CabinClass)}
            className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="economy">Economy</option>
            <option value="premium_economy">Premium Economy</option>
            <option value="business">Business</option>
            <option value="first">First Class</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-150 ease-in-out"
        >
          Search Flights
        </button>
      </div>
    </form>
  );
};

export default FlightSearchForm;