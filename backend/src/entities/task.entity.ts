import { Entity, PrimaryKey, Property, ManyToOne, Enum } from "@mikro-orm/core";
import { v4 } from "uuid";
import { User } from "./user.entity";
import { TaskStatus } from "src/enums/task-status.enum";

@Entity()
export class Task {
    @PrimaryKey()
    id: string = v4();

    @Property()
    title: string;

    @Enum(() => TaskStatus)
    status: TaskStatus = TaskStatus.TODO;

    @ManyToOne(() => User)
    creator: User;

    @Property()
    position: number = 0;

    @Property()
    version: number = 1;

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();

    constructor(title: string, creator: User, status: TaskStatus = TaskStatus.TODO, position: number = 0) {
        this.title = title;
        this.creator = creator;
        this.status = status;
        this.position = position;
    }


}