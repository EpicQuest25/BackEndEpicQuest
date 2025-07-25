import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto, RegisterDto, VerifyOtpDto, ResendOtpDto, ForgotPasswordDto, ResetPasswordDto } from './dto/all.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userService.findByEmail(loginDto.email);
      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      
      return {
        message: 'Login successful',
        token: this.jwtService.sign({ id: user.id, email: user.email, role: user.role }),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async register(registerDto: RegisterDto) {
    const user = await this.userService.create(registerDto);
    return {
      message: 'Registration successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    // Implement OTP verification logic
    return {
      message: 'OTP verified successfully',
      email: verifyOtpDto.email,
    };
  }

  async resendOtp(resendOtpDto: ResendOtpDto) {
    // Implement resend OTP logic
    return {
      message: 'OTP resent successfully',
      email: resendOtpDto.email,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    // Implement forgot password logic
    return {
      message: 'Password reset instructions sent to your email',
      email: forgotPasswordDto.email,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // Implement reset password logic
    return {
      message: 'Password reset successful',
    };
  }

  async verifyAdminToken(headers: any) {
    try {
      if (!headers.authorization) {
        throw new UnauthorizedException('No token provided');
      }

      const token = headers.authorization.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Invalid token format');
      }

      const decoded = this.jwtService.verify(token);
      if (decoded.role !== 'Admin') {
        throw new UnauthorizedException('Not authorized as admin');
      }

      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired admin token');
    }
  }

  async verifyUserToken(headers: any) {
    try {
      if (!headers.authorization) {
        throw new UnauthorizedException('No token provided');
      }

      const token = headers.authorization.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Invalid token format');
      }

      const decoded = this.jwtService.verify(token);
      if (decoded.role !== 'user') {
        throw new UnauthorizedException('Not authorized as user');
      }

      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired user token');
    }
  }

  async verifyAgentToken(headers: any) {
    try {
      if (!headers.authorization) {
        throw new UnauthorizedException('No token provided');
      }

      const token = headers.authorization.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Invalid token format');
      }

      const decoded = this.jwtService.verify(token);
      if (decoded.role !== 'agent') {
        throw new UnauthorizedException('Not authorized as agent');
      }

      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired agent token');
    }
  }

  async decodeToken(headers: any) {
    try {
      if (!headers.authorization) {
        throw new UnauthorizedException('No token provided');
      }

      const token = headers.authorization.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Invalid token format');
      }

      const decoded = this.jwtService.verify(token);
      return decoded.email;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}