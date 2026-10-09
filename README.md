# MERN Todo API

This repository contains the **backend** for a todo application. It is a REST API built with Node.js, Express, TypeScript, and MongoDB (through Mongoose). The API currently provides create, read, update, and delete operations for todos.

This guide is intended to help a developer new to the project get it running, understand how a request is handled, and see what has and has not been implemented yet.

## Technology

- Node.js with ES modules
- Express 5 for HTTP routing and middleware
- TypeScript for application code
- MongoDB with Mongoose models
- dotenv for loading environment variables from `.env`
- cors for browser-client access

## Project structure

```text
src/
├── app.ts                     # Application setup, middleware, MongoDB connection, server start
├── controllers/
│   └── todoController.ts      # Todo request handlers and database operations
├── middleware/
│   └── errorHandler.ts        # Converts application and Mongoose errors into HTTP responses
├── models/
│   ├── Todo.ts                # Todo schema and TypeScript interface
│   └── User.ts                # User schema, password hashing, and password comparison
├── routes/
│   └── todos.ts               # Maps HTTP methods and paths to todo controller handlers
└── utils/
    ├── AppError.ts            # Application error with an HTTP status code
    └── config.ts              # Reads application settings from environment variables
```

At a high level, a request goes through Express middleware in `src/app.ts`, is matched by a router, and is handled by a controller. Controllers read or write MongoDB documents through Mongoose models. Errors are passed to the shared error middleware, which returns a JSON response.

## Getting started

### Requirements

- Node.js and npm
- A MongoDB instance, local or hosted

### Install and configure

1. Install the project dependencies:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env` and set values for your environment. For example:

   ```dotenv
   MONGO_URI=mongodb://127.0.0.1:27017/mern-todo
   PORT=3000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

   `MONGO_URI` must point to a reachable MongoDB database. `CLIENT_URL` is passed to the CORS middleware as the allowed browser origin; the current app configuration uses a single origin value.

3. Start the development server:

   ```sh
   npm run dev
   ```

   The development script runs `src/app.ts` with `tsx` and watches for changes. The API is available at `http://localhost:3000` when `PORT=3000`.

### Build and run

```sh
npm run build
npm start
```

The build compiles TypeScript from `src/` into `dist/`. The start script runs `dist/app.js`, so build first after making source changes.

## API

All current endpoints are mounted under `/todos`. Request and response bodies use JSON.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/todos` | List todos; supports filters, search, sorting, and pagination |
| `POST` | `/todos` | Create a todo |
| `GET` | `/todos/:id` | Get one todo by MongoDB ID |
| `PUT` | `/todos/:id` | Update a todo by MongoDB ID |
| `DELETE` | `/todos/:id` | Delete a todo by MongoDB ID |

### List todos

`GET /todos` accepts these optional query parameters:

| Parameter | Behavior |
| --- | --- |
| `completed` | Filter by completion status (`true` or `false`) |
| `priority` | Filter by priority (`low`, `medium`, or `high`) |
| `search` | Case-insensitive match against the title |
| `page` | Page number; defaults to `1` |
| `limit` | Items per page; defaults to `10` |
| `sortBy` | Document field to sort by; defaults to `createdAt` |
| `order` | Use `asc` for ascending order; otherwise order is descending |

Example:

```http
GET /todos?completed=false&priority=high&search=report&page=1&limit=10
```

A successful list response includes `data` (the todo documents), `total` (matching document count), `page`, and `totalPages`.

### Create a todo

Send `title` and optionally `priority`:

```http
POST /todos
Content-Type: application/json

{
  "title": "Review the API",
  "priority": "medium"
}
```

Todo titles are required and must be at least 3 characters. Priority can be `low`, `medium`, or `high` and defaults to `low`. `completed` defaults to `false`; Mongoose also adds `createdAt` and `updatedAt` timestamps.

### Update and delete

Use the MongoDB document ID in `:id`. `PUT /todos/:id` accepts fields to update in the JSON body and runs schema validation. `DELETE /todos/:id` removes the matching document.

Successful create, read, and update responses include the document under `data`. Requests for a well-formed ID with no matching todo return a not-found response. Invalid MongoDB ID formats and schema validation errors are handled by the shared error middleware.

## Data models

### Todo

`src/models/Todo.ts` defines the active API model:

- `title`: required string, trimmed, at least 3 characters
- `completed`: boolean, defaults to `false`
- `priority`: `low`, `medium`, or `high`, defaults to `low`
- `createdAt` and `updatedAt`: managed by Mongoose timestamps

### User

`src/models/User.ts` defines a user document with a name, normalized unique email, and password. The password is excluded from normal query results and hashed before saving; the model also provides a password comparison method.

**The current API does not yet expose user registration, login, authentication middleware, or JWT-protected todo routes.** `JWT_SECRET` and `JWT_EXPIRES_IN` appear in `.env.example`, but they are not currently read by `src/utils/config.ts` or used by the application. Treat user/authentication support as unfinished rather than an available feature.

Todo documents also do not currently have an owner/user field, and the todo routes do not require authentication. As implemented, todos are not separated by user.

## Helpful starting points for a new developer

1. Start with `src/app.ts` to see how configuration, CORS, JSON parsing, logging, MongoDB, routes, and error handling are connected.
2. Follow `src/routes/todos.ts` into `src/controllers/todoController.ts` to trace each API endpoint.
3. Read `src/models/Todo.ts` for the persisted todo fields and validation rules.
4. Read `src/middleware/errorHandler.ts` and `src/utils/AppError.ts` to understand API error responses.
5. If picking up authentication work, inspect `src/models/User.ts` and then confirm the intended registration/login flow before adding routes, token handling, and authorization.

## Current project notes

- The server connects to MongoDB when the application starts and logs connection success or failure.
- There is no health-check endpoint or automated test script currently defined in `package.json`.
- Keep secrets in the local `.env` file; do not commit it. Use `.env.example` as the template for required settings.
- When adding an endpoint, keep route declarations in `src/routes/`, request/database logic in controllers, and persistence rules in models. Pass controller errors to `next(error)` so the shared error handler can respond consistently.
