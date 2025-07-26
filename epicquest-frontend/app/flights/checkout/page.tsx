'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import amadeusApi, { FlightBookingParams, Traveler } from '@/lib/api/amadeusApi';
import Image from 'next/image';
import { FaPlane, FaCalendarAlt, FaUser, FaCreditCard, FaLock, FaCheck } from 'react-icons/fa';

// Types
interface Flight {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: string;
  price: string;
  airline: string;
  airlineName: string;
}

interface TravelerInfo {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  countryCallingCode: string;
  passportNumber: string;
  passportExpireDate: string;
  nationality: string;
}

interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

const FlightCheckoutPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [flight, setFlight] = useState<Flight>({
    id: searchParams.get('flightId') || '',
    origin: searchParams.get('origin') || '',
    destination: searchParams.get('destination') || '',
    departureDate: searchParams.get('departureDate') || '',
    returnDate: searchParams.get('returnDate') || '',
    adults: parseInt(searchParams.get('adults') || '1', 10),
    children: parseInt(searchParams.get('children') || '0', 10),
    infants: parseInt(searchParams.get('infants') || '0', 10),
    cabinClass: searchParams.get('cabinClass') || 'economy',
    price: '499.99',
    airline: 'AA',
    airlineName: 'American Airlines',
  });
  
  const [travelers, setTravelers] = useState<TravelerInfo[]>([]);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Traveler Info, 2: Payment, 3: Confirmation
  
  // Initialize travelers based on passenger count
  useEffect(() => {
    const totalPassengers = flight.adults + flight.children + flight.infants;
    const initialTravelers: TravelerInfo[] = [];
    
    for (let i = 0; i < totalPassengers; i++) {
      let passengerType = 'adult';
      if (i >= flight.adults && i < flight.adults + flight.children) {
        passengerType = 'child';
      } else if (i >= flight.adults + flight.children) {
        passengerType = 'infant';
      }
      
      initialTravelers.push({
        firstName: '',
        lastName: '',
        gender: 'M',
        dateOfBirth: '',
        email: i === 0 ? '' : travelers[0]?.email || '',
        phone: i === 0 ? '' : travelers[0]?.phone || '',
        countryCallingCode: i === 0 ? '1' : travelers[0]?.countryCallingCode || '1',
        passportNumber: '',
        passportExpireDate: '',
        nationality: 'US',
      });
    }
    
    setTravelers(initialTravelers);
  }, [flight.adults, flight.children, flight.infants]);

  // Handle traveler info form change
  const handleTravelerChange = (index: number, field: keyof TravelerInfo, value: string) => {
    const updatedTravelers = [...travelers];
    updatedTravelers[index] = {
      ...updatedTravelers[index],
      [field]: value,
    };
    
    // If it's the first traveler and email/phone is updated, sync with other travelers
    if (index === 0 && (field === 'email' || field === 'phone' || field === 'countryCallingCode')) {
      updatedTravelers.forEach((traveler, i) => {
        if (i > 0) {
          updatedTravelers[i] = {
            ...updatedTravelers[i],
            [field]: value,
          };
        }
      });
    }
    
    setTravelers(updatedTravelers);
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
      // Validate traveler info
      const isValid = travelers.every(traveler => 
        traveler.firstName && 
        traveler.lastName && 
        traveler.dateOfBirth && 
        traveler.email && 
        traveler.phone
      );
      
      if (!isValid) {
        setError('Please fill in all required fields for all travelers');
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

  // Get passenger type label
  const getPassengerTypeLabel = (index: number) => {
    if (index < flight.adults) {
      return 'Adult';
    } else if (index < flight.adults + flight.children) {
      return 'Child';
    } else {
      return 'Infant';
    }
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    const basePrice = parseFloat(flight.price);
    const adultPrice = basePrice;
    const childPrice = basePrice * 0.75;
    const infantPrice = basePrice * 0.1;
    
    return (adultPrice * flight.adults + childPrice * flight.children + infantPrice * flight.infants).toFixed(2);
  };

  // Format cabin class name
  const formatCabinClass = (cabinClass: string) => {
    return cabinClass.charAt(0).toUpperCase() + cabinClass.slice(1);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Flight Booking</h1>
        
        {/* Error state */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Checkout content */}
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
                <div className="text-sm font-medium">Traveler Information</div>
                <div className="text-sm font-medium">Payment</div>
                <div className="text-sm font-medium">Confirmation</div>
              </div>
            </div>

            {/* Step 1: Traveler Information */}
            {step === 1 && (
              <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Traveler Information</h2>
                  
                  {travelers.map((traveler, index) => (
                    <div 
                      key={index}
                      className={`${index > 0 ? 'mt-8 pt-8 border-t border-gray-200' : ''}`}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">
                          Traveler {index + 1} ({getPassengerTypeLabel(index)})
                        </h3>
                        {index === 0 && (
                          <div className="text-sm text-gray-600">
                            Contact information will be shared with all travelers
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor={`firstName-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            First Name *
                          </label>
                          <input
                            type="text"
                            id={`firstName-${index}`}
                            value={traveler.firstName}
                            onChange={(e) => handleTravelerChange(index, 'firstName', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor={`lastName-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            id={`lastName-${index}`}
                            value={traveler.lastName}
                            onChange={(e) => handleTravelerChange(index, 'lastName', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label htmlFor={`gender-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Gender *
                          </label>
                          <select
                            id={`gender-${index}`}
                            value={traveler.gender}
                            onChange={(e) => handleTravelerChange(index, 'gender', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor={`dateOfBirth-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Date of Birth *
                          </label>
                          <input
                            type="date"
                            id={`dateOfBirth-${index}`}
                            value={traveler.dateOfBirth}
                            onChange={(e) => handleTravelerChange(index, 'dateOfBirth', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>
                      
                      {index === 0 && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address *
                              </label>
                              <input
                                type="email"
                                id="email"
                                value={traveler.email}
                                onChange={(e) => handleTravelerChange(index, 'email', e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700 mb-1">
                                  Code *
                                </label>
                                <select
                                  id="countryCode"
                                  value={traveler.countryCallingCode}
                                  onChange={(e) => handleTravelerChange(index, 'countryCallingCode', e.target.value)}
                                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  required
                                >
                                  <option value="1">+1 (US)</option>
                                  <option value="44">+44 (UK)</option>
                                  <option value="33">+33 (FR)</option>
                                  <option value="49">+49 (DE)</option>
                                  <option value="86">+86 (CN)</option>
                                </select>
                              </div>
                              <div className="col-span-2">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                  Phone Number *
                                </label>
                                <input
                                  type="tel"
                                  id="phone"
                                  value={traveler.phone}
                                  onChange={(e) => handleTravelerChange(index, 'phone', e.target.value)}
                                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor={`passportNumber-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Passport Number *
                          </label>
                          <input
                            type="text"
                            id={`passportNumber-${index}`}
                            value={traveler.passportNumber}
                            onChange={(e) => handleTravelerChange(index, 'passportNumber', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor={`passportExpiry-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Passport Expiry Date *
                          </label>
                          <input
                            type="date"
                            id={`passportExpiry-${index}`}
                            value={traveler.passportExpireDate}
                            onChange={(e) => handleTravelerChange(index, 'passportExpireDate', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor={`nationality-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Nationality *
                        </label>
                        <select
                          id={`nationality-${index}`}
                          value={traveler.nationality}
                          onChange={(e) => handleTravelerChange(index, 'nationality', e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="US">United States</option>
                          <option value="GB">United Kingdom</option>
                          <option value="CA">Canada</option>
                          <option value="AU">Australia</option>
                          <option value="FR">France</option>
                          <option value="DE">Germany</option>
                          <option value="IT">Italy</option>
                          <option value="ES">Spain</option>
                          <option value="JP">Japan</option>
                          <option value="CN">China</option>
                        </select>
                      </div>
                    </div>
                  ))}
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
                    Thank you for your booking. Your flight has been confirmed.
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
                  <h3 className="font-semibold mb-2">Flight Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Route:</span>
                      <span className="ml-2">{flight.origin} to {flight.destination}</span>
                    </div>
                    <div>
                      <span className="font-medium">Departure:</span>
                      <span className="ml-2">{flight.departureDate}</span>
                    </div>
                    {flight.returnDate && (
                      <div>
                        <span className="font-medium">Return:</span>
                        <span className="ml-2">{flight.returnDate}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Airline:</span>
                      <span className="ml-2">{flight.airlineName}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Traveler Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {travelers.map((traveler, index) => (
                      <div key={index} className="col-span-2 flex">
                        <span className="font-medium">{getPassengerTypeLabel(index)}:</span>
                        <span className="ml-2">{traveler.firstName} {traveler.lastName}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    A confirmation email has been sent to {travelers[0]?.email} with all the details of your booking.
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
              
              {/* Flight summary */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <FaPlane className="text-blue-600 mr-2" />
                  <div className="font-medium">
                    {flight.origin} to {flight.destination}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {flight.returnDate ? 'Round Trip' : 'One Way'}
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <FaCalendarAlt className="mr-1" />
                  <span>
                    {flight.departureDate}
                    {flight.returnDate && ` - ${flight.returnDate}`}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <FaUser className="mr-1" />
                  <span>
                    {flight.adults} Adults
                    {flight.children > 0 && `, ${flight.children} Children`}
                    {flight.infants > 0 && `, ${flight.infants} Infants`}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {formatCabinClass(flight.cabinClass)}
                </div>
              </div>
              
              {/* Price breakdown */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>Base Fare</span>
                  <span>${flight.price}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Taxes & Fees</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2">
                  <span>Total</span>
                  <span>${calculateTotalPrice()}</span>
                </div>
              </div>
              
              {/* Fare conditions */}
              <div className="text-xs text-gray-500">
                <p className="mb-1">Fare conditions:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Changes allowed with fee</li>
                  <li>Cancellation allowed with fee</li>
                  <li>1 checked bag included</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FlightCheckoutPage;