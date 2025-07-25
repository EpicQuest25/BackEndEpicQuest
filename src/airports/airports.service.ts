import { Injectable } from '@nestjs/common';
import { airportsData } from './data/airportData';
import { iataLocationWithLonLat } from './data/longitudeAndLatitudeAirport';
import { airlineUpdateData } from './data/updateAirlineData';

@Injectable()
export class AirportsService {
  constructor() {}

  async airportName(code: string) {
    const airportMap = new Map(airportsData.map((a) => [a.code, a]));
    return airportMap.get(code) || { code: '', name: '', location: '' };
  }

  async airlineName(code: string) {
    const airlineMap = new Map(
      airlineUpdateData.map((a) => [
        a.iataCode,
        { code: a.iataCode, name: a.businessName },
      ]),
    );
    return airlineMap.get(code) || { code: '', name: '' };
  }

  async airportData(code: string) {
    if (!iataLocationWithLonLat) {
      return { code: '', name: '', location: '', lat: null, lon: null, tz: '' };
    }

    const foundItem = Object.values(iataLocationWithLonLat).find(
      (airport) => airport.iataCode === code,
    );

    if (!foundItem) {
      return { code: '', name: '', location: '', lat: null, lon: null, tz: '' };
    }

    return {
      code: foundItem.iataCode,
      name: foundItem.name,
      location: `${foundItem.city}, ${foundItem.state}, ${foundItem.country}`,
      lat: foundItem.lat,
      lon: foundItem.lon,
      tz: foundItem.tz,
    };
  }
}