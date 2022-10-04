import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthCreateUserDto } from './dto/auth-create-user.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from '../user/user.entity';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { AuthPasswordUserDto } from './dto/auth-password-user.dto';
import { ValidateSessionUserResponse } from '../../types/auth/validateSessionUserResponse';
import { UserAuthGuard } from './auth-guards/user-auth.guard';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async createUser(
    @Body() authCredentialsDto: AuthCreateUserDto,
  ): Promise<any> {
    return this.authService.signUp(authCredentialsDto);
  }

  @ApiCookieAuth()
  @ApiOkResponse({ status: 200, description: 'OK!' })
  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async logInUser(
    @Body() req: AuthLoginUserDto,
    @GetUser() user: User,
    @Res() res: Response,
  ): Promise<any> {
    return this.authService.login(req, user, res);
  }

  @Get('/logout')
  logout(@Res({ passthrough: true }) res: Response): {
    statusCode: number;
    message: string;
  } {
    return this.authService.logout(res);
  }

  @Get('/validate')
  async validateUser(@Req() req: Request, @Res() res: Response): Promise<any> {
  }

  @Post('/send-reset-email')
  async sendEmailToResetPassword(
    @Body('email') email: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.sendEmailToReset(email);
  }

  @Patch('/reset-password')
  @UseGuards(AuthGuard('reset'))
  async resetPassword(
    @Req() { user }: { user: User },
    @Body() data: AuthPasswordUserDto,
  ): Promise<{ statusCode: number; message: string }> {
    const { email } = user;
    return this.authService.resetPassword(email, data);
  }

  @Get('/check-user')
  @ApiOkResponse({ status: 200, description: 'OK!?' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(UserAuthGuard)
  validateSessionUser(
    @Req() { user }: { user: User },
  ): ValidateSessionUserResponse {
    console.log('check user');
    return this.authService.validateSessionUser(user);
  }
}
