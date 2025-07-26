import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Hotel API endpoints
const ENDPOINTS = {
  SEARCH_HOTELS: '/hotel/searchHotels',
  HOTEL_DETAILS: '/hotel/hotelDetails',
};

// Types
export interface HotelSearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
}

export interface HotelDetailsParams {
  hotelCode: string;
}

// Convert frontend search params to backend DTO format
const convertToSearchDto = (params: HotelSearchParams) => {
  return {
    stay: {
      checkIn: params.checkIn,
      checkOut: params.checkOut,
    },
    occupancies: [
      {
        rooms: params.rooms,
        adults: params.adults,
        children: params.children,
      },
    ],
    destination: {
      code: params.destination,
    },
    hotels: {
      hotel: [],
    },
    language: 'ENG',
    currency: 'USD',
  };
};

// Hotel API service
const hotelbedsApi = {
  // Search for hotels
  searchHotels: async (params: HotelSearchParams) => {
    try {
      const searchDto = convertToSearchDto(params);
      const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.SEARCH_HOTELS}`, searchDto);
      return response.data;
    } catch (error) {
      console.error('Error searching hotels:', error);
      throw error;
    }
  },

  // Get hotel details
  getHotelDetails: async (params: HotelDetailsParams) => {
    try {
      const response = await axios.get(`${API_BASE_URL}${ENDPOINTS.HOTEL_DETAILS}`, {
        params: {
          hotelCode: params.hotelCode,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error getting hotel details:', error);
      throw error;
    }
  },
};

export default hotelbedsApi;