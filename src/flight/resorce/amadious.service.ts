import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AmadiousResorce } from './amadious.resorce';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingIdEntity, SaveBooking } from '../../booking/entity/bookingId.entiry';
import { Repository } from 'typeorm';

@Injectable()
export class AmadiousService {
  constructor(
    private readonly amadaeusResorce: AmadiousResorce,
    @InjectRepository(BookingIdEntity)
    private readonly bookingIdEntityRepository: Repository<BookingIdEntity>,
    @InjectRepository(SaveBooking)
    private readonly saveBooking: Repository<SaveBooking>,
  ) {}

  async token(): Promise<string> {
    const data = `grant_type=client_credentials&client_id=${process.env.AMADUES_API_KEY}&client_secret=${process.env.AMADUES_SECRET}`;
    const tokenRequest = {
      method: 'post',
      url: `${process.env.AMADUES_BASE_URL}/v1/security/oauth2/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
      maxBodyLength: Infinity,
    };

    try {
      const response = await axios.request(tokenRequest);
      return response.data.access_token;
    } catch (error) {
      console.error('Amadeus token request failed:', error?.response?.data || error.message);
      throw error;
    }
  }

  async searchFlights(data: any): Promise<any> {
    const transformdata = this.searchTransformer(data);
    const accessToken = await this.token();
    const flightRequest = {
      method: 'post',
      url: `${process.env.AMADUES_BASE_URL}/v2/shopping/flight-offers`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data: transformdata,
      maxBodyLength: Infinity,
    };

    try {
      const response = await axios.request(flightRequest);
      return await this.amadaeusResorce.convertAmadeusToCustomFormat(response.data, data.tripType);
    } catch (error) {
      console.error('Flight Offers Search request failed:', error?.response?.data || error.message);
      return [];
    }
  }

  async offerPrice(data: any): Promise<any> {
    const transformdata = this.offerPriceTransformer(data);
    const accessToken = await this.token();
    const flightRequest = {
      method: 'post',
      url: `${process.env.AMADUES_BASE_URL}/v1/shopping/flight-offers/pricing?forceClass=true`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data: transformdata,
      maxBodyLength: Infinity,
    };

    try {
      const response = await axios.request(flightRequest);
      return await this.amadaeusResorce.convertPriceCheck(response.data, data.triptype);
    } catch (error) {
      console.error('Flight Offer Price request failed:', error?.response?.data || error.message);
      return {};
    }
  }

  async booking(data: any, header: any): Promise<any> {
    const transformdata = this.bookingdataTransformer(data);
    const accessToken = await this.token();
    const flightRequest = {
      method: 'post',
      url: `${process.env.AMADUES_BASE_URL}/v1/booking/flight-orders`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data: transformdata,
      maxBodyLength: Infinity,
    };

    try {
      const response = await axios.request(flightRequest);
      const now = Date.now();
      const datePart = now.toString().slice(-4);
      const randomPart = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(3, '0');
      const id = datePart + randomPart;
      const randomId = 'EPQB' + id;
      
      let add = new BookingIdEntity();
      add.epicQuestId = randomId;
      add.gdsId = response?.data?.data?.id;
      add.queuingOfficeId = response?.data?.data?.queuingOfficeId;
      await this.bookingIdEntityRepository.save(add);
      
      const manageBookig = await this.manageBooking(randomId);
      console.log(manageBookig);
      return await this.amadaeusResorce.convertManageBooking(manageBookig, header, randomId, data.data.triptype);
    } catch (error) {
      console.error('Flight booking request failed:', error?.response?.data || error.message);
      return error?.response?.data || error.message;
    }
  }

  async manageBooking(data: string): Promise<any> {
    const findId = await this.bookingIdEntityRepository.findOne({
      where: { epicQuestId: data },
    });
    const accessToken = await this.token();
    const retriveRequest = {
      method: 'get',
      url: `${process.env.AMADUES_BASE_URL}/v1/booking/flight-orders/${findId.gdsId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      maxBodyLength: Infinity,
    };

    try {
      const response = await axios.request(retriveRequest);
      return response?.data?.data;
    } catch (error) {
      console.error('Flight manage request failed:', error?.response?.data || error.message);
      return {};
    }
  }

  async cancelBooking(data: string): Promise<any> {
    const findId = await this.bookingIdEntityRepository.findOne({
      where: { epicQuestId: data },
    });
    const findBooking = await this.saveBooking.findOne({
      where: { bookingId: data },
    });

    if (!findBooking) {
      return { success: false, message: 'Booking record not found' };
    }

    if (findBooking.status !== 'Booked') {
      return { success: false, message: 'Booking is not in cancellable state' };
    }

    if (!findId || !findId.gdsId) {
      console.error('Booking not found or missing GDS ID.');
      return { success: false, message: 'Invalid GDS booking ID' };
    }

    const accessToken = await this.token();
    const retriveRequest = {
      method: 'delete',
      url: `${process.env.AMADUES_BASE_URL}/v1/booking/flight-orders/${findId.gdsId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      maxBodyLength: Infinity,
    };

    try {
      const response = await axios.request(retriveRequest);
      if (response.status === 200 || response.status === 204) {
        await this.saveBooking.update({ bookingId: data }, { status: 'Cancelled' });
        const updatedBooking = await this.saveBooking.findOne({
          where: { bookingId: data },
        });
        delete updatedBooking.id;
        return {
          success: true,
          message: 'Booking cancelled successfully',
          data: updatedBooking,
        };
      } else {
        console.warn('Unexpected response:', response.status, response.data);
        return {
          success: false,
          message: 'Unexpected response from Amadeus',
          data: response.data,
        };
      }
    } catch (error) {
      console.error('Flight cancel request failed:', error?.response?.data || error.message);
      return {
        success: false,
        message: 'Failed to cancel booking',
        error: error?.response?.data || error.message,
      };
    }
  }

  bookingdataTransformer(data: any): any {
    return {
      data: {
        type: 'flight-order',
        flightOffers: [data?.data?.AirFareData?.data?.flightOffers?.[0]],
        ticketingAgreement: {
          option: 'DELAY_TO_CANCEL',
          delay: `${data?.data?.bookingHold || 2}D`,
        },
        travelers: data.travellers.map((traveler: any, index: number) => {
          const transformed: any = {
            id: (index + 1).toString(),
            name: {
              firstName: traveler.firstName || '',
              lastName: traveler.lastName || '',
            },
            gender: traveler.gender || '',
            contact: {
              emailAddress: traveler.emailAddress || '',
              phones: [
                {
                  deviceType: 'MOBILE',
                  countryCallingCode: traveler.countryCallingCode || '',
                  number: traveler.phonenumber || '',
                },
              ],
            },
          };

          if (traveler.dateOfBirth) {
            transformed.dateOfBirth = traveler.dateOfBirth;
          }

          const hasPassportDetails = traveler.passportNumber &&
            traveler.passportExpireDate &&
            traveler.issuanceCountry &&
            traveler.validityCountry &&
            traveler.nationality;

          if (hasPassportDetails) {
            transformed.documents = [
              {
                documentType: 'PASSPORT',
                number: traveler.passportNumber,
                expiryDate: traveler.passportExpireDate,
                issuanceCountry: traveler.issuanceCountry,
                validityCountry: traveler.validityCountry,
                nationality: traveler.nationality,
                holder: true,
              },
            ];
          }

          return transformed;
        }),
      },
    };
  }

  offerPriceTransformer(data: any): any {
    const offer = data?.AirFareData;
    const payload = {
      data: {
        type: 'flight-offers-pricing',
        flightOffers: [offer],
      },
    };
    return payload;
  }

  searchTransformer(dto: any): any {
    const originDestinations = [
      {
        id: '1',
        originLocationCode: dto?.journeyfrom,
        destinationLocationCode: dto?.journeyto,
        departureDateTimeRange: {
          date: dto?.departuredate,
        },
      },
    ];

    if (dto?.returndate) {
      originDestinations.push({
        id: '2',
        originLocationCode: dto?.journeyto,
        destinationLocationCode: dto?.journeyfrom,
        departureDateTimeRange: {
          date: dto?.returndate,
        },
      });
    }

    const travelers = [];
    const adultIds = [];

    for (let i = 0; i < dto?.adult; i++) {
      const id = `${travelers.length + 1}`;
      travelers.push({ id, travelerType: 'ADULT' });
      adultIds.push(id);
    }

    for (let i = 0; i < dto?.child; i++) {
      travelers.push({ id: `${travelers.length + 1}`, travelerType: 'CHILD' });
    }

    for (let i = 0; i < dto?.infant; i++) {
      const associatedAdultId = adultIds[i % adultIds.length];
      travelers.push({
        id: `${travelers.length + 1}`,
        travelerType: 'HELD_INFANT',
        associatedAdultId,
      });
    }

    const payload = {
      currencyCode: 'USD',
      originDestinations,
      travelers,
      sources: ['GDS'],
      searchCriteria: {
        maxFlightOffers: 100,
        flightFilters: {
          cabinRestrictions: [
            {
              cabin: dto.cabinclass.toUpperCase(),
              coverage: 'MOST_SEGMENTS',
              originDestinationIds: originDestinations.map((od) => od.id),
            },
          ],
        },
      },
    };

    return payload;
  }
}