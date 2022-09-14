import { Injectable } from '@nestjs/common';
import {User} from "../user/user.entity";

@Injectable()
export class CollectionService {
    async findUserGames(userId: string) {
        return await User.findOneOrFail({ where: { userId } });
    }
}
