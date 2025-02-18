import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';

@Module({
  imports: [JwtModule, PassportModule],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
})
export class UserModule {}
