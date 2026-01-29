import { Entity, PrimaryKey, Property, Collection, OneToMany } from "@mikro-orm/core";
import { v4 } from "uuid";
import { Task } from "./task.entity";


@Entity()
export class User {
    @PrimaryKey()
    id: string = v4();

    @Property({unique:true})
    email: string;

    @Property()
    password: string;

    @Property()
    name: string;

    @OneToMany(() => Task, (task) => task.creator)
    tasks = new Collection<Task>(this);

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date()})
    updatedAt: Date = new Date();

    constructor(email: string, password: string, name: string){
        this.email = email;
        this.password = password;
        this.name = name;
    }
}