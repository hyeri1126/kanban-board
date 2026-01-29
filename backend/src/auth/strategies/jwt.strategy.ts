import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // JWT 토큰을 HTTP 헤더에서 추출
            secretOrKey: process.env.JWT_SECRET as string,
            ignoreExpiration: false, // 만료된 토큰은 거부
        })
    }
    
    // 토큰이 유효할 때 자동으로 호출됨
    async validate(payload: any): Promise<any> {
        const user = await this.authService.findUserById(payload.sub);

        if(!user){
            throw new UnauthorizedException(); // 401 에러 발생
        }

        return user; // 사용자를 찾으면 반환
    }
}