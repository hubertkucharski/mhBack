import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserFiltered } from '../../types/user';

@Injectable()
export class UserService {
  constructor() {}

  async findUser(userId: string) {
    return await User.findOneOrFail({ where: { userId } });
  }

  async findUserEmail(email: string) {
    return await User.findOneOrFail({ where: { email } });
  }

  async findAllUsers() {
    return await User.find();
  }

  filterUsersData(user: User): UserFiltered {
    const { userId, email, isActive } = user;
    return { userId, email, isActive };
  }

  // async validateUser(email: string, password: string): Promise<any> {
  //   const user = await this.findUserEmail(email);
  //   if (user && (await bcrypt.compare(password, user.password))) {
  //     console.log(user);
  //     const payload: JwtPayload = {
  //       userId: user.userId,
  //       email,
  //     };
  //     const { password: _pass, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }
}
