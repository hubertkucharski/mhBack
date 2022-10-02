import {Inject, Injectable} from '@nestjs/common';
import {User} from "../user/user.entity";
import {BggGamesService} from "../bgg-games/bgg-games.service";

@Injectable()
export class CollectionService {
    constructor(@Inject(BggGamesService) private bggGamesService: BggGamesService) {}
    //find everything in users collection
    async findUserGames(userId: string) {
        return await User.find({relations: ['gameId'], where: { userId:  userId}})
    }

    async addGameToCollection(data: { gameId: string; userId: string }) {
        const { userId, gameId } = data;
        // finds relations not only user
        const user = await this.findUserGames(userId);
        const game = await this.bggGamesService.findGameById(gameId);

        if(!user || !game){
            return {message: "incorrect data", statusCode: 401}
        }
        // push also works
        // user[0].gameId.push(game)

        user[0].gameId = [ ...user[0].gameId, game];
        await User.save(user);

        return {message: "success", statusCode: 200};
    }
}
