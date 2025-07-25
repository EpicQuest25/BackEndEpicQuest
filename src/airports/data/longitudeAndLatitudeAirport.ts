export const iataLocationWithLonLat = {
  JFK: {
    iataCode: 'JFK',
    name: 'John F. Kennedy International Airport',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    lat: 40.6413,
    lon: -73.7781,
    tz: 'America/New_York'
  },
  LAX: {
    iataCode: 'LAX',
    name: 'Los Angeles International Airport',
    city: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    lat: 33.9416,
    lon: -118.4085,
    tz: 'America/Los_Angeles'
  },
  LHR: {
    iataCode: 'LHR',
    name: 'London Heathrow Airport',
    city: 'London',
    state: '',
    country: 'UK',
    lat: 51.4700,
    lon: -0.4543,
    tz: 'Europe/London'
  },
  // This is a placeholder for the actual data which is too large to include here
  // In a real implementation, this would contain thousands of airport entries with coordinates
};