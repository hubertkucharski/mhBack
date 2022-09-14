import { Injectable } from '@nestjs/common';
import {User} from "./user.entity";

@Injectable()
export class UserService {
    async findUser(userId: string) {
        return await User.findOneOrFail({ where: { userId } });
    }
    async findAllUsers() {
        return await User.find();
    }
}
