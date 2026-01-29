import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from "class-validator";

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, {message: '비밀번호는 최소 6자 이상이어야 합니다.'})
    @Matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
        {
            message: '비밀번호는 영문, 숫자, 특수문자를 모두 포함해야 합니다.'
        },
    )
    password: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}