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
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { ValidateSessionUserResponse } from '../../types/auth/validateSessionUserResponse';
import { MailService } from '../mail/mail.service';
import {config} from "../../config/config";

interface Activate {
  password: string;
  rePassword: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => MailService)) private mailService: MailService,
    private jwtService: JwtService,
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
        throw new ConflictException('E-mail already exists');
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
        secure: config.COOKIE_SECURE,
        domain: config.COOKIE_DOMAIN,
        httpOnly: config.COOKIE_HTTPONLY,
        maxAge: config.COOKIE_MAX_AGE,
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
      userId: user.userId,
      token: user.token,
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

    const token = this.generateToken(user);

    await this.mailService.sendMail(
      email,
      `Reset hasła do aplikacji mh`,
      `<a href="${config.resetPassword}/?token=${token}">Kliknij, aby zresetować hasło</a>`,
    );

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
