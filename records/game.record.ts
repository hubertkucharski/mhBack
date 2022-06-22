// import {AdEntity, NewAdEntity, SimpleAdEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from "uuid";
import {GameEntity, NewGameEntity} from "../types/GameEntity";


type GameRecordResults = [GameEntity[], FieldPacket[]];

export class GameRecord implements GameEntity {
    public gameId: string;
    public gameName: string;
    public gameBggID: number;
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
        this.gameBggID = obj.gameBggID;
        this.image = obj.image;
        this.thumbnail = obj.thumbnail;
        this.yearPublished = obj.yearPublished;
        this.averageRating = obj.averageRating;
        this.rank = obj.rank;
    }

//
    static async getOne(id: string): Promise<GameRecord | null> {

        // await pool.execute('update `ads` set `clicksCounter` = `clicksCounter` + 1 where `id` = :id', {
        //     id,
        // });
        const [results] = await pool.execute('select * from `mh_games` where `gameId` = :id', {
            id,
        }) as GameRecordResults;

        return results.length === 0 ? null : new GameRecord(results[0])
    }
    // // static async listAll(): Promise<AdRecord[]> {
    // //     const [results] = await pool.execute('select * from `ads`') as AdRecordResults;
    // //     return results.map((obj) => new AdRecord(obj));
    // // }
    // //powyżej zbędne pod dodaniu funkcji findAll z wyszukaniem LIKE
    // static async findAll(name: string): Promise<SimpleAdEntity[]>{
    //     const [results] = await pool.execute('select * from `ads` where `name` like :search', { search: `%${name }%`,}) as AdRecordResults;
    //
    //     return results.map(result => {
    //         const {id, lat, lon, clicksCounter} = result;
    //         return { id, lat, lon, clicksCounter };
    //     })
    // }
    async insert() {
        if (!this.gameId) {
            this.gameId = uuid()
        } else throw new Error('Cannot insert something that is alredy inserted.')
        await pool
            .execute('insert into `mh_games` (`gameId`,`gameBggID`, `gameName`, `image`,`thumbnail`, `yearPublished`, `averageRating`, `rank`) values (:gameId, :gameBggID, :gameName, :image, :thumbnail, :yearPublished, :averageRating, :rank)', this

            );
        return this.gameId;
    }
}
