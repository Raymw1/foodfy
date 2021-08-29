DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

DROP DATABASE IF EXISTS foodfy;
CREATE DATABASE foodfy;

------------- RESET TABLES ---------------- 
-- TRUNCATE chefs RESTART IDENTITY CASCADE;
-- TRUNCATE files RESTART IDENTITY CASCADE;
-- TRUNCATE recipe_files RESTART IDENTITY CASCADE;
-- TRUNCATE recipes RESTART IDENTITY CASCADE;
-- TRUNCATE session RESTART IDENTITY CASCADE;
-- TRUNCATE users RESTART IDENTITY CASCADE;

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "reset_token" text,
  "reset_token_expires" text,
  "is_admin" boolean DEFAULT false,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "chefs" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "avatar" integer
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text NOT NULL
);

CREATE TABLE "recipes" (
    "id" SERIAL NOT NULL,
    "chef_id" integer NOT NULL,
    "title" text NOT NULL,
    "ingredients" text[] NOT NULL,
    "preparation" text[] NOT NULL,
    "information" text NOT NULL,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "user_id" integer
);

CREATE TABLE "recipe_files" (
  "id" SERIAL PRIMARY KEY,
  "recipe_id" integer NOT NULL,
  "file_id" integer NOT NULL
);

------------- FOREIGN KEYS -------------

ALTER TABLE "recipes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");
ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

----------- PROCEDURE -------------

CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

----------- AUTO UPDATED_AT RECIPES -------------
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

------------- AUTO UPDATED_AT USERS -------------
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


------------- SESSION ID -------------
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" 
ADD CONSTRAINT "session_pkey" 
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

------------- CASCADE EFFECT ON DELETE -------------
ALTER TABLE "recipes" DROP CONSTRAINT recipes_user_id_fkey, 
ADD CONSTRAINT recipes_user_id_fkey FOREIGN KEY ("user_id") REFERENCES "users" ("id")
ON DELETE CASCADE;

ALTER TABLE "recipe_files" DROP CONSTRAINT recipe_files_recipe_id_fkey, 
ADD CONSTRAINT recipe_files_recipe_id_fkey FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id")
ON DELETE CASCADE;

ALTER TABLE "recipe_files" DROP CONSTRAINT recipe_files_file_id_fkey, 
ADD CONSTRAINT recipe_files_file_id_fkey FOREIGN KEY ("file_id") REFERENCES "files" ("id")
ON DELETE CASCADE;
