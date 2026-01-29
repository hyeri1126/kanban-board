import { EntityManager } from '@mikro-orm/postgresql';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { use } from 'passport';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly em: EntityManager,
        private readonly jwtService: JwtService,
    ){}

    // 회원가입
    async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
        const { email, password, name } = registerDto;

        // 이메일 중복 확인
        const existingUser = await this.em.findOne(User, { email });
        if(existingUser){
            throw new ConflictException('이미 존재하는 이메일입니다.'); // 409 에러
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User(email, hashedPassword, name);

        //  DB에 저장
        this.em.persist(user);
        await this.em.flush();

        // JWT 토큰 생성
        const accessToken = this.generateToken(user);

        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        }
    }

    // 로그인
    async login(loginDto: LoginDto): Promise<AuthResponseDto> {
        const {email, password} = loginDto;

        // 사용자 찾기 
        const user = await this.em.findOne(User, {email});
        if(!user){
            throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.'); // 40 에러 
        }

        const accessToken = this.generateToken(user);

        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,        
            },
        }
    }

    // JWT 토큰 생성
    private generateToken(user: User): string {
        const payload = {
            sub: user.id,  
            enmail: user.email
        };
        return this.jwtService.sign(payload);
    }
}
