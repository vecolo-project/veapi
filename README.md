<h1 align="center">VeAPI, staring Express TypeORM REST API</h1>

<!-- toc -->

  * [Syllabus](#syllabus)
  * [Features](#features)
- [Getting Started](#getting-started)
  * [Step 1: Set up the Development Environment](#step-1-set-up-the-development-environment)
  * [Step 2: Create a new project](#step-2-create-a-new-project)
  * [Step 3: Serve your application](#step-3-serve-your-application)
- [Scripts and Tasks](#scripts-and-tasks)
  * [Install](#install)
  * [Linting](#linting)
  * [Running the app in development](#running-the-app-in-development)
  * [Building and running the app in production](#building-and-running-the-app-in-production)
- [API Routes](#api-routes)
- [Project Structure](#project-structure)
- [Logging](#logging)

<!-- tocstop -->

### Syllabus

 [Veapi.pdf](./Veapi.pdf) 

### Features

- **JWT based user authentication** with [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) and [express-jwt](https://github.com/auth0/express-jwt).
- **Dependency Injection** with [TypeDI](https://github.com/typestack/typedi).
- **ORM with support for many databases (MySQL, PostgreSQL, MariaDB, SQLite, MongoDB, and more)** with [TypeORM](https://github.com/typeorm/typeorm).
- **Clear and organised structure** with different layers such as entities, services, middlewares, loaders, etc.
- **Validation** thanks to [class-validator](https://github.com/typestack/class-validator).
- **Unit and Integration Testing** with [Jest](https://jestjs.io/).
- **Security Features** with [Helmet](https://helmetjs.github.io/).
- **Role-based access control** using a custom-built middleware.
- **Simple Data Seeding** with custom-built factories and [Faker.js](https://www.npmjs.com/package/faker).
- **Code generator for entity, service, route, factory, seed, test** with a custom-built generator script and CLI tool [Commander](https://github.com/tj/commander.js/).

## Getting Started

### Step 1: Set up the Development Environment

Install [Node.js and NPM](https://nodejs.org/en/download/)

Install a [MongoDB server](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Step 2: Create a new project

Fork or download this project and modify `package.json` for your new project.

Make a copy of the `.env.example` file and rename it to `.env`.

Create a new database and add the connection string in the `.env` file.

Install the required packages.

```bash
npm install
```

> This installs all the dependencies with NPM.

Now your development environment should be ready to use!

### Step 3: Serve your application

Go to the root directory and start your app with this npm script.

```bash
npm run dev
```

> This starts a local server using `nodemon` and `ts-node`.
> The server base endpoint will be `http://127.0.0.1:3000` where `3000` is the PORT variable you set in the `.env` file.

## Scripts and Tasks

### Install

- Install all dependencies with `npm install`

### Linting

- Run code syntax and format checking using `npm run lint` which runs eslint.
- Automatically fix lint errors with `npm run lint:fix`.

### Running the app in development

- Run `npm run dev` to start nodemon with ts-node.
- The server base endpoint will be `http://127.0.0.1:3000` where `3000` is the PORT variable you set in the `.env` file.

### Building and running the app in production

- Run `npm run build` to compile all the Typescript sources and generate JavaScript files.
- To start the built app located in `build` use `npm start`.

## API Routes

The route prefix is `/api` by default, but you can change this in the .env file.

| Route                   | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| **/api**                | Base endpoint                                            |
| **/api/auth/login**     | Auth - login endpoint                                    |
| **/api/auth/register**  | Auth - register endpoint                                 |
| **/api/user**           | Example entity endpoint - returns all users              |
| **/api/user/current**   | Example entity endpoint - returns current logged in user |
| ...                     | ...                                                      |

## Project Structure

| Name                       | Description                                                  |
| -------------------------- | ------------------------------------------------------------ |
| **database/**              | Local database server data                                   |
| **build/**                 | Compiled source files will be placed here                    |
| **commands/**              | Custom CLI command tools used with npm scripts               |
| **src/**                   | Source files                                                 |
| **src/api/middlewares/**   | Custom middlewares                                           |
| **src/api/entities/**      | TypeORM Entities (Database models)                           |
| **src/api/services/**      | Service layer                                                |
| **src/config/**            | The configuration file which loads env variables             |
| **src/database/factories** | Factories generate entities with mock data                   |
| **src/database/seeds**     | Seeds use factories to save mock data in the database        |
| **src/loaders/**           | Loader is where the app is configured and database is loaded |
| **src/types/** \*.d.ts     | Custom type definitions                                      |
| **test** \*.spec.ts        | Unit and integration tests                                   |
| .env.example               | Environment configurations                                   |
| docker-compose.yml         | docker dev-env configurations                                |

## Logging

For logging we use [winston](https://github.com/winstonjs/winston).
