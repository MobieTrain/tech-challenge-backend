# Mobietrain's Tech Challenge for Backend

This exercise will challenge your NodeJS skills. You'll be given a starting point with specific technologies from our stack, which you should use to complete your task.

## Challenge Statement

You'll work on a backend to support a movie gallery web application. This application should allow its users to view and manage movies, actors, and genres, as well as generate some reports to compare and rank actors. To get you started, you'll find an already developed plugin: `/genres` -- *feel free to use as an inspiration, as it is also inspired our current practices*.

## Issues

To complete this challenge, you should implement these following issues:

### MG-0001 Add `Genre` CRUD
*Already implemented*

Genre payload:

```ts
{
  id: number,
  name: string,
}
```

### MG-0002 Add `Movie` CRUD
*Already implemented*

Movie payload:

```ts
{
  id: number,
  name: string,
  synopsis?: string
  releasedAt: Date,
  runtime: number, // minutes
}
```

### MG-0003 Add `Actor` CRUD
*Already implemented*

Actor payload:

```ts
{
  id: number,
  name: string,
  bio: string
  bornAt: Date,
}
```


### MG-0004 View Actor's movie appearances

As a user, I want to get a list of movies that a given Actor starred on.

### MG-0005. Select one of the following:

1. View Actor's favorite genre
As a user, I want to get the favorite genre of a given Actor.
Business Rule: the favorite genre is the one with the most appearances.

2. View Actor's number of Movies in Genres
As a user, I want to get the number of movies by genre on an actor profile page.

3. View Actors in a Genre
As a user, I want to get a list of actors for a given Genre ordered by movie appearances.

### MG-0006. View Actor's character names

As a user, I want to get a list of character names of a given Actor.


## Development notes

### Prerequisites

- Node 12
- Docker
- Docker Compose
- MySql 5.7 (a docker image is already provided)
- We recommend
  - VS Code with the *REST Client* plugin
  - nvm
  - direnv

### Installation

Fork this repository into your GitHub workspace and work from there.

### Development flow
First start a database instance by running `$ docker-compose up db`. After that, you can start the service by running `$ npm run local`. This will start a development HTTP server on port TCP 8080, using the environment variables defined in *.env.dev*. You can develop using TDD with `$ npm run test:tdd`. A linter is configured and can be run as `$ npm run lint`.

*Attention: tests are considered part of code and responsibility of the developer.* Unit tests are provided alongside code, on *spec.ts* files. End to end tests are provided on *docs*. We expect the new code will also contain its own new test cases.

#### New migrations

Example:

`$ knex migrate:make cast -x ts --migrations-directory ./src/db/migrations`

### Changes on database
All changes to the database should be made using [Knex Migrations](http://knexjs.org/#Migrations). There is already one migration in *./src/db/migrations*. To clear the database to its original state, run `$ docker-compose rm db`.

### Building
The solution should successfully build using `$ docker-compose build` and should run using `$ docker-compose up`.

## Submitting

You should submit the Fork link.
