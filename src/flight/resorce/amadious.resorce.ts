import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from '../../agent/entities/agent.entity';
import { AirportsService } from '../../airports/airports.service';
import { AuthenticationService } from '../../authentication/authentication.service';
import { BookingIdEntity, SaveBooking } from '../../booking/entity/bookingId.entiry';
import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AmadiousResorce {
  constructor(
    private readonly airportService: AirportsService,
    @InjectRepository(SaveBooking)
    private readonly saveBooking: Repository<SaveBooking>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    private readonly authservice: AuthenticationService,
  ) {}

  async convertAmadeusToCustomFormat(data: any, triptype: string): Promise<any[]> {
    const offers = data?.data || [];
    const results = [];
    
    const formatTime = (dateTime: string) => new Date(dateTime).toTimeString().split(' ')[0];
    
    const formatDate = (dateTime: string) => {
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      };
      return new Date(dateTime).toLocaleDateString('en-US', options);
    };
    
    const calculateTransitDuration = (arrivalTime: string, nextDepartureTime: string) => {
      const arrival = new Date(arrivalTime);
      const departure = new Date(nextDepartureTime);
      const diffMinutes = Math.floor((departure.getTime() - arrival.getTime()) / (1000 * 60));
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}H ${minutes}Min`;
    };

    for (const offer of offers) {
      const segments = { go: [], back: [] };
      const priceBreakdown = [];
      const stopover = [];
      
      const totalFare = parseFloat(offer?.price?.total);
      const baseFare = parseFloat(offer?.price?.base);
      const tax = totalFare - baseFare;
      
      const pricing = offer.travelerPricings?.[0];
      const fareDetails = pricing?.fareDetailsBySegment;

      for (const tp of offer.travelerPricings) {
        const checkinBag = tp?.fareDetailsBySegment?.[0]?.includedCheckedBags || {};
        const checkinhasWeight = typeof checkinBag.weight === 'number';
        const checkinhasQuantity = typeof checkinBag.quantity === 'number';
        
        let checkInBagWeight = 0;
        if (checkinhasWeight && checkinhasQuantity) {
          checkInBagWeight = checkinBag.weight * checkinBag.quantity;
        } else if (checkinhasWeight) {
          checkInBagWeight = checkinBag.weight;
        } else if (checkinhasQuantity) {
          checkInBagWeight = 20 * checkinBag.quantity;
        }
        
        const cabinBag = tp?.fareDetailsBySegment?.[0]?.includedCabinBags || {};
        const cabinhasWeight = typeof cabinBag.weight === 'number';
        const cabinhasQuantity = typeof cabinBag.quantity === 'number';
        
        let cabinBagWeight = 0;
        if (cabinhasWeight && cabinhasQuantity) {
          cabinBagWeight = cabinBag.weight * cabinBag.quantity;
        } else if (cabinhasWeight) {
          cabinBagWeight = cabinBag.weight;
        } else if (cabinhasQuantity) {
          cabinBagWeight = 7 * cabinBag.quantity;
        }

        priceBreakdown.push({
          BaseFare: tp.price.base,
          Tax: (parseFloat(tp.price.total) - parseFloat(tp.price.base)).toFixed(2),
          PaxCount: '1',
          PaxType: tp.travelerType,
          Discount: '0',
          OtherCharges: '0',
          ServiceFee: '0',
          CheckInBags: `${checkInBagWeight}KG`,
          CabinBags: `${cabinBagWeight}KG`,
        });
      }

      for (const [idx, itinerary] of offer.itineraries.entries()) {
        const tripType = idx === 0 ? 'go' : 'back';
        const segs = itinerary.segments;
        
        for (let i = 0; i < segs.length; i++) {
          const fareSeg = fareDetails[i] || {};
          const seg = segs[i];
          const travelerDetails = pricing?.fareDetailsBySegment.find((fd: any) => fd.segmentId === seg.id);
          
          const departureAirport = await this.airportService.airportData(seg.departure.iataCode);
          const arrivalAirport = await this.airportService.airportData(seg.arrival.iataCode);
          const marketingAirline = await this.airportService.airlineName(seg.carrierCode);
          const operatingAirline = await this.airportService.airlineName(seg.operating?.carrierCode);
          
          const transits = {};
          segs.forEach((seg: any, i: number) => {
            if (
              i < segs.length - 1 &&
              seg.arrival?.at &&
              segs[i + 1]?.departure?.at
            ) {
              const transitKey = `transit${i + 1}`;
              transits[transitKey] = calculateTransitDuration(seg.arrival.at, segs[i + 1].departure.at);
            }
          });

          if (seg.stops && Array.isArray(seg.stops)) {
            for (const stop of seg.stops) {
              const location = await this.airportService.airportData(stop.iataCode);
              stopover.push({
                code: stop.iataCode,
                name: location.name,
                location: location.location,
                duration: stop.duration.replace('PT', ''),
                arrivalDate: new Date(stop.arrivalAt).toDateString(),
                arrivalTime: stop.arrivalAt.split('T')[1].slice(0, 5),
                departureDate: new Date(stop.departureAt).toDateString(),
                departureTime: stop.departureAt.split('T')[1].slice(0, 5),
              });
            }
          }

          segments[tripType].push({
            marketingcareer: seg.carrierCode,
            marketingcareerName: marketingAirline.name || '',
            marketingflight: seg.number,
            operatingcareer: seg.operating?.carrierCode,
            operatingCarrierName: operatingAirline.name || '',
            operatingflight: seg.number,
            departure: seg.departure.iataCode,
            departureAirport: departureAirport.name || '',
            departureLocation: departureAirport.location || '',
            departureTime: seg.departure.at,
            arrival: seg.arrival.iataCode,
            arrivalTime: seg.arrival.at,
            arrivalAirport: arrivalAirport.name || '',
            arrivalLocation: arrivalAirport.location || '',
            flightduration: seg.duration
              .replace('PT', '')
              .replace('H', 'H ')
              .replace('M', 'Min'),
            bookingcode: travelerDetails?.class || '',
            seat: offer.numberOfBookableSeats.toString(),
            bags: `${(travelerDetails?.includedCheckedBags?.weight || 23) * (travelerDetails?.includedCheckedBags?.quantity || 0)}KG`,
            class: travelerDetails?.cabin || '',
            transit: transits,
            amenities: (fareSeg?.amenities || []).map((a: any) => ({
              description: a.description,
              isChargeable: a.isChargeable,
            })),
          });
        }
      }

      const airline = await this.airportService.airlineName(offer.validatingAirlineCodes[0]);
      const goSegments = offer?.itineraries?.[0]?.segments;
      const backSegments = offer?.itineraries?.[1]?.segments;
      const outboundFirst = goSegments?.[0];
      const outboundLast = goSegments?.slice(-1)?.[0];
      const inboundFirst = backSegments?.[0];
      const inboundLast = backSegments?.slice(-1)?.[0];
      
      const add = (Number(totalFare.toFixed(2)) * 0.05).toFixed(2);
      const bookableflight = offer?.instantTicketingRequired;
      
      if (bookableflight == false) {
        const transformed = {
          system: 'Amadeus',
          segment: segments?.go?.length + (segments?.back?.length || 0),
          offerId: offer?.id,
          triptype: triptype,
          career: offer?.validatingAirlineCodes[0],
          careerName: airline?.name,
          lastTicketTime: offer?.lastTicketingDateTime,
          basePrice: baseFare.toFixed(2),
          taxes: tax.toFixed(2),
          netPrice: (Number(totalFare.toFixed(2)) + Number(add)).toFixed(2),
          price: totalFare.toFixed(2),
          farecurrency: offer?.price?.currency,
          pricebreakdown: priceBreakdown,
          ...(outboundFirst?.departure?.iataCode && {
            godeparture: outboundFirst.departure.iataCode,
            godepartureTime: formatTime(outboundFirst.departure.at),
            godepartureDate: formatDate(outboundFirst.departure.at),
          }),
          ...(outboundLast?.arrival?.iataCode && {
            goarrival: outboundLast.arrival.iataCode,
            goarrivalTime: formatTime(outboundLast.arrival.at),
            goarrivalDate: formatDate(outboundLast.arrival.at),
          }),
          ...(offer?.itineraries?.[0]?.duration && {
            goflightduration: offer.itineraries[0].duration
              .replace('PT', '')
              .replace('H', 'H ')
              .replace('M', 'Min'),
          }),
          ...(inboundFirst?.departure?.iataCode && {
            backdeparture: inboundFirst.departure.iataCode,
            backdepartureTime: formatTime(inboundFirst.departure.at),
            backdepartureDate: formatDate(inboundFirst.departure.at),
          }),
          ...(inboundLast?.arrival?.iataCode && {
            backarrival: inboundLast.arrival.iataCode,
            backarrivalTime: formatTime(inboundLast.arrival.at),
            backarrivalDate: formatDate(inboundLast.arrival.at),
          }),
          ...(offer?.itineraries?.[1]?.duration && {
            backflightduration: offer.itineraries[1].duration
              .replace('PT', '')
              .replace('H', 'H ')
              .replace('M', 'Min'),
          }),
          seat: offer.numberOfBookableSeats,
          cabinClass: fareDetails?.[0]?.cabin || '',
          refundable: fareDetails?.[0]?.amenities?.some((a: any) => a.description?.includes('REFUNDABLE'))
            ? 'Refundable'
            : 'Non-refundable',
          segments,
          stopover,
          AirFareData: offer,
        };
        results.push(transformed);
      }
    }
    
    return results;
  }

  async convertPriceCheck(data: any, triptype: string): Promise<any> {
    const offer = data?.data?.flightOffers[0] || [];
    
    const formatTime = (dateTime: string) => new Date(dateTime).toTimeString().split(' ')[0];
    
    const formatDate = (dateTime: string) => {
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      };
      return new Date(dateTime).toLocaleDateString('en-US', options);
    };
    
    const calculateTransitDuration = (arrivalTime: string, nextDepartureTime: string) => {
      const arrival = new Date(arrivalTime);
      const departure = new Date(nextDepartureTime);
      const diffMinutes = Math.floor((departure.getTime() - arrival.getTime()) / (1000 * 60));
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}H ${minutes}Min`;
    };

    const segments = { go: [], back: [] };
    const priceBreakdown = [];
    const stopover = [];
    
    const totalFare = parseFloat(offer?.price?.total);
    const baseFare = parseFloat(offer?.price?.base);
    const tax = totalFare - baseFare;
    
    const pricing = offer.travelerPricings?.[0];
    const fareDetails = pricing?.fareDetailsBySegment;

    for (const tp of offer.travelerPricings) {
      const checkinBag = tp?.fareDetailsBySegment?.[0]?.includedCheckedBags || {};
      const checkinhasWeight = typeof checkinBag.weight === 'number';
      const checkinhasQuantity = typeof checkinBag.quantity === 'number';
      
      let checkInBagWeight = 0;
      if (checkinhasWeight && checkinhasQuantity) {
        checkInBagWeight = checkinBag.weight * checkinBag.quantity;
      } else if (checkinhasWeight) {
        checkInBagWeight = checkinBag.weight;
      } else if (checkinhasQuantity) {
        checkInBagWeight = 20 * checkinBag.quantity;
      }
      
      const cabinBag = tp?.fareDetailsBySegment?.[0]?.includedCabinBags || {};
      const cabinhasWeight = typeof cabinBag.weight === 'number';
      const cabinhasQuantity = typeof cabinBag.quantity === 'number';
      
      let cabinBagWeight = 0;
      if (cabinhasQuantity) {
        const weightPerBag = cabinhasWeight ? cabinBag.weight : 7;
        cabinBagWeight = weightPerBag * cabinBag.quantity;
      } else if (cabinhasWeight) {
        cabinBagWeight = cabinBag.weight;
      } else {
        cabinBagWeight = 7;
      }

      priceBreakdown.push({
        BaseFare: tp.price.base,
        Tax: (parseFloat(tp.price.total) - parseFloat(tp.price.base)).toFixed(2),
        PaxCount: '1',
        PaxType: tp.travelerType,
        Discount: '0',
        OtherCharges: '0',
        ServiceFee: '0',
        CheckInBags: `${checkInBagWeight}KG`,
        CabinBags: `${cabinBagWeight}KG`,
      });
    }

    for (const [idx, itinerary] of offer.itineraries.entries()) {
      const tripType = idx === 0 ? 'go' : 'back';
      const segs = itinerary.segments;
      
      for (let i = 0; i < segs.length; i++) {
        const fareSeg = fareDetails[i] || {};
        const seg = segs[i];
        const travelerDetails = pricing?.fareDetailsBySegment.find((fd: any) => fd.segmentId === seg.id);
        
        const departureAirport = await this.airportService.airportData(seg.departure.iataCode);
        const arrivalAirport = await this.airportService.airportData(seg.arrival.iataCode);
        const marketingAirline = await this.airportService.airlineName(seg.carrierCode);
        const operatingAirline = await this.airportService.airlineName(seg.operating?.carrierCode);
        
        const transits = {};
        segs.forEach((seg: any, i: number) => {
          if (
            i < segs.length - 1 &&
            seg.arrival?.at &&
            segs[i + 1]?.departure?.at
          ) {
            const transitKey = `transit${i + 1}`;
            transits[transitKey] = calculateTransitDuration(seg.arrival.at, segs[i + 1].departure.at);
          }
        });

        if (seg.stops && Array.isArray(seg.stops)) {
          for (const stop of seg.stops) {
            const location = await this.airportService.airportData(stop.iataCode);
            stopover.push({
              code: stop.iataCode,
              name: location.name,
              location: location.location,
              duration: stop.duration.replace('PT', ''),
              arrivalDate: new Date(stop.arrivalAt).toDateString(),
              arrivalTime: stop.arrivalAt.split('T')[1].slice(0, 5),
              departureDate: new Date(stop.departureAt).toDateString(),
              departureTime: stop.departureAt.split('T')[1].slice(0, 5),
            });
          }
        }

        segments[tripType].push({
          marketingcareer: seg.carrierCode,
          marketingcareerName: marketingAirline.name || '',
          marketingflight: seg.number,
          operatingcareer: seg.operating?.carrierCode,
          operatingCarrierName: operatingAirline.name || '',
          operatingflight: seg.number,
          departure: seg.departure.iataCode,
          departureAirport: departureAirport.name || '',
          departureLocation: departureAirport.location || '',
          departureTime: seg.departure.at,
          arrival: seg.arrival.iataCode,
          arrivalTime: seg.arrival.at,
          arrivalAirport: arrivalAirport.name || '',
          arrivalLocation: arrivalAirport.location || '',
          flightduration: seg.duration
            .replace('PT', '')
            .replace('H', 'H ')
            .replace('M', 'Min'),
          bookingcode: travelerDetails?.class || '',
          seat: offer.numberOfBookableSeats,
          bags: `${(travelerDetails?.includedCheckedBags?.weight || 23) * (travelerDetails?.includedCheckedBags?.quantity || 0)}KG`,
          class: travelerDetails?.cabin || '',
          transit: transits,
          amenities: (fareSeg?.amenities || []).map((a: any) => ({
            description: a.description,
            isChargeable: a.isChargeable,
          })),
        });
      }
    }

    const airline = await this.airportService.airlineName(offer.validatingAirlineCodes[0]);
    const goSegments = offer?.itineraries?.[0]?.segments;
    const backSegments = offer?.itineraries?.[1]?.segments;
    const outboundFirst = goSegments?.[0];
    const outboundLast = goSegments?.slice(-1)?.[0];
    const inboundFirst = backSegments?.[0];
    const inboundLast = backSegments?.slice(-1)?.[0];
    
    const add = (Number(totalFare.toFixed(2)) * 0.05).toFixed(2);
    const lastTicketTime = offer?.lastTicketingDateTime ?? offer?.lastTicketingDate;
    
    let diffDays;
    if (lastTicketTime) {
      const now = new Date();
      const ticketTime = new Date(lastTicketTime);
      const diffMs = ticketTime.getTime() - now.getTime();
      diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays > 6) {
        diffDays = 6;
      }
    }

    const documentRequired = data?.data?.bookingRequirements?.travelerRequirements?.[0]
      ?.documentRequired ?? false;
    const dateOfBirthRequired = data?.data?.bookingRequirements?.travelerRequirements?.[0]
      ?.dateOfBirthRequired ?? false;

    const transformed = {
      system: 'Amadeus',
      segment: segments?.go?.length + (segments?.back?.length || 0),
      offerId: offer?.id,
      passportRequired: documentRequired,
      dateOfBirthRequired: dateOfBirthRequired,
      triptype: triptype,
      career: offer?.validatingAirlineCodes[0],
      careerName: airline?.name,
      lastTicketTime: lastTicketTime,
      bookingHold: diffDays,
      basePrice: baseFare.toFixed(2),
      taxes: tax.toFixed(2),
      netPrice: (Number(totalFare.toFixed(2)) + Number(add)).toFixed(2),
      price: totalFare.toFixed(2),
      farecurrency: offer?.price?.currency,
      pricebreakdown: priceBreakdown,
      ...(outboundFirst?.departure?.iataCode && {
        godeparture: outboundFirst.departure.iataCode,
        godepartureTime: formatTime(outboundFirst.departure.at),
        godepartureDate: formatDate(outboundFirst.departure.at),
      }),
      ...(outboundLast?.arrival?.iataCode && {
        goarrival: outboundLast.arrival.iataCode,
        goarrivalTime: formatTime(outboundLast.arrival.at),
        goarrivalDate: formatDate(outboundLast.arrival.at),
      }),
      ...(offer?.itineraries?.[0]?.duration && {
        goflightduration: offer.itineraries[0].duration
          .replace('PT', '')
          .replace('H', 'H ')
          .replace('M', 'Min'),
      }),
      ...(inboundFirst?.departure?.iataCode && {
        backdeparture: inboundFirst.departure.iataCode,
        backdepartureTime: formatTime(inboundFirst.departure.at),
        backdepartureDate: formatDate(inboundFirst.departure.at),
      }),
      ...(inboundLast?.arrival?.iataCode && {
        backarrival: inboundLast.arrival.iataCode,
        backarrivalTime: formatTime(inboundLast.arrival.at),
        backarrivalDate: formatDate(inboundLast.arrival.at),
      }),
      ...(offer?.itineraries?.[1]?.duration && {
        backflightduration: offer.itineraries[1].duration
          .replace('PT', '')
          .replace('H', 'H ')
          .replace('M', 'Min'),
      }),
      seat: offer.numberOfBookableSeats,
      cabinClass: fareDetails?.[0]?.cabin || '',
      refundable: fareDetails?.[0]?.amenities?.some((a: any) => a.description?.includes('REFUNDABLE'))
        ? 'Refundable'
        : 'Non-refundable',
      segments,
      stopover,
      AirFareData: data,
    };
    
    return transformed;
  }

  async convertManageBooking(data: any, header: any, bookingId: string, triptype: string): Promise<any> {
    if (
      !data?.flightOffers ||
      !Array.isArray(data.flightOffers) ||
      data.flightOffers.length === 0
    ) {
      throw new Error('Missing flight offer data.');
    }

    const offer = data.flightOffers[0];
    if (
      !Array.isArray(offer.travelerPricings) ||
      offer.travelerPricings.length === 0
    ) {
      throw new Error('Missing traveler pricing.');
    }

    const formatTime = (dateTime: string) => new Date(dateTime).toTimeString().split(' ')[0];
    
    const formatDate = (dateTime: string) => {
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      };
      return new Date(dateTime).toLocaleDateString('en-US', options);
    };
    
    const calculateTransitDuration = (arrivalTime: string, nextDepartureTime: string) => {
      const arrival = new Date(arrivalTime);
      const departure = new Date(nextDepartureTime);
      const diffMinutes = Math.floor((departure.getTime() - arrival.getTime()) / (1000 * 60));
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}H ${minutes}Min`;
    };

    const segments = { go: [], back: [] };
    const priceBreakdown = [];
    const stopover = [];
    
    const totalFare = parseFloat(offer?.price?.total || '0');
    const baseFare = parseFloat(offer?.price?.base || '0');
    const tax = totalFare - baseFare;

    for (const tp of offer.travelerPricings) {
      const fareSegment = Array.isArray(tp.fareDetailsBySegment)
        ? tp.fareDetailsBySegment[0]
        : {};
      const checkinBag = fareSegment?.includedCheckedBags || {};
      const cabinBag = fareSegment?.includedCabinBags || {};
      
      const checkInBagWeight = (typeof checkinBag.weight === 'number' ? checkinBag.weight : 20) *
        (checkinBag.quantity || 1);
      const cabinBagWeight = (typeof cabinBag.weight === 'number' ? cabinBag.weight : 7) *
        (cabinBag.quantity || 1);

      priceBreakdown.push({
        BaseFare: tp.price.base,
        Tax: (parseFloat(tp.price.total) - parseFloat(tp.price.base)).toFixed(2),
        PaxCount: '1',
        PaxType: tp.travelerType,
        Discount: '0',
        OtherCharges: '0',
        ServiceFee: '0',
        CheckInBags: `${checkInBagWeight}KG`,
        CabinBags: `${cabinBagWeight}KG`,
      });
    }

    const pricing = offer.travelerPricings[0];
    const fareDetails = pricing?.fareDetailsBySegment || [];

    for (const [idx, itinerary] of (offer.itineraries || []).entries()) {
      const tripType = idx === 0 ? 'go' : 'back';
      const segs = itinerary.segments || [];
      
      for (let i = 0; i < segs.length; i++) {
        const fareSeg = fareDetails[i] || {};
        const seg = segs[i];
        const travelerDetails = pricing?.fareDetailsBySegment?.find((fd: any) => fd.segmentId === seg.id);
        
        const departureAirport = await this.airportService.airportData(seg.departure.iataCode);
        const arrivalAirport = await this.airportService.airportData(seg.arrival.iataCode);
        const marketingAirline = await this.airportService.airlineName(seg?.carrierCode);
        const operatingAirline = await this.airportService.airlineName(seg?.operating?.carrierCode);
        
        const transits = {};
        segs.forEach((seg: any, i: number) => {
          if (
            i < segs.length - 1 &&
            seg.arrival?.at &&
            segs[i + 1]?.departure?.at
          ) {
            const transitKey = `transit${i + 1}`;
            transits[transitKey] = calculateTransitDuration(seg.arrival.at, segs[i + 1].departure.at);
          }
        });

        if (Array.isArray(seg.stops)) {
          for (const stop of seg.stops) {
            const location = await this.airportService.airportData(stop.iataCode);
            stopover.push({
              code: stop.iataCode,
              name: location.name,
              location: location.location,
              duration: stop.duration.replace('PT', ''),
              arrivalDate: new Date(stop.arrivalAt).toDateString(),
              arrivalTime: stop.arrivalAt.split('T')[1].slice(0, 5),
              departureDate: new Date(stop.departureAt).toDateString(),
              departureTime: stop.departureAt.split('T')[1].slice(0, 5),
            });
          }
        }

        segments[tripType].push({
          marketingcareer: seg?.carrierCode || '',
          marketingcareerName: marketingAirline?.name || '',
          marketingflight: seg.number,
          operatingcareer: seg.operating?.carrierCode || '',
          operatingCarrierName: operatingAirline?.name || '',
          operatingflight: seg.number,
          departure: seg.departure.iataCode,
          departureAirport: departureAirport?.name || '',
          departureLocation: departureAirport?.location || '',
          departureTime: seg.departure.at,
          arrival: seg.arrival.iataCode,
          arrivalTime: seg.arrival.at,
          arrivalAirport: arrivalAirport?.name || '',
          arrivalLocation: arrivalAirport?.location || '',
          flightduration: seg.duration
            .replace('PT', '')
            .replace('H', 'H ')
            .replace('M', 'Min'),
          bookingcode: travelerDetails?.class || '',
          seat: offer.numberOfBookableSeats,
          bags: `${(travelerDetails?.includedCheckedBags?.weight || 23) * (travelerDetails?.includedCheckedBags?.quantity || 0)}KG`,
          class: travelerDetails?.cabin || '',
          transit: transits,
          amenities: (fareSeg?.amenities || []).map((a: any) => ({
            description: a.description,
            isChargeable: a.isChargeable,
          })),
        });
      }
    }

    const airlineCode = offer?.validatingAirlineCodes?.[0] || '';
    const airline = await this.airportService.airlineName(airlineCode);
    const goSegments = offer?.itineraries?.[0]?.segments || [];
    const backSegments = offer?.itineraries?.[1]?.segments || [];
    const outboundFirst = goSegments[0] || null;
    const outboundLast = goSegments.length > 0 ? goSegments[goSegments.length - 1] : null;
    const inboundFirst = backSegments[0] || null;
    const inboundLast = backSegments.length > 0 ? backSegments[backSegments.length - 1] : null;
    
    const add = (totalFare * 0.05).toFixed(2);
    const lastTicketTime = data?.ticketingAgreement?.dateTime || null;
    
    const travellers = (data?.travelers || []).map((traveler: any) => {
      const phone = traveler.contact?.phones?.[0] || {};
      const document = traveler.documents?.[0] || {};
      return {
        firstName: traveler.name?.firstName || '',
        lastName: traveler.name?.lastName || '',
        gender: traveler.gender || '',
        emailAddress: traveler.contact?.emailAddress || '',
        countryCallingCode: phone.countryCallingCode || '',
        phonenumber: phone.number || '',
        ...(traveler.dateOfBirth && { dateOfBirth: traveler.dateOfBirth }),
        ...(document.number && { passportNumber: document.number }),
        ...(document.expiryDate && { passportExpireDate: document.expiryDate }),
        ...(document.issuanceCountry && {
          issuanceCountry: document.issuanceCountry,
        }),
        ...(document.validityCountry && {
          validityCountry: document.validityCountry,
        }),
        ...(document.nationality && { nationality: document.nationality }),
      };
    });

    const transformed = {
      system: 'Amadeus',
      segment: segments.go.length + segments.back.length,
      offerId: offer?.id,
      status: 'Booked',
      bookingId: bookingId,
      bookingDateTime: data?.associatedRecords?.[1]?.creationDate ||
        data?.associatedRecords?.[0]?.creationDate ||
        null,
      triptype: triptype || 'Unknown',
      career: airlineCode,
      gdsPNR: data?.associatedRecords?.[1]?.reference ||
        data?.associatedRecords?.[0]?.reference ||
        null,
      airlinePNR: data?.associatedRecords?.[0]?.reference || null,
      careerName: airline?.name || '',
      lastTicketTime: lastTicketTime,
      basePrice: baseFare.toFixed(2),
      taxes: tax.toFixed(2),
      netPrice: (Number(totalFare.toFixed(2)) + Number(add)).toFixed(2),
      price: totalFare.toFixed(2),
      farecurrency: offer?.price?.currency,
      pricebreakdown: priceBreakdown,
      ...(outboundFirst && {
        godeparture: outboundFirst?.departure?.iataCode,
        godepartureTime: formatTime(outboundFirst?.departure?.at),
        godepartureDate: formatDate(outboundFirst?.departure?.at),
      }),
      ...(outboundLast && {
        goarrival: outboundLast?.arrival?.iataCode,
        goarrivalTime: formatTime(outboundLast?.arrival?.at),
        goarrivalDate: formatDate(outboundLast?.arrival?.at),
      }),
      ...(offer?.itineraries?.[0]?.duration && {
        goflightduration: offer.itineraries[0].duration
          .replace('PT', '')
          .replace('H', 'H ')
          .replace('M', 'Min'),
      }),
      ...(inboundFirst && {
        backdeparture: inboundFirst?.departure?.iataCode,
        backdepartureTime: formatTime(inboundFirst?.departure?.at),
        backdepartureDate: formatDate(inboundFirst?.departure?.at),
      }),
      ...(inboundLast && {
        backarrival: inboundLast?.arrival?.iataCode,
        backarrivalTime: formatTime(inboundLast?.arrival?.at),
        backarrivalDate: formatDate(inboundLast?.arrival?.at),
      }),
      ...(offer?.itineraries?.[1]?.duration && {
        backflightduration: offer.itineraries[1].duration
          .replace('PT', '')
          .replace('H', 'H ')
          .replace('M', 'Min'),
      }),
      seat: offer.numberOfBookableSeats,
      cabinClass: fareDetails?.[0]?.cabin || '',
      refundable: fareDetails?.[0]?.amenities?.some((a: any) => a.description?.includes('REFUNDABLE'))
        ? 'Refundable'
        : 'Non-refundable',
      segments,
      stopover,
      travellers,
    };
    
    await this.saveFlightOffer(transformed, header);
    return transformed;
  }

  async saveFlightOffer(data: any, header: any): Promise<any> {
    const decodeToken = await this.authservice.decodeToken(header);
    const user = await this.userRepository.findOne({
      where: { email: decodeToken },
    });
    const agent = await this.agentRepository.findOne({
      where: { email: decodeToken },
    });

    const flightOffer = this.saveBooking.create({
      system: data.system,
      segment: data.segment,
      status: data.status,
      offerId: data.offerId,
      bookingId: data.bookingId,
      bookingDateTime: data.bookingDateTime,
      triptype: data.triptype,
      career: data.career,
      gdsPNR: data.gdsPNR,
      airlinePNR: data.airlinePNR,
      careerName: data.careerName,
      lastTicketTime: data.lastTicketTime,
      basePrice: data.basePrice,
      taxes: data.taxes,
      netPrice: data.netPrice,
      price: data.price,
      farecurrency: data.farecurrency,
      pricebreakdown: data.pricebreakdown,
      godeparture: data.godeparture,
      godepartureTime: data.godepartureTime,
      godepartureDate: data.godepartureDate,
      goarrival: data.goarrival,
      goarrivalTime: data.goarrivalTime,
      goarrivalDate: data.goarrivalDate,
      backdeparture: data.backdeparture,
      backdepartureTime: data.backdepartureTime,
      backdepartureDate: data.backdepartureDate,
      backarrival: data.backarrival,
      backarrivalTime: data.backarrivalTime,
      backarrivalDate: data.backarrivalDate,
      cabinClass: data.cabinClass,
      refundable: data.refundable,
      segments: data.segments,
      stopover: data.stopover || [],
      travellers: data.travellers,
      user: user || null,
      agent: agent || null,
    });
    
    return this.saveBooking.save(flightOffer);
  }
}