import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from "uuid";
import {CollectionEntity, SimpleUsersEntity} from "../types/gameEntity";
import {ValidationError} from "../utils/errors";


type GameCollectionRecordResults = [CollectionEntity[], FieldPacket[]];

export class GameCollectionRecord implements CollectionEntity {
    public collectionId: string
    public userId: string;
    public gameId: string;
        constructor(obj: CollectionEntity) {
            if(!obj.gameId || !obj.userId){
                throw new ValidationError('Wrong user name or game ID.');
            }
            this.collectionId = obj.collectionId;
            this.userId = obj.userId;
            this.gameId = obj.gameId;
        }

    async insertToCollection() {
        this.collectionId = uuid()
        console.log(this.userId, this.gameId)
        await pool
            .execute('insert into `mh_users_games` (`collectionId`,`userId`, `gameId`) values (:collectionId, :userId, :gameId)', this
            );
        return console.log(this.collectionId);
    }
    static async findAllUsers(name: string): Promise<SimpleUsersEntity[] >{
        const [results] = await pool.execute('select * from `mh_users` where `userName` like :search', { search: `%${name }%`,}) as GameCollectionRecordResults;

        return results.map(result => {
            const { userId } = result;
            return { userId};
        })
    }
    static async findUserGames(userId: string): Promise<CollectionEntity[]> {

        const [results] = await pool.execute('select * from `mh_users_games` where `userId` like :search', { search: `%${userId}%`,}) as GameCollectionRecordResults;

        return results.map(result => {
            const { userId, gameId } = result;
            return { userId, gameId};
        })
    }
}
