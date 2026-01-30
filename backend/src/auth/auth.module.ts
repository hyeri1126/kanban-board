import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../entities/user.entity'
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports:[
    MikroOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, 
      signOptions: {expiresIn: '7d'},
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy, // DI 등록
  ],
  exports: [AuthService],
})
export class AuthModule {}
