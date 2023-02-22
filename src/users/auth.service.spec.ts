import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from "./users.entity";

describe('AuthService', () => {
    let service : AuthService;
    let fakeCopyService : Partial<UsersService>

    beforeEach(async () => {
        const users : User[] = [];
        fakeCopyService = {
            find: (email : string) => {
                const filterdUsers = users.filter((user) => user.email === email);
                return Promise.resolve(filterdUsers);
            },
            creatUser : (email: string, password : string) => {
                const user = { id: Math.floor(Math.random() * 99999), email, password }
                users.push(user);
                return Promise.resolve(user)
            }
        }
    
        const module = await Test.createTestingModule({
            providers: [
                AuthService, {
                    provide: UsersService,
                    useValue: fakeCopyService
                }
            ],
        }).compile();
    
        service = module.get(AuthService);
    }) 
    
    it('can create instance of auth service',async () => {
        expect(service).toBeDefined();
    });

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('ali@ss.com','151500Ali');

        expect(user.password).not.toEqual('151500Ali');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with email that is in use', async () => {
        await service.signup('ali@ss.com', '1234');
        await expect(service.signup('ali@ss.com', '1234')).rejects.toThrow(
        BadRequestException,
        );
    });

    it('throws if signin is called with an unused email', async () => {
        await expect(
          service.signin('ali@ss.com', '1234'),
        ).rejects.toThrow(NotFoundException);
    });

    it('returns a user if correct password is provided',async () => {
        await service.signup('ali@ss.com', '1234');

        const user = await service.signin('ali@ss.com','1234');
        expect(user).toBeDefined();
    })

    it('throws if an invalid password is provided', async () => {
        await service.signup('ali@ss.com','1234');
        await expect(
          service.signin('ali@ss.com', 'password'),
        ).rejects.toThrow(BadRequestException);
      });
});