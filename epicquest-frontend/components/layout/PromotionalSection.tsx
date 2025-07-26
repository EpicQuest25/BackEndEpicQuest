import Image from 'next/image';
import Link from 'next/link';

const PromotionalSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Special Offers & Deals</h2>
            <p className="text-gray-600 mb-8">
              Take advantage of our exclusive deals and save big on your next trip. 
              Whether you're looking for a luxury hotel stay or a budget-friendly flight, 
              we've got you covered with the best prices and special promotions.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold">Up to 25% off on hotel bookings</h3>
                  <p className="text-gray-600">Book your stay at select hotels worldwide and save up to 25%</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold">Flight deals from $199</h3>
                  <p className="text-gray-600">Explore our selection of discounted flights to popular destinations</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold">Free cancellation</h3>
                  <p className="text-gray-600">Flexible booking options with free cancellation on select hotels</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/hotels" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-150 ease-in-out text-center"
              >
                View Hotel Deals
              </Link>
              <Link 
                href="/flights" 
                className="inline-block bg-white hover:bg-gray-100 text-blue-600 font-medium py-3 px-6 rounded-md border border-blue-600 transition duration-150 ease-in-out text-center"
              >
                Explore Flight Offers
              </Link>
            </div>
          </div>
          
          <div className="relative h-96 lg:h-[500px]">
            <Image
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt="Promotional offer"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg shadow-lg"
            />
            <div className="absolute top-4 right-4 bg-red-600 text-white py-2 px-4 rounded-full font-bold">
              25% OFF
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalSection;