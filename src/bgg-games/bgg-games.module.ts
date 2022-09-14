import { Module } from '@nestjs/common';
import { BggGamesService } from './bgg-games.service';
import { BggGamesController } from './bgg-games.controller';

@Module({
  providers: [BggGamesService],
  controllers: [BggGamesController]
})
export class BggGamesModule {}
