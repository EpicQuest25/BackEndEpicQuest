import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

// Import modules that exist in src
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';

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
        synchronize: true, // Set to true for development to auto-create tables
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
    
    // To restore all modules, we would need to:
    // 1. Copy the module files from the original project to this project
    // 2. Update this file to import and include those modules
    // 3. Push the changes to GitHub and redeploy
    
    // The missing modules are:
    // - PaymentGatewayModule
    // - AdminModule
    // - SupplierModule
    // - AgentModule
    // - NotificationModule
    // - CurrencyModule
    // - HotelModule
    // - FlightModule
    // - UploadModule
    // - TourpackageModule
    // - AirportsModule
    // - BookingModule
    // - TransectionModule
    // - TourPackageModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}