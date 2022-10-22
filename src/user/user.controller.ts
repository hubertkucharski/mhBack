import {Controller, Get, Inject, Param} from '@nestjs/common';
import {UserService} from "./user.service";

@Controller('user')
export class UserController {
    constructor(@Inject(UserService) private userService: UserService) {
    }
    @Get('/')
    async findAllUsers() {
        return this.userService.findAllUsers();
    }
    @Get('/:id')
    async findUser(@Param('id') id: string) {
        return this.userService.findUser(id);
    }
}
