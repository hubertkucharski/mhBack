// import {AdEntity, NewAdEntity, SimpleAdEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from "uuid";
import {GameEntity, NewGameEntity, SimpleGameEntity} from "../types/gameEntity";


type GameRecordResults = [GameEntity[], FieldPacket[]];

export class GameRecord implements GameEntity {
    public gameId: string;
    public gameName: string;
    public gameBggId: number;
    public image: string;
    public thumbnail: string;
    public yearPublished: number;
    public averageRating: number;
    public rank: number;

    constructor(obj: NewGameEntity) {
        if(!obj.gameName || obj.gameName.length >100){
            throw new ValidationError('Nazwa ogłoszenia nie może być pusta, ani przekraczać 100 znaków.');
        }

        this.gameId = obj.gameId;
        this.gameName = obj.gameName;
        this.gameBggId = obj.gameBggId;
        this.image = obj.image;
        this.thumbnail = obj.thumbnail;
        this.yearPublished = obj.yearPublished;
        this.averageRating = obj.averageRating;
        this.rank = obj.rank;
    }

//
    static async getOne(id: string): Promise<GameRecord | null> {

        const [results] = await pool.execute('select * from `mh_games` where `gameId` = :id', {
            id,
        }) as GameRecordResults;

        return results.length === 0 ? null : new GameRecord(results[0])
    }

    static async findAll(name: string): Promise<SimpleGameEntity[]>{
        const [results] = await pool.execute('select * from `mh_games` where `gameName` like :search', { search: `%${name }%`,}) as GameRecordResults;

        return results.map(result => {
            const {gameId, gameName} = result;
            return { gameId, gameName };
        })
    }
    async insert() {
        if (!this.gameId) {
            this.gameId = uuid()
        } else throw new Error('Cannot insert something that is alredy inserted.')
        await pool
            .execute('insert into `mh_games` (`gameId`,`gameBggId`, `gameName`, `image`,`thumbnail`, `yearPublished`, `averageRating`, `rank`) values (:gameId, :gameBggId, :gameName, :image, :thumbnail, :yearPublished, :averageRating, :rank)', this

            );
        return this.gameId;
    }
}
