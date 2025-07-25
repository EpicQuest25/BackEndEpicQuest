import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ServiceUnavailableException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class CombinedUserAgentJwtGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;

    try {
      await this.authenticationService.verifyUserToken(headers);
      return true;
    } catch (userError) {
      if (
        userError instanceof UnauthorizedException ||
        userError instanceof ServiceUnavailableException
      ) {
        throw userError;
      }

      try {
        await this.authenticationService.verifyAgentToken(headers);
        return true;
      } catch (agentError) {
        if (
          agentError instanceof UnauthorizedException ||
          agentError instanceof ServiceUnavailableException
        ) {
          throw agentError;
        }

        throw new UnauthorizedException({
          module: 'UNKNOWN',
          message: 'Invalid token: not a valid user or agent.',
        });
      }
    }
  }
}