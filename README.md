# App RESTful API

A learning project for building a RESTful API with **Node.js**, **Express**, **MySQL**, and **JSON Web Tokens**.

The application provides employee CRUD operations, employee–project reporting, user registration and login, JWT generation, and a protected demonstration endpoint.

[![Node.js](https://img.shields.io/badge/Node.js-JavaScript-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-black?logo=express)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens)](https://jwt.io/)

> **Educational project:** the current authentication and configuration contain security practices that are unsuitable for production. Read the [Security Notes](#security-notes) before deploying or extending it.

## Features

- Express HTTP server on port `3000`
- JSON and URL-encoded request parsing
- MySQL database connection
- Employee CRUD endpoints
- Parameterized SQL values for CRUD operations
- Employee and project relationship query
- Nested project response grouped by employee
- User registration with duplicate-email checking
- User login and JWT generation
- Access-token persistence in MySQL
- Bearer-token verification middleware
- Simple role-based protected route
- Consistent JSON wrappers for successful API responses

## Technology Stack

| Technology | Purpose |
| --- | --- |
| Node.js | JavaScript runtime |
| Express 4 | HTTP API framework |
| MySQL | Relational database |
| `mysql` | Node.js MySQL client |
| `body-parser` | Request-body parsing |
| `jsonwebtoken` | JWT creation and verification |
| `MD5` | Current password hashing implementation |
| `ip` | Server IP lookup when recording access tokens |
| Morgan | Installed logging dependency, not currently enabled |

## Project Structure

```text
.
├── config
│   └── secret.js             # JWT secret configuration
├── middleware
│   ├── auth.js               # Registration, login, and protected response
│   ├── index.js              # Authentication routes
│   └── verifikasi.js         # JWT and role verification
├── controller.js             # Employee and project controllers
├── koneksi.js                # MySQL connection
├── res.js                    # Response helpers and project grouping
├── routers.js                # Public API route definitions
├── server.js                 # Express application entry point
├── package.json
└── package-lock.json
```

## API Overview

Base URL:

```text
http://localhost:3000
```

### General and employee routes

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| `GET` | `/api` | API status message | No |
| `GET` | `/api/karyawan` | List all employees | No |
| `POST` | `/api/karyawan` | Create an employee | No |
| `GET` | `/api/karyawan/:id` | Get an employee by ID | No |
| `PUT` | `/api/karyawan/:id` | Update an employee | No |
| `DELETE` | `/api/karyawan/:id` | Delete an employee | No |
| `GET` | `/api/proyek` | List projects grouped by employee | No |

### Authentication routes

The authentication router is mounted under `/auth`.

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| `POST` | `/auth/api/v1/register` | Register a user | No |
| `POST` | `/auth/api/v1/login` | Log in and obtain a JWT | No |
| `GET` | `/auth/api/v1/rahasia` | Protected demonstration route | Bearer token and role `2` |

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- MySQL or MariaDB

### Installation

Clone the repository:

```bash
git clone https://github.com/mjmokhtar/app-restful-api.git
cd app-restful-api
```

Install dependencies:

```bash
npm install
```

## Database Setup

The application expects this database:

```text
db_restful_api
```

Create it in MySQL:

```sql
CREATE DATABASE db_restful_api;
USE db_restful_api;
```

The source code references the following tables and columns.

### Employees

```sql
CREATE TABLE karyawan (
    id_karyawan INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nik VARCHAR(50) NOT NULL UNIQUE,
    nama VARCHAR(150) NOT NULL,
    posisi VARCHAR(100) NOT NULL
);
```

### Projects

```sql
CREATE TABLE proyek (
    id_proyek INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nama_proyek VARCHAR(150) NOT NULL,
    anggaran DECIMAL(15, 2) NOT NULL DEFAULT 0
);
```

### Employee–project relation

```sql
CREATE TABLE vendor (
    id_karyawan INT UNSIGNED NOT NULL,
    id_proyek INT UNSIGNED NOT NULL,
    PRIMARY KEY (id_karyawan, id_proyek),
    FOREIGN KEY (id_karyawan) REFERENCES karyawan(id_karyawan),
    FOREIGN KEY (id_proyek) REFERENCES proyek(id_proyek)
);
```

### Users

```sql
CREATE TABLE user (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role INT NOT NULL,
    tanggal_daftar DATETIME NOT NULL
);
```

### Access tokens

```sql
CREATE TABLE akses_token (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_user INT UNSIGNED NOT NULL,
    access_token TEXT NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES user(id)
);
```

> These schemas are reconstructed from the current queries because the repository does not contain a migration or SQL dump. Adjust types if your existing database uses a different schema.

## Database Configuration

The current connection is defined directly in `koneksi.js`:

```js
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_restful_api'
});
```

For local study, update these values to match your MySQL installation.

For a real deployment, move them to environment variables instead of committing credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=app_user
DB_PASSWORD=change-me
DB_NAME=db_restful_api
JWT_SECRET=generate-a-long-random-secret
PORT=3000
```

## Running the Server

The project currently does not define a start script, so run:

```bash
node server.js
```

Expected output:

```text
Connection MySQL Succuessfully!
app running at http://localhost:3000
```

## Request Examples

### Check API status

```bash
curl http://localhost:3000/api
```

### List employees

```bash
curl http://localhost:3000/api/karyawan
```

### Create an employee

```bash
curl -X POST http://localhost:3000/api/karyawan \
  -H "Content-Type: application/json" \
  -d '{
    "nik": "EMP-001",
    "nama": "Example User",
    "posisi": "IoT Engineer"
  }'
```

### Get an employee

```bash
curl http://localhost:3000/api/karyawan/1
```

### Update an employee

```bash
curl -X PUT http://localhost:3000/api/karyawan/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nik": "EMP-001",
    "nama": "Updated User",
    "posisi": "Embedded Systems Engineer"
  }'
```

### Delete an employee

```bash
curl -X DELETE http://localhost:3000/api/karyawan/1
```

### View employee projects

```bash
curl http://localhost:3000/api/proyek
```

## Authentication Examples

### Register

```bash
curl -X POST http://localhost:3000/auth/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "example",
    "email": "example@example.com",
    "password": "change-me",
    "role": 2
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "example@example.com",
    "password": "change-me"
  }'
