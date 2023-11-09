# Storefront Backend Project

## Setup Project

### 1. Run `npm install` to install package dependencies

### 2. Setup PostgreSQL & create database user

- Setup PostgreSQL on premise or use PostgreSQL docker
- Create database user & database:


### 3. Create `.env` file

```
PORT=6969

POSTGRES_HOST=localhost
POSTGRES_DB=store_backend_dev
POSTGRES_USER=udacity
POSTGRES_PASSWORD=1

POSTGRES_TEST_DB=store_backend_test

PASSWORD_SECRET=55555555
SALT_ROUND=10

TOKEN_SECRET=55555555
```

### 4. Database migrations

- Update `database.json` file

  ```json
  {
    "dev": {
      "driver": "pg",
      "host": "localhost",
      "database": "store_backend_dev",
      "user": "udacity",
      "password": "1"
    },
    "test": {
      "driver": "pg",
      "host": "localhost",
      "database": "store_backend_test",
      "user": "udacity",
      "password": "1"
    }
  }
  ```

- Update `.env` file if necessary
- Update script `test:prepare` in `package.json` file if using other test database (default: `store_backend_test`)
- Run migrations script

  ```
  db-migrate up
  ```

## Run the project

Open the terminal, run (default host: `localhost:3000`):

```
npm run dev
```

## Run test for the project

Open the terminal, run:

```
npm run test
```

- Note: please make sure setup `.env` file and `database.json` file`

## API Endpoints

### 1. Admin

- [GET] /admins [admin token required]
- [GET] /admins/:id [admin token required]
- [POST] /admins [admin token required]
- [POST] /admins/login

### 2. User

- [GET] /users [admin token required]
- [GET] /users/:id [admin token required]
- [POST] /users [admin token required]
- [DELETE] /users/:id [admin token required]

### 3. Product

- [GET] /products
- [GET] /products/:id
- [POST] /products [admin token required]
- [DELETE] /products/:id [admin token required]

### 4. Order

- [GET] /users/:userId/orders [admin token required]
- [GET] /users/:userId/orders/:id [admin token required]
- [POST] /users/:userId/orders [admin token required]
- [DELETE] /users/:userId/orders/:id [admin token required]
- [POST] /users/:userId/orders/:id/products [admin token required]
- [POST] /users/:userId/orders/:id/complete [admin token required]

\*\* Note: request & response of the API, please refer to `StoreFront_API.postman_collection.json` file

## Connect to API

Using postman collection that import from `StoreFront_API.postman_collection.json` file
