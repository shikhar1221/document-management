import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterDto): Promise<UserEntity> {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.userService.create({
            ...registerDto,
            password: hashedPassword,
        });
        return user;
    }

    async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
        const user = await this.userService.findByEmail(loginDto.email);
        if (user && (await bcrypt.compare(loginDto.password, user.password))) {
            const payload = { email: user.email, sub: user.id };
            return {
                accessToken: this.jwtService.sign(payload),
            };
        }
        throw new Error('Invalid credentials');
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}