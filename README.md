# Mobietrain's Tech Challenge for Backend

This tech exercise will challenge your NodeJS skills, as well as your flexibility and adaptability to new technologies. This exercise is not the typical challenge in which you read a statement and build everything from the ground-up. Instead, you'll be given a starting point with specific technologies you should use throughout the development of your submission.

<details>
  <summary>Tech info</summary>

  ### Prerequisites

  - Node 12 or higher.
  - Docker
  - Docker Compose
  - MySQL 5.7
  - We recommend VS Code with the REST Client plugin to use the documentation provided.

  ### Installation

  Fork this repository into your GitHub workspace and work from there.

  ### Compiling

  ```bash
  npm run build
  ```

  ### Running

  ```bash
  # development
  docker-compose up db
  npm run local # keep in mind that the env vars are in .env.dev
  ```
</details>


## Challenge Statement

You'll work on a backend to support a movie gallery web application. This application should allow its users to view and manage movies, actors, and genres, as well as generate some reports to compare and rank actors.

To get you started, you'll find an already developed plugin: `/genres`.

*Note: All the database migrations needed should follow the [Knex Migrations](http://knexjs.org/#Migrations) and can be found in `./src/db/migrations`*

## Issues

### 1. Add Movie CRUD

As a user, I want to view and manage movies.

Movie payload:

```ts
{
  id: number,
  slug: string,
  name: string,
  synopsis?: string
  releasedAt: Date,
  runtime: number, // minutes
}
```

### 2. Add Actor CRUD

As a user, I want to view and manage actors.

Actor payload:

```ts
{
  id: number,
  name: string,
  bio: string
  bornAt: Date,
}
```

### 3. Add Genre CRUD

Already implemented

Genre payload:

```ts
{
  id: number,
  slug: string
  name: string,
}
```

### 4. View Actor's movie appearances

As a user, I want to get a list of movies that a given Actor starred on.

### 5. Select one of the following

### 5.a View Actor's favorite genre

As a user, I want to get the favorite genre of a given Actor.

Business Rule: the favorite genre is the one with the most appearances.

### 5.b View Actor's number of Movies in Genres

As a user, I want to get the number of movies by genre on an actor profile page.

### 5.c View Actors in a Genre

As a user, I want to get a list of actors for a given Genre ordered by movie appearances.

### 6. View Actor's character names

As a user, I want to get a list of character names of a given Actor.

## Submitting

You should submit the Fork link.