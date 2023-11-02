# ffxi-crafting-api

## Docker

In order for this application to communicate with MySQL in Docker for development, make sure the following ENV variable is set before running `make compose-up`:

`MYSQL_HOST=host.docker.internal`

## Migrations

Migrations are managed by [Sequelize](https://sequelize.org/docs/v6/other-topics/migrations/).

`MYSQL_HOST=localhost`

`npm run migrate-up|migrate-down`
