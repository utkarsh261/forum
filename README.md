Forum-api
===
REST API for a simple Discussion Board/Forum made with deno.

Getting Started
===
Prerequisites:
* [Deno](https://deno.land/)
* [PostgreSQL Server](https://www.postgresql.org/)

installed in the local development environment.

After cloning the repository,

1. Create a new Postgres Database, suppose you name it *'unicorn_forum'*, 
2. In the database unicorn_forum, execute the following 2 queries,
```sql
CREATE TABLE if not exists topics (
	id serial primary key,
	uid Varchar(255) NOT NULL,
	name Varchar(255) NOT NULL,
	content Varchar(1000) NOT NULL
);
```
```sql
CREATE TABLE if not exists comments (
	id serial NOT NULL,
	uid varchar(255) NOT NULL,
	content Varchar(1000) NOT NULL,
        parent Varchar(255) NOT NULL
);
```
3. Create a config.yaml file in the /config directory,
4. Add the following snippet to the newly created file
```yaml
database:
  postgres:
    hostname: "localhost"
    port: 5432
    user: "<username('postgres' by default)>" 
    database: "unicorn_forum"
    password: "<Your Local Database Password>"
    applicationName: "forum"
```
5. Run the following command
```bash
deno run --allow-net --unstable --allow-read server.ts
```
`--unstable` flag is used because fs module is currently [unstable](https://deno.land/std/fs#usage).

6. Visit [localhost:8000/api/v1/topics/](http://localhost:8000/api/v1/topics/)

---
[[Deno Land](https://deno.land/)]
