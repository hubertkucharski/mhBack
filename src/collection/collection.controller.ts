import {Controller, Get, Inject, Param} from '@nestjs/common';
import {CollectionService} from "./collection.service";

@Controller('collection')
export class CollectionController {
    constructor(@Inject(CollectionService) private collectionService: CollectionService) {}

    @Get('/:id')
    async findUserGames(@Param('id') id: string) {
        return this.collectionService.findUserGames(id);
    }
}
