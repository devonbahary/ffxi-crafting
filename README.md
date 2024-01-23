# ffxi-crafting

## READMEs

-   [API](/api/README.md)
-   [React App](/ffxi-crafting-app/README.md)

## Docker

The `Makefile` offers 3 commands:

-   `make compose-up`: creates and starts containers for development with watch files
-   `make compose-up-prod`: creates and starts containers for production
-   `make compose-down`: stops and removes containers

## Development

`make compose-up` will get all the services running. While Docker volumes are configured in development to watch file changes, you'll have to rerun this command to update containers with changes to `package.json`.

## Production (Heroku)

Docker is not used in production.

Check the `Procfile` to see the commands available to `heroku run ...`.

## Format

Prettier is configured to format files for all applications in this repo:

`npm run format`
