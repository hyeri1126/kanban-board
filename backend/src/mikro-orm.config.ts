import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { User } from "./entities/user.entity";
import { Task } from "./entities/task.entity";

const config: Options = {
    driver: PostgreSqlDriver, 
    entities: [User, Task],
    dbName: 'kanban',
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    debug: true,
    migrations: {
        path: './src/migrations',
    }

}

export default config;