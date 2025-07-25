import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier, Roles } from './entities/supplier.entity';
import { AuthenticationModule } from '../authentication/authentication.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Supplier, Roles]),
    AuthenticationModule,
    NotificationModule,
  ],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}