import {forwardRef, Module} from '@nestjs/common';
import { BggGamesService } from './bgg-games.service';
import { BggGamesController } from './bgg-games.controller';
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [forwardRef(() => HttpModule)],
  providers: [BggGamesService],
  controllers: [BggGamesController]
})
export class BggGamesModule {}
