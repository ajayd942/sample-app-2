# 💍 Ajay & Vandana Wedding Platform

A full-stack wedding application featuring a digital RSVP system, an interactive "Our Story" timeline, and a secure Admin Dashboard for managing wedding events.

**Live URL:** [https://vandanawedsajay.uk](https://vandanawedsajay.uk)

---

## 🏗️ Architecture Overview

This project is built as a modern, containerized microservices application.

*   **Frontend:** React (Vite) + Tailwind CSS + Framer Motion (Animations).
*   **Backend:** Java Dropwizard + Hibernate + Guice.
*   **Database:** PostgreSQL (Persisted Data).
*   **Cache:** Redis (Read-through caching).
*   **Routing:** Nginx (Reverse Proxy & Static Asset Server).
*   **Deployment:** Docker Compose + Cloudflare Tunnel (Zero Trust Security).

---

## ✨ Key Features

### 👩‍❤️‍👨 Guest Experience
*   **Our Story:** A beautiful vertical timeline showcasing key moments with an interactive photo carousel and lightbox (powered by Framer Motion).
*   **Events:** A responsive grid view of all wedding events (Cocktail, Haldi, Wedding) with integrated Google Maps links.
*   **RSVP:** A seamless form for guests to confirm attendance, request cabs, and specify guest counts. Protected by Rate Limiting (Bucket4j) to prevent spam.

### 🛡️ Admin Dashboard
*   **Secure Access:** Protected `/admin` route requiring a secret key header.
*   **Event Management:** Create, Delete, and Reorder wedding events with a drag-and-drop style UI.
*   **RSVP Management:** View, Edit, and Delete guest RSVPs in real-time.

---

## 🛠️ Tech Stack

### Frontend
*   **React 18** (Vite)
*   **Tailwind CSS** (Styling)
*   **Lucide React** (Icons)
*   **Framer Motion** (Animations)

### Backend
*   **Java 25** (Early Access)
*   **Dropwizard** (REST Framework)
*   **Hibernate** (ORM)
*   **Liquibase** (Database Migrations)
*   **Bucket4j** (Rate Limiting)
*   **Guice** (Dependency Injection)

### Infrastructure
*   **Docker & Docker Compose**
*   **Nginx** (Reverse Proxy)
*   **PostgreSQL 18**
*   **Redis 7**
*   **Cloudflare Tunnel** (cloudflared)

---

## 🚀 Local Development

We use a `Makefile` to streamline the development workflow.

### Prerequisites
*   Docker & Docker Compose installed.

### Commands

| Command | Description |
| :--- | :--- |
| `make run` | Starts the entire stack (Backend, Frontend, DB, Redis, Tunnel) in detached mode. |
| `make rebuild-frontend` | Rebuilds only the frontend image (useful after changing React code or CSS). |
| `make build` | Builds both the Java JAR and all Docker images. |
| `make down` | Stops and removes all containers. |
| `make clean` | Stops containers and **deletes the database volume** (resets data). |

---

## 📂 Directory Structure

```
sample-app-2/
├── config.yml                # Backend Configuration
├── docker-compose.yml        # Service Orchestration
├── Makefile                  # Build Automation
├── frontend/                 # React Application
│   ├── public/
│   │   └── moments/          # Story Images
│   ├── src/
│   │   ├── components/       # React Components (Story, Events, Admin)
│   │   └── pages/
│   ├── nginx.conf            # Nginx Routing Logic
│   └── Dockerfile            # Frontend Build
├── src/                      # Java Backend Source
│   ├── main/
│   │   ├── java/com/ajay/sampleApp/
│   │   │   ├── db/           # DAOs and Entities
│   │   │   ├── resources/    # REST API Endpoints
│   │   │   └── ...
│   │   └── resources/
│   │       └── db/           # Liquibase Migrations
└── pom.xml                   # Maven Build Config
```

---

## 🔒 Security

*   **Cloudflare Tunnel:** The application is exposed to the internet via a secure tunnel. No ports are opened on the host machine's firewall.
*   **Rate Limiting:** The backend implements IP-based rate limiting on RSVP endpoints, respecting the `CF-Connecting-IP` header from Cloudflare.
*   **Internal Network:** Database (5432) and Redis (6379) ports are closed to the host and only accessible to the application containers via the internal Docker network.

---

## ⚙️ Configuration

*   **Backend:** `config.yml` handles database connections, Redis settings, and the Admin Secret.
*   **Routing:** `frontend/nginx.conf` handles serving the React app and proxying `/api` requests to the backend container.
*   **Tunnel:** `~/.cloudflared/config.yml` (on the host) manages the ingress rules for the Cloudflare Tunnel.
