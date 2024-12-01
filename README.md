# SHORT URL Toolset

> [!WARNING]
> Set up the repository with the proper hooks. Run `pre-commit install` in the root directory of the repository.

## API

| Method | Endpoint | Description | Response | isPublic |
| --- | --- | --- | --- | --- |
| GET | `/{id}` | Redirects to the original URL | Redirect | :o: |
| POST | `/` *Body:* `{ "original": "string" }` | Creates a new short URL | `{ "short": "string", "original": "string" }` | :x: |
| DELETE | `/{id}` | Deletes the short URL | `{ "message": "string" }` | :x: |
| GET | `/search?q={string}` | Returns all short URLs matching the query | `[{ "short": "string", "original": "string", "hits": "number" }]` | :x: |

## Authentication

To authenticate use a signature ssh key. The key must be added to the repository secrets.

## Folder Structure

```sh
.
├── db # SQLite3 schema for short URLs and SSH Auth
├── docs # Documentation for the DB schema
└── src # Source code
```

## Local development

```sh
$ bun install
$ bun dev
```

## Database

To work with the database locally, run `bun run db:start` to start the database locally.

If it's the first time running this script, the `.out` folder won't exist, create it beforehand. Populate the database with the following commands:

```sh
$ bun run db:dump # This will dump the production database to a SQL file
$ bun run db:populate # This will populate the local database with production data
```

To make migrations follow this steps:

```sh
$ bun run db:makemigration # Create a new migration with a schema update
$ bun run db:migrate

# For production
$ bun run db:prod:migrate
$ bun run db:prod:push
```

## :rocket: Deploy

```sh
$ bun run deploy
```
