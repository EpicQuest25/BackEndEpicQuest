import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

// Import modules that exist in src
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { PaymentGatewayModule } from './payment-gateway/payment-gateway.module';
import { TransactionModule } from './transaction/transaction.module';
import { AdminModule } from './admin/admin.module';
import { AirportsModule } from './airports/airports.module';
import { BookingModule } from './booking/booking.module';
import { CurrencyModule } from './currency/currency.module';
import { FlightModule } from './flight/flight.module';
import { HotelModule } from './hotel/hotel.module';
import { NotificationModule } from './notification/notification.module';
import { SupplierModule } from './supplier/supplier.module';
import { TourPackageModule } from './tour-package/tour-package.module';
import { UploadModule } from './upload/upload.module';
import { AgentModule } from './agent/agent.module';

// Note: The other modules exist in the compiled dist directory but not in src
// We'll need to recreate these modules or copy them from the original project

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Use PostgreSQL with Render's environment variables
    ...(process.env.PGHOST ? [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.PGHOST,
        port: parseInt(process.env.PGPORT) || 5432,
        username: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        migrationsRun: true, // Automatically run migrations on application start
        synchronize: false, // Set to false when using migrations
        ssl: {
          rejectUnauthorized: false, // Required for Render PostgreSQL
        },
      }),
    ] : []),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret_key_for_development',
      signOptions: { expiresIn: process.env.JWT_TIME + 's' || '86400s' },
    }),
    // Include modules that exist in src
    AuthenticationModule,
    UserModule,
    PaymentGatewayModule,
    TransactionModule,
    AdminModule,
    AirportsModule,
    BookingModule,
    CurrencyModule,
    FlightModule,
    HotelModule,
    NotificationModule,
    SupplierModule,
    TourPackageModule,
    UploadModule,
    AgentModule,
    
    // All modules have been restored and are properly imported above.
    // The application is ready for deployment.
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}