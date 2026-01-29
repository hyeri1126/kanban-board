import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { User } from "./entities/user.entity";
import { Task } from "./entities/task.entity";

const config: Options = {
    driver: PostgreSqlDriver, 
    entities: [User, Task],
    dbName: process.env.DB_NAME || 'kanban',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER ||'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    debug: process.env.NODE_ENV !== 'production',
    migrations: {
        path: './src/migrations',
    }

}

export default config;