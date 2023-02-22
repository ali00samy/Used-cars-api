import { Body,
    Controller, 
    Post, 
    Get, 
    Param, 
    Query,
    Delete, 
    Patch, 
    NotFoundException,
    Session,
    UseGuards} from '@nestjs/common';
import { CreateUserDto } from './DTOs/create-users.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UpdateUserDto } from './DTOs/update-users.dto';
import { CurrentUser } from './decorators/current-user-decorator';
import { Serialize} from '../interceptors/serialize.interceptor'
import { UserDTO } from './DTOs/user.dto';
import { User } from './users.entity';
import { AuthGuard } from '../guards/auth-guards';

@Controller('auth')
@Serialize(UserDTO)
export class UsersController {
    constructor(
        private userService : UsersService,
        private authService : AuthService
        ) {}

    @Post('signup')
    async createUser(@Body() body : CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    };

    // @Get('whoami')
    // whoAmI(@Session() session: any) {
    //     return this.userService.findOne(session.userId);
    // }

    @Get('whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Post('signin')
    async signin(@Body() body : CreateUserDto,  @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }

    @Get('/:id')
    async findUser(@Param('id') id: string) {
        const user = await this.userService.findOne(parseInt(id));
        if (!user) {
            throw new NotFoundException('user not found');
        }
        return user;
    };

    @UseGuards(AuthGuard)
    @Get()
    findAll() {
        return this.userService.findAll();
    };

    @Get()
    findAllusers(@Query('email') email: string) {
        return this.userService.find(email);
    };

    @Delete('/:id')
    deleteUser(@Param('id') id: string){
        return this.userService.remove(parseInt(id));
    };

    @Patch('/:id')
    updateUser(@Param('id') id: string ,@Body() body : UpdateUserDto) {
        this.userService.update(parseInt(id),body);
    }
}
