import { Migration } from '@mikro-orm/migrations';

export class Migration20260129173946 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "name" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "task" ("id" varchar(255) not null, "title" varchar(255) not null, "status" text check ("status" in ('TODO', 'IN_PROGRESS', 'DONE')) not null default 'TODO', "creator_id" varchar(255) not null, "position" int not null default 0, "version" int not null default 1, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "task_pkey" primary key ("id"));`);

    this.addSql(`alter table "task" add constraint "task_creator_id_foreign" foreign key ("creator_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "task" drop constraint "task_creator_id_foreign";`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "task" cascade;`);
  }

}
