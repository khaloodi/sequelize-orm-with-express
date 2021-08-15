# Overview
Many development tools have what's called a CLI, or command-line interface, which is a special piece of software that's used to aid in the development process. Sequelize is no different, it has a useful command-line interface for initializing and bootstrapping your database project, creating models, database configuration files and more. The CLI operates with many relational databases like PostgreSQL, MySQL, MSSQL, and Sqlite.

## Install Sequelize CLI and Initialize a Database Project
In your Terminal (or console app), run the command:

`$ npm install sequelize-cli@^5.5.1`
Most CLIs have a help command to provide more information about its set of commands and help you find which command to use if you're stuck. You can run the sequelize CLI with:

`$ npx sequelize --help`
This brings up all the commands you're able to run using the CLI. Start by using the init command to initialize the database project.

Make sure that you're in the project’s base root directory, and run the command:

`$ npx sequelize init`

If you're not familiar with the npx command, it's an npm utility that makes it easier to interact with CLIs and run packages, as well as install and manage npm dependencies. You can read more about npx in the "Resources" section of this instruction step.
Running npx sequelize init initializes all the configuration code, folders and helpers needed for the application. It sets up four directories: config, migrations, models, and seeders.

**Note:** The seeders folder usually contains "seed files", which hold data you can use to populate your database tables with sample or test data. You will not create or use seed files in this workshop, so feel free to delete the seeders folder.
## Configuration
The config folder, which contains a file named config.json. This file holds the database configurations for the three main environments you need in an application:

Development: For when you're programming your app
Testing: For running automated tests to make sure your code interacts correctly with the database
Production: For the live site using the "actual data" your application needs

```JavaScript
{
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  }
}
```

By default, config.json is configured with boilerplate credentials for a MySQL database. But the project might use other relational databases -- in this case, SQLite.

You can specify the options shown in the examples in your config.json file for each of the three environments. Ideally, in development, you use the same database you use in production. But it's not uncommon to use different databases. For instance, you might use SQLite in development and testing so that you don’t need to install and run a large database on your computer, and use [PostgreSQL](https://www.postgresql.org/) for a more powerful Linux server in production.

```JavaScript
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'movies.db'
});
```

The Sequelize CLI sets up configuration for you in `'config.json'`. For example, the dialect property specifies the version of SQL you're using (the SQL dialect of the database) for each environment. Since SQLite is a file-based database that doesn't require username and password credentials or a host, you use the storage key to specify the file path or the storage path for SQLite.

For example, the value `'development.db'` creates a database named 'development'.