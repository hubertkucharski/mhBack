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
    async isGameInUserGames( gameId: string, userId: string): Promise<boolean>{
        const userGames = await this.findUserGames(userId);
        return userGames[0].gameId.some( el => el.gameId == gameId )
    }

    async addGameToCollection( gameId: string , userId: string) {
        // finds relations not only user
        const user = await this.findUserGames(userId);
        const game = await this.bggGamesService.findGameById(gameId);

        if(!user || !game){
            return {message: "incorrect data", statusCode: 401}
        }
        // push also works
        // user[0].gameId.push(game)
        if(await this.isGameInUserGames(gameId, userId)){
            return {message: "already have in collection", statusCode: 201}
        }
        user[0].gameId = [ ...user[0].gameId, game];
        await User.save(user);

        return {message: "success", statusCode: 200};
    }
    async removeGameFromCollection(gameId: string, userId: string) {
        // finds relations not only user
        const user = await this.findUserGames(userId);
        const game = await this.bggGamesService.findGameById(gameId);

        if(!user || !game){
            return {message: "incorrect data", statusCode: 401}
        }

        if(!await this.isGameInUserGames(gameId, userId)){
            return {message: "game does not exists in your collection", statusCode: 201}
        }
        user[0].gameId = user[0].gameId.filter(el => el.gameId != game.gameId);

        await User.save(user);

        return {message: "success", statusCode: 200};
    }
}
