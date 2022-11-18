import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { extractJwtFromQuery } from './extract-jwt-from-req-param';
import {config} from "../../../config/config";

@Injectable()
export class JwtResetPasswordStrategy extends PassportStrategy(
  Strategy,
  'reset',
) {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractJwtFromQuery]),
      ignoreExpiration: false,
      secretOrKey: config.JWT_SECRET,
    });
  }

  async validate(payload: {
    email: string;
    userId: string;
    token: string;
    iat: number;
    exp: number;
  }) {
    const user = await this.userService.findUser(payload.userId);

    if (!user.isActive) {
      throw new HttpException(
        'Twoje konto nie jest jeszcze aktywne',
        HttpStatus.FORBIDDEN,
      );
    }

    return user;
  }
}
