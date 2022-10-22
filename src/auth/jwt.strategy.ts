import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { User } from '../user/user.entity';
// import appConfig from './config/app.config';
import {JwtPayload} from "../../types";
import {config} from "../../config/config";

function cookieExtractor(req: any): null | string {
  return req && req.cookies ? req.cookies?.jwt ?? null : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // secretOrKey: appConfig().jwtSecret,
      secretOrKey: config.JWT_SECRET,
      ignoreExpiration: false,
      jwtFromRequest: cookieExtractor,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    console.log('1')
    if (!payload || !payload.userId) {
      console.log('7')
      throw new UnauthorizedException();
    }

    const { userId } = payload;
    const user: User = await User.findOneOrFail({ where: { userId } });
    console.log('3')

    if (!user) {
      console.log('4')
      throw new UnauthorizedException();
    }
    console.log('2')

    return user;
  }
}
