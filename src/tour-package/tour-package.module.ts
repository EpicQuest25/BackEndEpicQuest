import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../admin/entities/admin.entity';
import { Introduction } from './entities/Introduction.model';
import { TourPlan } from './entities/tourPlan.Model';
import { TourPackage } from './entities/tourPackage.model';
import { VisitPlaceImage } from './entities/visitPlaceImage.model';
import { MainImage } from './entities/mainImage.model';
import { tourBooking } from './entities/tourbooking.model';
import { User } from '../user/entities/user.entity';
import { TourPackageController } from './tour-package.controller';
import { TourPackageService } from './tour-package.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin,
      Introduction,
      TourPlan,
      TourPackage,
      VisitPlaceImage,
      MainImage,
      tourBooking,
      User,
    ]),
  ],
  controllers: [TourPackageController],
  providers: [TourPackageService],
})
export class TourPackageModule {}