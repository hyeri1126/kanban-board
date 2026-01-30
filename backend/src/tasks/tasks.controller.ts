import { Controller, UseGuards, Get, Post, Body, Patch, Param, Request, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService){}

    // GET /tasks - 조회
    @Get()
    async findAll(@Request() req): Promise<TaskResponseDto[]>{
        return this.tasksService.findAll(req.user.id);
    }


    // POST /tasks - 생성
    @Post()
    @HttpCode(HttpStatus.OK)
    async create(
        @Body() createTaskDto: CreateTaskDto,
        @Request() req,
    ): Promise<TaskResponseDto> {
        return this.tasksService.create(createTaskDto, req.user);
    }

    // PATCH /tasks/:id - 수정 
    @Patch(':id')
    async update(
        @Param('id') id:string,
        @Body() updateTaskDto: UpdateTaskDto,
        @Request() req,
    ): Promise<TaskResponseDto> {
        return this.tasksService.update(id,updateTaskDto, req.user)
    }

    // DELETE /tasks/:id - 삭제 
    @Delete(':id')
    async delete(
        @Param('id') id:string,
        @Request() req,
    ): Promise<{message: string}> {
        await this.tasksService.delete(id, req.user.id)
        return {message: '일감이 삭제되었습니다.'}
    }

}
