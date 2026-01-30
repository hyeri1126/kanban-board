import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "src/enums/task-status.enum";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty({message: '제목을 입력해주세요.'})
    title: string;

    @IsEnum(TaskStatus, {message: '상태는 TODO, IN_PROGRESS, DONE 중 하나여야 합니다.'})
    @IsOptional()
    status?: TaskStatus; // 없으면 TODO

    @IsNumber()
    @IsOptional()
    position?: number; // 없으면 0
}