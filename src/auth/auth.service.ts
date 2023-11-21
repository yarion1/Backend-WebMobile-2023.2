import { Injectable } from '@nestjs/common';
import 'dotenv';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<User> {

        const user = await this.userService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            user.password = undefined;
            return user;
        }
        return null;
    }

    async login(email: string) {

        const user = await this.userService.findByEmail(email);
        const payload = { username: user.name, _id: user.id };
        return {
            userID: user.id,
            username: user.name,
            access_token: this.jwtService.sign(payload),
        };
    }
}
