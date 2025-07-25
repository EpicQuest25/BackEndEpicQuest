import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { HotelbedsResorce } from './hotelbeds.resorce';

@Injectable()
export class Hotelbeds {
  constructor(private readonly hotelBedsResorce: HotelbedsResorce) {}

  async token(): Promise<string> {
    const apiKey = process.env.HOTELBED_API_KEY;
    const secret = process.env.HOTELBED_SECRET;
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const rawSignature = apiKey + secret + timestamp;
    const hash = crypto.createHash('sha256').update(rawSignature).digest('hex');
    return hash;
  }

  async hotelsearch(data: any): Promise<any> {
    const xSignature = await this.token();
    const shoppingRequest = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.HOTELBED_BASE_URL}/hotel-api/1.0/hotels`,
      headers: {
        'Api-Key': process.env.HOTELBED_API_KEY,
        'X-Signature': xSignature,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip',
      },
      data,
    };

    try {
      const response = await axios.request(shoppingRequest);
      if (response.data?.hotels?.hotels?.length > 5) {
        response.data.hotels.hotels = response.data.hotels.hotels.slice(0, 5);
      }
      return await this.hotelBedsResorce.destinationSearch(response.data);
    } catch (error) {
      console.error('Hotelbeds request failed:', error?.response?.data || error.message);
      throw error;
    }
  }

  async singleHotelSearch(data: any): Promise<any> {
    const xSignature = await this.token();
    const shoppingRequest = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.HOTELBED_BASE_URL}/hotel-api/1.0/hotels`,
      headers: {
        'Api-Key': process.env.HOTELBED_API_KEY,
        'X-Signature': xSignature,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip',
      },
      data,
    };

    try {
      const response = await axios.request(shoppingRequest);
      return response.data;
    } catch (error) {
      console.error('Hotelbeds request failed:', error?.response?.data || error.message);
      throw error;
    }
  }

  async checkDestination(): Promise<any> {
    const xSignature = await this.token();
    const shoppingRequest = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.HOTELBED_BASE_URL}/hotel-content-api/1.0/locations/destinations?fields=all&language=ENG&from=1&to=1000&useSecondaryLanguage=false`,
      headers: {
        'Api-Key': process.env.HOTELBED_API_KEY,
        'X-Signature': xSignature,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip',
      },
    };

    try {
      const response = await axios.request(shoppingRequest);
      return response.data;
    } catch (error) {
      console.error('Hotelbeds request failed:', error?.response?.data || error.message);
      throw error;
    }
  }

  async checkCountry(): Promise<any> {
    const xSignature = await this.token();
    const shoppingRequest = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.HOTELBED_BASE_URL}/hotel-content-api/1.0/locations/destinations?fields=all&language=ENG&from=1&to=100&useSecondaryLanguage=false`,
      headers: {
        'Api-Key': process.env.HOTELBED_API_KEY,
        'X-Signature': xSignature,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip',
      },
    };

    try {
      const response = await axios.request(shoppingRequest);
      return response.data;
    } catch (error) {
      console.error('Hotelbeds request failed:', error?.response?.data || error.message);
      throw error;
    }
  }

  async checkHotel(): Promise<any> {
    const xSignature = await this.token();
    const shoppingRequest = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.HOTELBED_BASE_URL}/hotel-content-api/1.0/locations/countries?fields=all&language=ENG&from=1&to=203`,
      headers: {
        'Api-Key': process.env.HOTELBED_API_KEY,
        'X-Signature': xSignature,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.request(shoppingRequest);
      return response?.data?.countries;
    } catch (error) {
      console.error('Hotelbeds request failed:', error?.response?.data || error.message);
      throw error;
    }
  }

  async hoteldetails(hotelCode: string): Promise<any> {
    const xSignature = await this.token();
    const shoppingRequest = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.HOTELBED_BASE_URL}/hotel-content-api/1.0/hotels/${hotelCode}/details?language=ENG&useSecondaryLanguage=False`,
      headers: {
        'Api-Key': process.env.HOTELBED_API_KEY,
        'X-Signature': xSignature,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip',
      },
    };

    try {
      const response = await axios.request(shoppingRequest);
      return await this.hotelBedsResorce.modifyHoteldetails(response.data);
    } catch (error) {
      console.error('Hotelbeds request failed:', error?.response?.data || error.message);
      throw error;
    }
  }

  async rateCheck(): Promise<any> {
    // This method is empty in the original code
  }
}