# MyTime Backend

## Description

Backend API for mytime written in [Nest](https://github.com/nestjs/nest) framework.

## Prerequisites

- Node.js (LTS version)
- Bun package manager (`curl -fsSL https://bun.sh/install | bash`)
- PostgreSQL 15 or later

## Database Setup

1. Make sure PostgreSQL is running on your system
2. Create a new database:
   ```sql
   CREATE DATABASE mytime;
   ```
3. The default configuration uses:
   - Host: localhost
   - Port: 5432
   - Username: postgres
   - Password: postgres
   - Database: mytime

   If you need to change these, copy `.env.example` to `.env` and update the values.
   
   Use [DBeaver](https://dbeaver.io/) as database management tool.

## Project setup

```bash
# Install dependencies
$ bun install
```

## Compile and run the project

```bash
# development
$ bun run start

# watch mode
$ bun run start:dev

# production mode
$ bun run start:prod
```

## Run tests

```bash
# unit tests
$ bun run test

# e2e tests
$ bun run test:e2e

# test coverage
$ bun run test:cov
```

## Deployment

For deployment instructions, please refer to the main project documentation.
