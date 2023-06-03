import { Migration } from '@mikro-orm/migrations';

export class Migration20230601011352 extends Migration {
  async up(): Promise<void> {
    this.addSql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    this.addSql(
      'create table "users" ("uuid" uuid not null default uuid_generate_v4(), "email" varchar(255) not null, "removed" bigint not null default 0, "removed_at" timestamptz(0) null, "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "id" serial not null, "fullname" text null, "role" text check ("role" in (\'ADMIN\', \'MANAGEMENT\', \'USER\')) not null default \'USER\', constraint "users_pkey" primary key ("uuid", "email"), constraint users_email_check check (email = LOWER(email) AND LENGTH(TRIM(email)) > 0));',
    );
    this.addSql(
      'alter table "users" add constraint "users_email_removed_unique" unique ("email", "removed");',
    );

    this.addSql(
      'create table "notes" ("id" serial primary key, "removed" bigint not null default 0, "removed_at" timestamptz(0) null, "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "user_uuid" uuid null, "user_email" varchar(255) null, "message" text null);',
    );
    this.addSql(
      'alter table "notes" add constraint "notes_user_uuid_user_email_unique" unique ("user_uuid", "user_email");',
    );

    this.addSql(
      'alter table "notes" add constraint "notes_user_uuid_user_email_foreign" foreign key ("user_uuid", "user_email") references "users" ("uuid", "email") on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "notes" drop constraint "notes_user_uuid_user_email_foreign";',
    );

    this.addSql('drop table if exists "users" cascade;');

    this.addSql('drop table if exists "notes" cascade;');
  }
}
