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
import { extractJwtFromCookie } from './extract-jwt-from-cookie';
import {config} from "../../../config/config";

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'user') {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractJwtFromCookie]),
      ignoreExpiration: false,
      secretOrKey: config.JWT_SECRET,
    });
  }

  async validate(payload: {
    email: string;
    id: string;
    iat: number;
    exp: number;
  }) {
    const user = await this.userService.findUserEmail(payload.email);
    if (user === null) {
      console.log('4')
      throw new HttpException('Brak dostępu do zasobów', HttpStatus.FORBIDDEN);
    }

    const { password, token, ...rest } = user;
    return rest;
  }
}
