import {Controller, Get, Inject, Param} from '@nestjs/common';
import {BggGamesService} from "./bgg-games.service";

@Controller('bgg-games')
export class BggGamesController {
    constructor(@Inject(BggGamesService) private bggGamesService: BggGamesService){}

    @Get('/find-by-id/:id')
    async findGameById(@Param('id') id: string) {
        return this.bggGamesService.findGameById(id);
    }
    @Get('/find-by-bggid/:bggid')
    async findGameByBggId(@Param('bggid') bggid: number) {
        return this.bggGamesService.findGameByBggId(bggid);
    }
    @Get('/find-by-name/:name')
    async findGameByName(@Param('name') name: string) {
        // console.log(name)
        return this.bggGamesService.findGameByName(name);
    }
    @Get('/find-by-name/')
    noNameEntered(){
        return [];
    }
}
