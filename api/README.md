# ffxi-crafting-api

## Running with Docker in the Monorepo

-   In order for this application to communicate with MySQL from its container, set `MYSQL_HOST=host.docker.internal`. Otherwise, all `MYSQL_` variables should match what is found in the root `.env`.
-   Make sure `PORT` in this project's `.env` matches the `API_PORT` in the root `.env`.
-   Replace the port in `ACCESS_CONTROL_ALLOW_ORIGIN` (e.g., `localhost:<port>`) to the port configured for the APP in `APP_PORT`.

## Migrations

Migrations are managed by [Sequelize](https://sequelize.org/docs/v6/other-topics/migrations/).

Set `MYSQL_HOST=localhost` when running migrations or seeds.

### Create a migration

`npx sequelize-cli migration:generate --name migration-example`

### Run migrations

`npm run migrate-up|migrate-down [-- --env test]`

## Seeds

`npm run seed`

`npm run seed:undo`
