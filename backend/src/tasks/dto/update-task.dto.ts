import { IsOptional, IsString, IsEnum, IsNumber } from "class-validator";
import { TaskStatus } from "src/enums/task-status.enum";

export class UpdateTaskDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsEnum(TaskStatus, {message: '상태는 TODO, IN_PROGRESS, DONE 중 하나여야 합니다.'})
    @IsOptional()
    status?: TaskStatus;

    @IsNumber()
    @IsOptional()
    position?: number;
}