import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCreateUserDto } from './dto/auth-create-user.dto';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../types';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { ValidateSessionUserResponse } from '../../types/auth/validateSessionUserResponse';

interface Activate {
  password: string;
  rePassword: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async setPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  validateSessionUser(user: User): ValidateSessionUserResponse {
    return { user, status: 200 };
  }

  async signUp(authCreateUserDto: AuthCreateUserDto): Promise<any> {
    const { email, password } = authCreateUserDto;
    const user = new User();

    user.email = email;
    user.password = await this.setPassword(password);

    try {
      await user.save();
      return this.userService.filterUsersData(user);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException(e.message);
      }
    }
  }

  async login(req: AuthLoginUserDto, user: User, res: Response): Promise<any> {
    const { email, password } = req;

    const payload: JwtPayload = {
      userId: user.userId,
      email,
    };
    const accessToken: string = this.jwtService.sign(payload);
    console.log('accessToken');
    console.log(accessToken);
    res.cookie('auth', accessToken, {
      signed: true,
      httpOnly: true,
    });
    res.cookie('user', user, {
      signed: true,
      httpOnly: true,
    });
    res
      .cookie('jwt', accessToken, {
        secure: this.configService.get('COOKIE_SECURE'),
        domain: this.configService.get('COOKIE_DOMAIN'),
        httpOnly: this.configService.get('COOKIE_HTTPONLY'),
        maxAge: this.configService.get('COOKIE_MAX_AGE'),
      })
      .json(this.userService.filterUsersData(user));
    return { message: 'Zalogowano', user, statusCode: 200 };
  }

  logout(response: Response) {
    response.clearCookie('auth');
    response.clearCookie('user');
    response.clearCookie('jwt');
    return {
      statusCode: 200,
      message: 'Wylogowano',
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _pass, ...result } = user;

      return result;
    }
    return null;
  }

  generateToken(user: User) {
    const payload = {
      email: user.email,
      id: user.userId,
    };

    return this.jwtService.sign(payload, { expiresIn: '10h' });
  }

  async sendEmailToReset(email: string) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return {
        statusCode: 404,
        message: 'Użytkownik o tym emailu nie istnieje',
      };
    }

    return { statusCode: 200, message: 'Email do resetowania hasła wysłany' };
  }

  async resetPassword(email: string, data: Activate) {
    const user = await User.findOneOrFail({ where: { email } });

    if (
      !data.password ||
      !data.rePassword ||
      data.password !== data.rePassword
    ) {
      return {
        message: 'Musisz uzupełnić i powtórzyć hasło i muszą być takie same',
        statusCode: 404,
      };
    }

    user.password = await this.setPassword(data.password);
    await user.save();

    return {
      statusCode: 202,
      message: 'Hasło zresetowane poprawnie',
    };
  }
}