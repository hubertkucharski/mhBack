import {Body, Controller, Delete, Get, Inject, Param, Post} from '@nestjs/common';
import { CollectionService } from './collection.service';

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
  async addGameToCollection(
    @Body() data: { gameId: string; userId: string },
  ): Promise<{ statusCode: number; message: string }> {
    return this.collectionService.addGameToCollection(data);
  }
  @Delete('/remove')
  async removeGameToCollection(@Body() data: { gameId: string; userId: string },
  ): Promise<{ statusCode: number; message: string }>{
    return this.collectionService.removeGameFromCollection(data);
  }
}
