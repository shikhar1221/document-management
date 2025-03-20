import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from './repositories/user.repository';
import { TokenRepository } from './repositories/token.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from './entities/user.entity';
import { Role } from './roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.userRepository.createUser({
      ...registerDto,
      password: hashedPassword,
      roles: registerDto.roles as Role[],
    });
    return user;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      const payload = { email: user.email, sub: user.id, roles: user.roles };
      console.log('payload: ', payload);
      const accessToken = this.jwtService.sign(payload);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration
      await this.tokenRepository.createToken(accessToken, user, expiresAt);
      return { accessToken };
    }
    throw new Error('Invalid credentials');
  }

  async logout(token: string): Promise<void> {
    const decodedToken = this.jwtService.decode(token) as any;
    const user = await this.userRepository.findOneById(decodedToken.sub);
    if (user) {
      await this.tokenRepository.invalidateToken(token);
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return !(await this.tokenRepository.isTokenValid(token));
  }
}