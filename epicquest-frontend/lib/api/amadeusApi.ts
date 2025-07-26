import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Flight API endpoints
const ENDPOINTS = {
  SEARCH_FLIGHTS: '/flight/searchFlights',
  OFFER_PRICE: '/flight/offerPrice',
  BOOK_FLIGHT: '/flight/bookFlight',
  CANCEL_BOOKING: '/flight/CancelBooking',
};

// Types
export interface FlightSearchParams {
  tripType: 'oneway' | 'roundtrip';
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: string;
}

export interface FlightOfferParams {
  flightOffer: any;
}

export interface FlightBookingParams {
  flightOffer: any;
  travelers: Traveler[];
}

export interface Traveler {
  firstName: string;
  lastName: string;
  gender: string;
  emailAddress: string;
  countryCallingCode: string;
  phonenumber: string;
  dateOfBirth?: string;
  passportNumber?: string;
  passportExpireDate?: string;
  issuanceCountry?: string;
  validityCountry?: string;
  nationality?: string;
}

// Convert frontend search params to backend DTO format
const convertToSearchDto = (params: FlightSearchParams) => {
  return {
    tripType: params.tripType,
    journeyfrom: params.origin,
    journeyto: params.destination,
    departuredate: params.departureDate,
    returndate: params.returnDate,
    adult: params.adults,
    child: params.children,
    infant: params.infants,
    cabinclass: params.cabinClass,
  };
};

// Flight API service
const amadeusApi = {
  // Search for flights
  searchFlights: async (params: FlightSearchParams) => {
    try {
      const searchDto = convertToSearchDto(params);
      const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.SEARCH_FLIGHTS}`, searchDto);
      return response.data;
    } catch (error) {
      console.error('Error searching flights:', error);
      throw error;
    }
  },

  // Get flight offer price
  getOfferPrice: async (params: FlightOfferParams) => {
    try {
      const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.OFFER_PRICE}`, {
        data: params.flightOffer,
      });
      return response.data;
    } catch (error) {
      console.error('Error getting flight offer price:', error);
      throw error;
    }
  },

  // Book a flight
  bookFlight: async (params: FlightBookingParams) => {
    try {
      const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.BOOK_FLIGHT}`, {
        travellers: params.travelers,
        data: params.flightOffer,
      });
      return response.data;
    } catch (error) {
      console.error('Error booking flight:', error);
      throw error;
    }
  },

  // Cancel a flight booking
  cancelBooking: async (bookingId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}${ENDPOINTS.CANCEL_BOOKING}`, {
        params: { bookingId },
      });
      return response.data;
    } catch (error) {
      console.error('Error canceling flight booking:', error);
      throw error;
    }
  },
};

export default amadeusApi;