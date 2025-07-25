import { Module } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { Hotelbeds } from './resorce/hotelbeds.service';
import { HotelbedsResorce } from './resorce/hotelbeds.resorce';
import { CurrencyModule } from '../currency/currency.module';

@Module({
  imports: [CurrencyModule],
  controllers: [HotelController],
  providers: [HotelService, Hotelbeds, HotelbedsResorce],
})
export class HotelModule {}