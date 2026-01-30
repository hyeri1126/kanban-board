import { EntityManager } from '@mikro-orm/postgresql';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterResponseDto } from './dto/register-response.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly em: EntityManager,
        private readonly jwtService: JwtService,
    ){}

    // 회원가입
    async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
        const { email, password, name } = registerDto;

        // 이메일 중복 확인
        const existingUser = await this.em.findOne(User, { email });
        if(existingUser){
            throw new ConflictException('이미 존재하는 이메일입니다.'); // 409 에러
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // 사용자 생성 및 저장
        const user = new User(email, hashedPassword, name);
        this.em.persist(user); // 메모리에 등록
        await this.em.flush(); // DB에 저장 

        return { message: '회원가입이 완료되었습니다.' }
    }

    // 로그인
    async login(loginDto: LoginDto): Promise<AuthResponseDto> {
        const {email, password} = loginDto;

        const user = await this.em.findOne(User, {email});
        if(!user){
            throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');  
        }

        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid){
            throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
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
            email: user.email
        };
        return this.jwtService.sign(payload);
    }

    async findUserById(userId: string): Promise<User | null>{
        return this.em.findOne(User, {id: userId});
    }
}
