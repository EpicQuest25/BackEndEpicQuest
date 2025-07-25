import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AdminJwtguardGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    
    try {
      // We need to add this method to the authentication service
      await this.authenticationService.verifyAdminToken(headers);
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired admin token');
    }
  }
}