import { EntityManager } from '@mikro-orm/postgresql';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Task } from 'src/entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from 'src/entities/user.entity';
import { TaskStatus } from 'src/enums/task-status.enum';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksController } from './tasks.controller';
import { TaskResponseDto } from './dto/task-response.dto';

@Injectable()
export class TasksService {
    constructor(private readonly em: EntityManager){}

    // 조회
    async findAll(userId: string): Promise<TaskResponseDto[]> {
        const tasks = await this.em.find(
            Task,
            {creator: {id: userId}},
            {populate: ['creator']}
        )

        return tasks.map(task => this.toTaskResponseDto(task));
    }

    // 생성
    async create(
        createTaskDto: CreateTaskDto, 
        user: User
    ): Promise<TaskResponseDto> {
        // task 생성 및 저장
        const task = new Task(
            createTaskDto.title, 
            user, 
            createTaskDto.status ?? TaskStatus.TODO, 
            createTaskDto.position ?? 0
        );

        this.em.persist(task);
        await this.em.flush();

        return this.toTaskResponseDto(task);
    } 

    // 수정
    async update(
        id: string,
        updateTaskDto: UpdateTaskDto,
        user: User
    ): Promise<TaskResponseDto> {
        const task = await this.em.findOne(
            Task, 
            {id}, 
            {populate: ['creator']}
        );

        if(!task){
            throw new NotFoundException('일감을 찾을 수 없습니다.'); // 404 에러 
        }

        // 본인이 생성한 일감만 수정 가능(권한 체크)
        if(task.creator.id !== user.id){    
            throw new ForbiddenException('권한이 없습니다. 본인의 일감만 수정할 수 있습니다.'); // 403 에러 
        }

        // 수정
        if(updateTaskDto.title) task.title = updateTaskDto.title;
        if(updateTaskDto.status) task.status = updateTaskDto.status;
        if(updateTaskDto.position !== undefined) task.position = updateTaskDto.position;

        await this.em.flush();

        return this.toTaskResponseDto(task);

    }

    // 삭제 
    async delete(id: string, userId: string): Promise<void> {
        const task = await this.em.findOne(Task, {id}, {populate: ['creator']} )

        if(!task){
            throw new NotFoundException('일감을 찾을 수 없습니다.')
        }

        // 본인의 일감만 삭제 가능(권한 체크)
        if (task.creator.id !== userId) {
            throw new ForbiddenException('권한이 없습니다. 본인의 일감만 삭제할 수 있습니다.');
        }

        this.em.remove(task);
        await this.em.flush();
    }

    private toTaskResponseDto(task: Task): TaskResponseDto {
        const user = task.creator;

        return {
            id: task.id,
            title: task.title,
            status: task.status,
            position: task.position,
            version: task.version,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
            creator: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        }
    }
}

