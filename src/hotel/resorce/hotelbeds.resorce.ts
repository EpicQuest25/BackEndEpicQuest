import { Injectable } from '@nestjs/common';
import { CurrencyService } from '../../currency/currency.service';
import * as crypto from 'crypto';
import axios from 'axios';

@Injectable()
export class HotelbedsResorce {
  constructor(private readonly currencyService: CurrencyService) {}

  async destinationDetails(data: any): Promise<any[]> {
    const offers = data?.destinations || [];
    const results = [];
    
    for (const offer of offers) {
      const transformed = {
        name: offer?.name?.content,
        code: offer?.code,
        isoCode: offer?.isoCode,
        countryCode: offer?.countryCode,
      };
      results.push(transformed);
    }
    
    return results;
  }

  async destinationSearch(data: any): Promise<any[]> {
    const hotels = data.hotels.hotels;
    const rate = await this.currencyService.findAll();
    
    const currencyMap = rate.reduce((acc, curr) => {
      acc[curr.currency] = Number(curr.value);
      return acc;
    }, {});
    
    const usd = 1 / currencyMap['EUR'];
    const php = currencyMap['PHP'] / currencyMap['EUR'];
    
    const hotelDetailsList = await Promise.all(
      hotels.map((hotel) => this.hoteldetails(hotel.code))
    );
    
    const results = hotels.map((hotel, index) => {
      const hoteldetails = hotelDetailsList[index];
      return {
        hotelCode: hotel?.code,
        hoteldetails,
        USD: {
          price: +(usd * Number(hotel?.minRate)).toFixed(2),
          currency: 'USD',
        },
        PHP: {
          price: +(php * Number(hotel?.minRate)).toFixed(2),
          currency: 'PHP',
        },
        destinationName: hotel?.destinationName,
        zoneName: hotel?.zoneName,
        rating: hotel?.categoryName,
        rooms: hotel?.rooms,
      };
    });
    
    return results;
  }

  async token(): Promise<string> {
    const apiKey = process.env.HOTELBED_API_KEY;
    const secret = process.env.HOTELBED_SECRET;
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const rawSignature = apiKey + secret + timestamp;
    const hash = crypto.createHash('sha256').update(rawSignature).digest('hex');
    return hash;
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
      return await this.modifyHoteldetails(response.data);
    } catch (error) {
      console.error('Hotelbeds request failed:', error?.response?.data || error.message);
      throw error;
    }
  }

  async modifyHoteldetails(data: any): Promise<any> {
    const hotel = data?.hotel;
    const hotelName = hotel?.name?.content || '';
    const des = hotel?.description?.content || '';
    const country = hotel?.country?.description?.content || '';
    const state = hotel?.state?.name || '';
    const destination = hotel?.destination?.name?.content || '';
    const zone = hotel?.zone?.name || '';
    const rating = hotel?.category?.description?.content || '';
    const categoryGroup = hotel?.categoryGroup?.description?.content || '';
    const boardDescriptions = hotel?.boards?.map((item) => item?.description?.content) || [];
    const segments = hotel?.segments?.map((item) => item?.description?.content) || [];
    const address = hotel?.address || '';
    const postCode = hotel?.postalCode || '';
    const city = hotel?.city?.content || '';
    
    const poiData = hotel?.interestPoints?.map((item) => ({
      placeName: item?.poiName,
      distance: `${item?.distance}m`,
    })) || [];
    
    const roomsWithImages = hotel?.rooms?.map((item) => {
      let matchingImages = hotel?.images
        ?.filter(
          (img) => 
            img?.type?.description?.content === 'Room' &&
            img?.roomCode === item?.roomCode
        )
        .map((img) => ({
          image: `https://photos.hotelbeds.com/giata/${img.path}`,
        })) || [];
      
      if (matchingImages.length === 0) {
        const codePart = item?.roomCode?.split('.')?.[1]?.split('-')?.[0];
        matchingImages =
          hotel?.images
            ?.filter(
              (img) => 
                img?.type?.description?.content === 'Room' &&
                img?.characteristicCode === codePart
            )
            .map((img) => ({
              image: `https://photos.hotelbeds.com/giata/${img.path}`,
            })) || [];
      }
      
      return {
        roomCode: item?.roomCode || '',
        description: item?.description || '',
        minPax: item?.minPax || '',
        maxPax: item?.maxPax || '',
        maxAdults: item?.maxAdults || '',
        minAdults: item?.minAdults || '',
        maxChildren: item?.maxChildren || '',
        images: matchingImages,
      };
    }) || [];
    
    const generalImages = hotel?.images
      ?.filter((img) => img?.type?.description?.content === 'General view')
      .map((img) => ({
        image: `https://photos.hotelbeds.com/giata/${img?.path}` || '',
      })) || [];
    
    const otherImages = hotel?.images
      ?.filter(
        (img) => 
          img?.type?.description?.content !== 'Room' &&
          img?.type?.description?.content !== 'General view'
      )
      .map((img) => ({
        image: `https://photos.hotelbeds.com/giata/${img.path}` || '',
        imageName: img?.type?.description?.content,
      })) || [];
    
    const { freeFacilities, paidFacilities } = hotel?.facilities.reduce(
      (acc, item) => {
        if (item.hasOwnProperty('indFee')) {
          const name = item?.description?.content;
          const isPaid = item.indFee === true;
          if (name) {
            if (isPaid) {
              acc.paidFacilities.push(name);
            } else {
              acc.freeFacilities.push(name);
            }
          }
        }
        return acc;
      },
      {
        freeFacilities: [],
        paidFacilities: [],
      }
    );
    
    return {
      hotelCode: hotel.code,
      hotelName: hotelName,
      generalImages,
      description: des,
      country: country,
      state: state,
      destination: destination,
      roomsWithImages,
      zone,
      rating,
      categoryGroup,
      boardDescriptions,
      freeFacilities,
      paidFacilities,
      segments,
      address,
      postCode,
      city,
      closestPlace: poiData,
      otherImages,
    };
  }
}