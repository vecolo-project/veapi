<h1 align="center">API Vécolo</h1>

<br />


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

### Tests

- Run unit tests using `npm run test` (for Windows users) or `npm run test:unix` (for Mac and Linux users).

### Running the app in development

- Run `npm run dev` to start nodemon with ts-node.
- The server base endpoint will be `http://127.0.0.1:3000` where `3000` is the PORT variable you set in the `.env` file.

### Building and running the app in production

- Run `npm run build` to compile all the Typescript sources and generate JavaScript files.
- To start the built app located in `build` use `npm start`.

### Running BDD scripts

- Run `npm run generate-migration` for create a new migration named newMigration
- Run `npm run migrate` for update database to the last migration

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

## License

[MIT](/LICENSE)

## Based on boilerplate

<sub>Made with ❤️ by <a href="https://github.com/bymi15">Brian Min</a></sub>