import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import {BggGamesService} from "../bgg-games/bgg-games.service";

@Module({
  controllers: [CollectionController],
  providers: [CollectionService, BggGamesService]
})
export class CollectionModule {}
