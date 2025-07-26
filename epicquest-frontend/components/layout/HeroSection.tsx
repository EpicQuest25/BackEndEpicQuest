import Image from 'next/image';

interface HeroSectionProps {
  children?: React.ReactNode;
}

const HeroSection = ({ children }: HeroSectionProps) => {
  return (
    <div className="relative">
      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
            alt="Travel destination"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Discover Your Perfect Journey
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Find and book the best hotels and flights worldwide with EpicQuest
          </p>
          
          {/* Search Forms */}
          <div className="mt-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;