# SampleApp

## Overview
SampleApp is a RESTful API service built with **Java** and **Dropwizard**. It provides a backend for managing user data, including creating, reading, updating, and deleting (CRUD) user profiles. The application leverages **PostgreSQL** for persistent storage and **Redis** for caching to ensure high performance.

## Tech Stack
*   **Language:** Java 25 (Early Access)
*   **Framework:** [Dropwizard](https://www.dropwizard.io/) (v4.0.7) - A Java framework for developing ops-friendly, high-performance, RESTful web services.
*   **Database:** [PostgreSQL](https://www.postgresql.org/) (v42.7.5 driver) - Relational database management system.
*   **ORM:** [Hibernate](https://hibernate.org/) - Object-Relational Mapping library for mapping Java classes to database tables.
*   **Caching:** [Redis](https://redis.io/) (via [Jedis](https://github.com/redis/jedis) v5.1.2 client) - In-memory data structure store used as a cache.
*   **Dependency Injection:** [Guice](https://github.com/google/guice) (v7.0.0) - Lightweight dependency injection framework.
*   **Database Migrations:** [Liquibase](https://www.liquibase.org/) (v4.27.0) - Database schema change management.
*   **Boilerplate Reduction:** [Lombok](https://projectlombok.org/) (v1.18.36) - Java library to reduce boilerplate code (getters, setters, builders, etc.).
*   **Build Tool:** [Maven](https://maven.apache.org/)

## Prerequisites
Before running the application, ensure you have the following installed:
*   **Java JDK 25** (or JDK 21/23 for stable support)
*   **Maven**
*   **PostgreSQL** (running on localhost:5432)
*   **Redis** (running on localhost:6379)
*   **Docker & Docker Compose** (optional, for containerized execution)

## Development Environment Setup (MacBook)

### 1. Install Homebrew
If you don't have Homebrew installed, install it first:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install & Start PostgreSQL
```bash
# Install PostgreSQL
brew install postgresql@16

# Start the PostgreSQL service
brew services start postgresql@16

# Create the database and user
psql postgres
```
Inside the `psql` shell, run:
```sql
CREATE DATABASE "sample-app-2";
CREATE USER ajay WITH PASSWORD '66132480';
GRANT ALL PRIVILEGES ON DATABASE "sample-app-2" TO ajay;
\q
```

### 3. Install & Start Redis
```bash
# Install Redis
brew install redis

# Start the Redis service
brew services start redis
```

## Setup & Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd sample-app-2
```

### 2. Build the Application
Run the following command to compile the code and package it into a JAR file:
```bash
mvn clean install
```

### 3. Run Database Migrations
Apply the database schema changes using Liquibase:
```bash
java -jar target/sample-app-2-0.0.1.jar db migrate config.yml
```

### 4. Start the Application
Start the Dropwizard server:
```bash
java -jar target/sample-app-2-0.0.1.jar server config.yml
```

## Local Development with Docker

You can run the entire application stack (App, PostgreSQL, Redis) using Docker Compose and the provided Makefile.

### 1. Build the Application and Docker Image
This command will compile the Java application and build the Docker image.
```bash
make build
```

### 2. Start Services
Run the following command to start all services (App, DB, Redis):
```bash
make run
```
This will:
*   Start a PostgreSQL container (data persisted in `./data/postgres`).
*   Start a Redis container.
*   Start the application container.
*   Automatically run database migrations before starting the server.

The application will be accessible at `http://localhost:8080`.

### 3. Stop Services
To stop the containers:
```bash
make down
```

### 4. Clean Up
To stop containers and remove the persisted database volume:
```bash
make clean
```

## Production Deployment Plan

When deploying this application to a production environment, it is critical to separate the database migration step from the application startup to avoid race conditions and ensure data integrity.

**Deployment Steps:**

1.  **Deploy Artifact:** Copy the new `sample-app-2-0.0.1.jar` file to the production server.
2.  **Run Migrations:** Execute the migration command **before** starting the application. This ensures the database schema is compatible with the new code.
    ```bash
    java -jar target/sample-app-2-0.0.1.jar db migrate config.yml
    ```
    *Note: If this command fails, abort the deployment immediately.*
3.  **Start Application:** Once migrations are successful, start the application server.
    ```bash
    java -jar target/sample-app-2-0.0.1.jar server config.yml
    ```

## Usage

### Health Check
Check if the application is running correctly:
*   **URL:** `http://localhost:8081/healthcheck`

### API Endpoints
The application runs on `http://localhost:8080`.

#### User Management
*   **Get All Users**
    *   `GET /Users`
*   **Get User by ID**
    *   `GET /Users/{id}`
*   **Create User**
    *   `POST /Users`
    *   **Body:**
        ```json
        {
          "fullName": "John Doe",
          "email": "john.doe@example.com",
          "dob": "01-01-1990",
          "phone": "1234567890",
          "additionalInfo": "{\"hobbies\": [\"coding\", \"reading\"]}"
        }
        ```
*   **Update User**
    *   `PUT /Users/{id}`
    *   **Body:**
        ```json
        {
          "fullName": "John Doe Updated",
          "dob": "01-01-1990",
          "phone": "0987654321",
          "additionalInfo": "{\"status\": \"active\"}"
        }
        ```
*   **Delete User**
    *   `DELETE /Users/{id}`

## Database Management

### Schema Changes (Liquibase)
This project uses Liquibase for database migrations. All migration files are located in `src/main/resources/db/`.

**To add a new database change:**
1.  Edit `src/main/resources/db/migrations.xml`.
2.  Add a new `<changeSet>` describing your change (e.g., create table, add column).
    ```xml
    <changeSet id="2" author="yourname">
        <addColumn tableName="users">
            <column name="new_column" type="varchar(255)"/>
        </addColumn>
    </changeSet>
    ```
3.  Run the migration command:
    ```bash
    java -jar target/sample-app-2-0.0.1.jar db migrate config.yml
    ```

### Database Configuration
Database connection settings are defined in two places:
1.  **`config.yml`**: Used by the application at runtime.
2.  **`src/main/resources/liquibase.properties`**: Used by the Liquibase Maven plugin (if used directly) or for reference.

## Caching Strategy
The application uses a **Read-Through** caching strategy with Redis:
1.  **Read:** When a user is requested by ID, the application first checks Redis.
    *   If found (Cache Hit), it returns the user from Redis.
    *   If not found (Cache Miss), it fetches from PostgreSQL, stores it in Redis, and then returns it.
2.  **Write/Update/Delete:** When a user is created, updated, or deleted, the corresponding entry in Redis is updated or invalidated to ensure consistency.

## Project Structure
```
sample-app-2/
├── config.yml                # Application configuration
├── pom.xml                   # Maven build configuration
├── README.md                 # Project documentation
├── Dockerfile                # Docker build instructions
├── docker-compose.yml        # Docker Compose configuration
├── Makefile                  # Build and run commands
├── src/
│   ├── main/
│   │   ├── java/com/ajay/sampleApp/
│   │   │   ├── SampleAppApplication.java  # Main entry point
│   │   │   ├── SampleAppConfiguration.java # Config class
│   │   │   ├── SampleAppModule.java       # Guice dependency injection module
│   │   │   ├── data/                      # Request/Response DTOs
│   │   │   ├── db/                        # DAOs and Entities
│   │   │   ├── redis/                     # Redis service
│   │   │   └── resources/                 # REST API Resources (Controllers)
│   │   └── resources/
│   │       ├── db/                        # Liquibase migrations
│   │       └── liquibase.properties       # Liquibase properties
```
