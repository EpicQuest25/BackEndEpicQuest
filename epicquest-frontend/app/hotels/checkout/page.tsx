'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import hotelbedsApi, { HotelDetailsParams } from '@/lib/api/hotelbedsApi';
import Image from 'next/image';
import { FaStar, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaCreditCard, FaLock } from 'react-icons/fa';

// Types
interface BookingDetails {
  hotelId: string;
  roomId: string;
  rateKey: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
  hotelName?: string;
  hotelImage?: string;
  roomName?: string;
  destination?: string;
  pricePerNight?: string;
  totalPrice?: string;
  nights?: number;
}

interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

const HotelCheckoutPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    hotelId: searchParams.get('hotelId') || '',
    roomId: searchParams.get('roomId') || '',
    rateKey: searchParams.get('rateKey') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    rooms: parseInt(searchParams.get('rooms') || '1', 10),
    adults: parseInt(searchParams.get('adults') || '2', 10),
    children: parseInt(searchParams.get('children') || '0', 10),
  });
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Guest Info, 2: Payment, 3: Confirmation
  
  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Validate required parameters
        if (!bookingDetails.hotelId) {
          setError('Missing hotel ID');
          setLoading(false);
          return;
        }

        // Create params object
        const detailsParams: HotelDetailsParams = {
          hotelCode: bookingDetails.hotelId,
        };

        // Call API to get hotel details
        const response = await hotelbedsApi.getHotelDetails(detailsParams);
        
        // For demo purposes, if the API doesn't return data, create mock data
        const hotelDetails = response.hotel || createMockHotelDetails(bookingDetails.hotelId);
        
        // Find the selected room
        const selectedRoom = bookingDetails.roomId 
          ? hotelDetails.rooms.find((room: any) => room.code === bookingDetails.roomId)
          : hotelDetails.rooms[0];
        
        // Find the selected rate
        const selectedRate = selectedRoom?.rates.find((rate: any) => rate.rateKey === bookingDetails.rateKey)
          || selectedRoom?.rates[0];
        
        // Calculate nights
        const nights = calculateNights(bookingDetails.checkIn, bookingDetails.checkOut);
        
        // Calculate total price
        const pricePerNight = selectedRate ? selectedRate.net : '0.00';
        const totalPrice = (parseFloat(pricePerNight) * nights).toFixed(2);
        
        // Update booking details
        setBookingDetails(prev => ({
          ...prev,
          hotelName: hotelDetails.name,
          hotelImage: hotelDetails.images[0]?.url,
          roomName: selectedRoom?.name,
          destination: `${hotelDetails.city}, ${hotelDetails.destinationName}`,
          pricePerNight,
          totalPrice,
          nights,
        }));
      } catch (err) {
        console.error('Error fetching hotel details:', err);
        setError('Failed to fetch hotel details. Please try again.');
        
        // For demo purposes, create mock data on error
        setBookingDetails(prev => ({
          ...prev,
          hotelName: 'Luxury Hotel & Spa',
          hotelImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
          roomName: 'Deluxe Double Room',
          destination: 'New York, USA',
          pricePerNight: '299.00',
          totalPrice: '598.00',
          nights: 2,
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [bookingDetails.hotelId, bookingDetails.roomId, bookingDetails.rateKey, bookingDetails.checkIn, bookingDetails.checkOut]);

  // Helper function to create mock hotel details for demo purposes
  const createMockHotelDetails = (id: string) => {
    return {
      code: id,
      name: 'Luxury Hotel & Spa',
      city: 'New York',
      destinationName: 'USA',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
          type: 'GENERAL',
        },
      ],
      rooms: [
        {
          code: 'DBL',
          name: 'Deluxe Double Room',
          rates: [
            {
              rateKey: 'DBL-1',
              net: '299.00',
            },
          ],
        },
      ],
    };
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

  // Handle guest info form change
  const handleGuestInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGuestInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle payment info form change
  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validate guest info
      if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone) {
        setError('Please fill in all required fields');
        return;
      }
      
      // Move to payment step
      setError(null);
      setStep(2);
      return;
    }
    
    if (step === 2) {
      // Validate payment info
      if (!paymentInfo.cardNumber || !paymentInfo.cardHolder || !paymentInfo.expiryMonth || !paymentInfo.expiryYear || !paymentInfo.cvv) {
        setError('Please fill in all payment details');
        return;
      }
      
      try {
        setIsSubmitting(true);
        setError(null);
        
        // In a real application, we would call the API to process the booking
        // For demo purposes, we'll just simulate a successful booking
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Move to confirmation step
        setStep(3);
      } catch (err) {
        console.error('Error processing booking:', err);
        setError('Failed to process booking. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Generate years for expiry date select
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 10; i++) {
      years.push(currentYear + i);
    }
    return years;
  };

  // Generate months for expiry date select
  const generateMonths = () => {
    const months = [];
    for (let i = 1; i <= 12; i++) {
      months.push(i < 10 ? `0${i}` : `${i}`);
    }
    return months;
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        
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

        {/* Checkout content */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout form */}
            <div className="lg:col-span-2">
              {/* Steps */}
              <div className="mb-8">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    1
                  </div>
                  <div className={`flex-1 h-1 mx-2 ${
                    step >= 2 ? 'bg-blue-600' : 'bg-gray-200'
                  }`}></div>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    2
                  </div>
                  <div className={`flex-1 h-1 mx-2 ${
                    step >= 3 ? 'bg-blue-600' : 'bg-gray-200'
                  }`}></div>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    3
                  </div>
                </div>
                <div className="flex justify-between mt-2">
                  <div className="text-sm font-medium">Guest Information</div>
                  <div className="text-sm font-medium">Payment</div>
                  <div className="text-sm font-medium">Confirmation</div>
                </div>
              </div>

              {/* Step 1: Guest Information */}
              {step === 1 && (
                <form onSubmit={handleSubmit}>
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Guest Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={guestInfo.firstName}
                          onChange={handleGuestInfoChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={guestInfo.lastName}
                          onChange={handleGuestInfoChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={guestInfo.email}
                          onChange={handleGuestInfoChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={guestInfo.phone}
                          onChange={handleGuestInfoChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
                        Special Requests
                      </label>
                      <textarea
                        id="specialRequests"
                        name="specialRequests"
                        value={guestInfo.specialRequests}
                        onChange={handleGuestInfoChange}
                        rows={3}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-150 ease-in-out"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <form onSubmit={handleSubmit}>
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                    
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Payment Method</h3>
                        <div className="flex space-x-2">
                          <Image src="/visa.svg" alt="Visa" width={40} height={25} />
                          <Image src="/mastercard.svg" alt="Mastercard" width={40} height={25} />
                          <Image src="/amex.svg" alt="American Express" width={40} height={25} />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={paymentInfo.cardNumber}
                            onChange={handlePaymentInfoChange}
                            placeholder="1234 5678 9012 3456"
                            className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaCreditCard className="text-gray-400" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          id="cardHolder"
                          name="cardHolder"
                          value={paymentInfo.cardHolder}
                          onChange={handlePaymentInfoChange}
                          placeholder="John Doe"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Month *
                          </label>
                          <select
                            id="expiryMonth"
                            name="expiryMonth"
                            value={paymentInfo.expiryMonth}
                            onChange={handlePaymentInfoChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="">MM</option>
                            {generateMonths().map(month => (
                              <option key={month} value={month}>{month}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Year *
                          </label>
                          <select
                            id="expiryYear"
                            name="expiryYear"
                            value={paymentInfo.expiryYear}
                            onChange={handlePaymentInfoChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="">YYYY</option>
                            {generateYears().map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                            CVV *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              id="cvv"
                              name="cvv"
                              value={paymentInfo.cvv}
                              onChange={handlePaymentInfoChange}
                              placeholder="123"
                              className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaLock className="text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-4 bg-gray-50 rounded-md">
                      <FaLock className="text-green-600 mr-2" />
                      <span className="text-sm text-gray-600">
                        Your payment information is secure and encrypted
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="bg-white hover:bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-md border border-gray-300 transition duration-150 ease-in-out"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-150 ease-in-out"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        'Complete Booking'
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                    <p className="text-gray-600">
                      Thank you for your booking. Your reservation has been confirmed.
                    </p>
                  </div>
                  
                  <div className="border-t border-b border-gray-200 py-4 mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Booking Reference:</span>
                      <span>EQ-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Booking Date:</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Guest Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Name:</span>
                        <span className="ml-2">{guestInfo.firstName} {guestInfo.lastName}</span>
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>
                        <span className="ml-2">{guestInfo.email}</span>
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span>
                        <span className="ml-2">{guestInfo.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      A confirmation email has been sent to {guestInfo.email} with all the details of your booking.
                    </p>
                    <div className="flex justify-center">
                      <button
                        onClick={() => router.push('/')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-150 ease-in-out"
                      >
                        Return to Homepage
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Booking summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
                
                {/* Hotel info */}
                <div className="mb-4">
                  <div className="relative h-40 rounded-md overflow-hidden mb-3">
                    <Image
                      src={bookingDetails.hotelImage || '/placeholder-hotel.jpg'}
                      alt={bookingDetails.hotelName || 'Hotel'}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <h3 className="font-semibold text-lg">{bookingDetails.hotelName}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>{bookingDetails.destination}</span>
                  </div>
                </div>
                
                {/* Booking details */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex items-center mb-2">
                    <FaCalendarAlt className="text-gray-500 mr-2" />
                    <div>
                      <div className="text-sm font-medium">Check-in</div>
                      <div>{bookingDetails.checkIn}</div>
                    </div>
                    <div className="mx-2 text-gray-300">|</div>
                    <div>
                      <div className="text-sm font-medium">Check-out</div>
                      <div>{bookingDetails.checkOut}</div>
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaUser className="text-gray-500 mr-2" />
                    <div>
                      <div className="text-sm font-medium">Guests</div>
                      <div>{bookingDetails.adults} Adults, {bookingDetails.children} Children</div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="text-sm font-medium">Room Type</div>
                    <div>{bookingDetails.roomName}</div>
                  </div>
                </div>
                
                {/* Price breakdown */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Room Rate</span>
                    <span>${bookingDetails.pricePerNight} x {bookingDetails.nights} nights</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Taxes & Fees</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2">
                    <span>Total</span>
                    <span>${bookingDetails.totalPrice}</span>
                  </div>
                </div>
                
                {/* Cancellation policy */}
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Cancellation Policy:</p>
                  <p>Free cancellation until 24 hours before check-in. After that, the first night is non-refundable.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default HotelCheckoutPage;