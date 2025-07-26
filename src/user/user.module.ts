import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [
    // Always import TypeORM repository for User entity
    TypeOrmModule.forFeature([User]),
    // Import JwtModule for UserJwtGuard
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret_key_for_development',
      signOptions: { expiresIn: process.env.JWT_TIME + 's' || '86400s' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}