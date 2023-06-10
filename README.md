# Smart-meet-backend Backend App - NodeJS

## Overall App Structure

```
├───app
│   ├───commands
│   ├───contracts
│   ├───errors
│   ├───helpers
│   ├───http
│   │   ├───controllers
│   │   │   └───api
│   │   │       └───v1
│   │   ├───middlewares
│   │   │   └───policies
│   │   └───responses
│   ├───models
│   ├───providers
│   ├───repositories
│   ├───services
│   ├───tasks
│   │   ├───DatabaseNotification
│   │   └───Imports
│   │       └───Student
│   ├───transformers
│   ├───utilities
│   │   ├───AWS
│   │   ├───fcm
│   │   ├───Logger
│   │   ├───mail
│   │   ├───paginator
│   │   └───passport
│   └───validators
├───config
├───database
│   ├───migrations
│   ├───raw-query
│   └───seeders
├───public
│   ├───images
│   └───samples
├───routes
├───storage
│   ├───conversations
│   ├───imports
│   └───logs
├───uploads
│   ├───documents
│   └───images
└───views
    └───emails
        └───auth
```

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.

Your app should now be running on [localhost:3000](http://localhost:3000/). (Port depends upon the values from your env file)

## Sequelize Help

Commands for running sequelize commands:

- Seeder Commands

```
sequelize db:seed --help
sequelize seed:generate --name demo-user
sequelize db:seed --seed=20190109090646-demo-user
sequelize db:seed:all
sequelize db:seed:undo
sequelize db:seed:undo:all
```

- Migration Commands

```
sequelize db:migrate
sequelize db:migrate:undo
sequelize db:migrate:undo:all --to XXXXXXXXXXXXXX-create-posts.js
```
