'use client';

import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/layout/HeroSection';
import FeaturedDestinations from '@/components/layout/FeaturedDestinations';
import PromotionalSection from '@/components/layout/PromotionalSection';
import Tabs from '@/components/ui/Tabs';
import HotelSearchForm from '@/components/forms/HotelSearchForm';
import FlightSearchForm from '@/components/forms/FlightSearchForm';

export default function Home() {
  const searchTabs = [
    {
      id: 'hotels',
      label: 'Hotels',
      content: <HotelSearchForm />,
    },
    {
      id: 'flights',
      label: 'Flights',
      content: <FlightSearchForm />,
    },
  ];

  return (
    <MainLayout>
      <HeroSection>
        <Tabs tabs={searchTabs} defaultTabId="hotels" />
      </HeroSection>
      
      <FeaturedDestinations />
      
      <PromotionalSection />
    </MainLayout>
  );
}
