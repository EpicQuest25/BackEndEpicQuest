import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveBooking } from './entity/bookingId.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { AuthenticationService } from '../authentication/authentication.service';
import { Agent } from '../agent/entities/agent.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(SaveBooking)
    private readonly saveBooking: Repository<SaveBooking>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async findOne(id: string) {
    const booking = await this.saveBooking.findOne({
      where: { bookingId: id },
    });
    delete booking.id;
    return booking;
  }

  async findAll() {
    return await this.saveBooking.find({ order: { id: 'DESC' } });
  }

  async findUserWithBookings(header: any, bookingStatus: string, page = 1, limit = 10) {
    const pageNumber = Math.max(1, page);
    const limitNumber = limit > 0 ? limit : 10;
    const offset = (pageNumber - 1) * limitNumber;

    const email = await this.authenticationService.decodeToken(header);
    const user = await this.userRepository.findOne({ where: { email } });
    const agent = !user
      ? await this.agentRepository.findOne({ where: { email } })
      : null;

    if (!user && !agent) {
      throw new UnauthorizedException('No user or agent found for this email');
    }

    const query = this.saveBooking
      .createQueryBuilder('saveBooking')
      .leftJoinAndSelect('saveBooking.user', 'user')
      .leftJoinAndSelect('saveBooking.agent', 'agent')
      .where('LOWER(saveBooking.status) = LOWER(:status)', {
        status: bookingStatus,
      });

    if (user) {
      query.andWhere('user.email = :email', { email });
    } else if (agent) {
      query.andWhere('agent.email = :email', { email });
    }

    const [bookings, total] = await query
      .orderBy('saveBooking.id', 'DESC')
      .skip(offset)
      .take(limitNumber)
      .getManyAndCount();

    if (!bookings || bookings.length === 0) {
      throw new NotFoundException(`No ${bookingStatus} bookings available for this account`);
    }

    const filteredBookings = bookings.map((booking) => ({
      system: booking.system,
      segment: booking.segment,
      offerId: booking.offerId,
      bookingId: booking.bookingId,
      bookingDateTime: booking.bookingDateTime,
      triptype: booking.triptype,
      career: booking.career,
      gdsPNR: booking.gdsPNR,
      airlinePNR: booking.airlinePNR,
      status: booking.status,
      careerName: booking.careerName,
      lastTicketTime: booking.lastTicketTime,
      basePrice: booking.basePrice,
      taxes: booking.taxes,
      netPrice: booking.netPrice,
      price: booking.price,
      farecurrency: booking.farecurrency,
      pricebreakdown: booking.pricebreakdown,
      godeparture: booking.godeparture,
      godepartureTime: booking.godepartureTime,
      godepartureDate: booking.godepartureDate,
      goarrival: booking.goarrival,
      goarrivalTime: booking.goarrivalTime,
      goarrivalDate: booking.goarrivalDate,
      backdeparture: booking.backdeparture,
      backdepartureTime: booking.backdepartureTime,
      backdepartureDate: booking.backdepartureDate,
      backarrival: booking.backarrival,
      backarrivalTime: booking.backarrivalTime,
      backarrivalDate: booking.backarrivalDate,
      cabinClass: booking.cabinClass,
      refundable: booking.refundable,
      segments: booking.segments,
      stopover: booking.stopover,
      travellers: booking.travellers,
      createdDate: booking.createdDate,
      updatedDate: booking.updatedDate,
    }));

    return {
      bookings: filteredBookings,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    };
  }
}