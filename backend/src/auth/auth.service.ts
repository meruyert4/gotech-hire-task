import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findOneByUsername(
      createUserDto.username,
    );
    if (existingUser) {
      throw new UnauthorizedException('Username already exists');
    }
    const user = await this.usersService.create(createUserDto);
    const payload = { username: user.username, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
      userId: user.id,
    };
  }

  async login(createUserDto: CreateUserDto) {
    const user = await this.usersService.findOneByUsername(
      createUserDto.username,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(
      createUserDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
      userId: user.id,
    };
  }
}
