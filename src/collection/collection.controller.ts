import {Body, Controller, Delete, Get, Inject, Param, Post, Req, UseGuards} from '@nestjs/common';
import { CollectionService } from './collection.service';
import {UserAuthGuard} from "../auth/auth-guards/user-auth.guard";
import {User} from "../user/user.entity";

@Controller('collection')
export class CollectionController {
  constructor(
    @Inject(CollectionService) private collectionService: CollectionService,
  ) {}

  @Get('/:id')
  async findUserGames(@Param('id') id: string) {
    return this.collectionService.findUserGames(id);
  }

  @Post('/add')
  @UseGuards(UserAuthGuard)
  async addGameToCollection(
    @Req() { user }: { user: User },
    @Body() { gameId }: { gameId: string },
  ): Promise<{ statusCode: number; message: string }> {
    console.log(user);
    return this.collectionService.addGameToCollection(gameId, user.userId);
  }
  @Delete('/remove')
  @UseGuards(UserAuthGuard)
  async removeGameToCollection(
      @Req() { user }: { user: User },
      @Body() { gameId}: { gameId: string },
  ): Promise<{ statusCode: number; message: string }> {
    return this.collectionService.removeGameFromCollection(gameId, user.userId);
  }
}
