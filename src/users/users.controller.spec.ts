import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService : Partial<UsersService>;
  let fakeAuthService : Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      find:(email: string) => {
        return Promise.resolve([{ id: 1, email, password: '1234' }]);
      },
      findOne: (id : number) => {
        return Promise.resolve({ id, email: 'ali22@ss.com', password: '1234' });
      },
      // remove: () => {

      // },
      // update: (id, attrs) => {
        
      // },
    };

    fakeAuthService = {
      // signup: (email, password) => {
        
      // },
      // signin: (email, password) => {
        
      // }
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers : [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService 
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
