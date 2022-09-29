import { Injectable } from '@nestjs/common';
import {MhGames} from "./bggGames.entity";
import {Like} from "typeorm";

@Injectable()
export class BggGamesService {
    async findGameById(gameId: string): Promise<MhGames | null> {
        return await MhGames.findOneOrFail({ where: { gameId } });
    }
    async findGameByName(name: string): Promise<MhGames[] | null> {
        return await MhGames.find({ where: { gameName: Like(`%${name}%`) } });
    }

    async findGameByBggId(gameBggId: number) {
        return await MhGames.findOneOrFail({ where: { gameBggId } });
    }
}
