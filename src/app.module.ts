import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.EPICQUEST_URL,
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.EPICQUEST_DB_USERNAME,
      password: process.env.EPICQUEST_DB_PASSWORD,
      database: process.env.EPICQUEST_DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_TIME + 's' },
    }),
    AuthenticationModule,
    UserModule,
    // Import other modules here
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}