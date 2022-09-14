import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';
import { BggGamesModule } from './bgg-games/bgg-games.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TYPEORM_CONFIG} from "../config/typeOrm.config";
import { CollectionModule } from './collection/collection.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [TypeOrmModule.forRoot(TYPEORM_CONFIG),SearchModule, BggGamesModule, CollectionModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
