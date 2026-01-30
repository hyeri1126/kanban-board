import { TaskStatus } from "src/enums/task-status.enum";

export class TaskResponseDto {
    id: string;
    title: string;
    status: TaskStatus;
    creator: {
        id: string;
        name: string;
        email: string;
    };
    position: number;
    version: number;
    createdAt: Date;
    updatedAt: Date;
}