```

Successful login response:

```json
{
  "status": true,
  "message": "Token JWT tergenerate!",
  "token": "<jwt-token>",
  "currUser": 1
}
```

### Access the protected route

The current middleware expects both a bearer token and `role: 2` in the request body:

```bash
curl -X GET http://localhost:3000/auth/api/v1/rahasia \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"role": 2}'
```

This behavior documents the existing implementation; it should be redesigned before production use.

## Response Format

Most successful endpoints return:

```json
{
  "status": 200,
  "value": {}
}
```

The project report uses:

```json
{
  "status": 200,
  "values": {
    "Employee Name": {
      "id_karyawan": 1,
      "nik": "EMP-001",
      "nama": "Employee Name",
      "posisi": "Engineer",
      "nama_proyek": ["Project A", "Project B"],
      "anggaran": 1000000
    }
  }
}
```

## Security Notes

The project is useful for learning API flow, but several issues must be fixed before public deployment:

1. **The JWT secret is stored in the repository.** Rotate it and load a new secret from an environment variable.
2. **Passwords use MD5.** Replace MD5 with Argon2id or bcrypt using a unique salt.
3. **Users can submit their own role during registration.** Assign a safe server-side default and restrict administrative role changes.
4. **Authorization trusts `req.body.role`.** Read the role from verified JWT claims or the database instead.
5. **Employee CRUD routes are public.** Add authentication and authorization middleware.
6. **Database credentials are hard-coded.** Use environment variables and a least-privileged database user.
7. **Input validation is absent.** Validate required fields, types, lengths, emails, and IDs.
8. **JWT payload contains the complete user query result.** Sign only the minimum claims required, such as user ID and role.
9. **Stored access tokens are not revoked or expired in the database.** Add expiry, revocation, logout, and cleanup behavior.
10. **Errors are mostly logged without a consistent client response.** Add centralized Express error handling.
11. **No rate limiting, security headers, or CORS policy is configured.**
12. **No automated tests or database migrations are included.**

Do not reuse the committed JWT secret for any deployed system.

## Recommended Next Improvements

- Add `dotenv` and environment-based configuration
- Add `npm start` and development scripts
- Replace MD5 with Argon2id or bcrypt
- Add Joi, Zod, or express-validator
- Add authenticated role-based access control
- Add database migrations and seed data
- Use a connection pool
- Add consistent HTTP status codes and error responses
- Add pagination and filtering
- Add tests with Jest or Vitest and Supertest
- Add OpenAPI/Swagger documentation
- Add Helmet and API rate limiting

## License

`package.json` declares the project under the ISC license, but the repository does not currently include a standalone `LICENSE` file.

Copyright © Muhammad Jumi'at Mokhtar.
