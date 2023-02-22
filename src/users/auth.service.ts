import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { UsersService } from "./users.service";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor (private userService : UsersService) {}

    async signup (email : string , password : string) {
       const user = await this.userService.find(email);
       if (user.length) {
        throw new BadRequestException('email is already used');
       }

       const salt = randomBytes(8).toString('hex');

       const hash = (await scrypt(password, salt , 32)) as Buffer;

       const hashedPass = salt + '.' + hash.toString('hex');

       const newUser = await this.userService.creatUser(email,hashedPass);

       return newUser;
    }

    async signin (email: string, password: string) {
        const [user] = await this.userService.find(email);
        if (!user) {
            throw new NotFoundException('email not found');
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = (await scrypt(password, salt , 32)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('wrong password');
        }

        return user;
    }
}