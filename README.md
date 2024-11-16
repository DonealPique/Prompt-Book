# Prompt-Book

## README: Prompt Book with Docker Setup

## Overview

Welcome to the **Prompt Book Project**! This project is designed to help developers add, edit, using Ai to answer questions and update prompts, This README provides detailed instructions on setting up and using the application with Docker.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Docker Installation](#docker-installation)
3. [Setting Up the Database](#setting-up-the-database)
4. [PHPMyAdmin Setup](#phpmyadmin-setup)
5. [Managing Containers](#managing-containers)
6. [Error Logs](#error-logs)
7. [Project Structure](#project-structure)
8. [API Access](#api-access)

---

## Prerequisites

- **Docker Engine**: Install Docker from the official documentation: [Docker Install Guide](https://docs.docker.com/get-docker/).
- Basic knowledge of Docker commands and terminal usage.
- Git for version control.

---

## Docker Installation

To begin, ensure Docker Engine is installed and running on your machine. Refer to the [Docker Installation Guide](https://docs.docker.com/get-docker/) for your platform.

---

## Setting Up the Database

Start the database container using the following command:

```bash
docker run -p 3306:3306 --name deep_dive_database_container tiesnoordhuis/deep_dive_database
```

**Container Details**:

- **Name**: `deep_dive_database_container`
- **Users**:
  - `root` (Password: `root`)
  - `bit_academy` (Password: `bit_academy`) – Use this in the application.
- **Database**: `promptbook` – Fully accessible by `bit_academy`.

---

## PHPMyAdmin Setup

To manage and view the database through a web interface, use the following command:

```bash
docker run --name phpmyadmin -d --link deep_dive_database_container:db -p 8082:80 phpmyadmin
```

**Container Details**:

- **Name**: `phpmyadmin`
- **Linked Database**: `deep_dive_database_container`
- **Access**: Visit [http://localhost:8082](http://localhost:8082)
- **Login Credentials**:
  - Username: `bit_academy`
  - Password: `bit_academy`

---

## Managing Containers

### Stopping and Removing Containers

#### Database Container

```bash
docker stop deep_dive_database_container
docker rm deep_dive_database_container
```

#### PHPMyAdmin Container

```bash
docker stop phpmyadmin
docker rm phpmyadmin
```

---

## Error Logs

If any issues occur, check the logs for debugging:

```bash
docker logs deep_dive_database_container
```

---

## API Access

The API can be accessed locally at:

**URL**: [http://localhost:8000](http://localhost:8000)

---

## API Specification

To understand the endpoints and their usage, refer to the API specification provided in the project. You can access it in two ways:

### Local File

- Located in the repository as `api-spec.yaml`.

### Online Specification

- Accessible via the following URL:  
  [https://raw.githubusercontent.com/TiesNoordhuisBITAcademy/deep_dive_promptbook/refs/heads/main/api/api-spec.yaml](https://raw.githubusercontent.com/TiesNoordhuisBITAcademy/deep_dive_promptbook/refs/heads/main/api/api-spec.yaml)

#### Importing the API Specification

You can import the `api-spec.yaml` file into tools like Postman, Swagger UI, or any API client to interact with the API endpoints more conveniently.

---

## Running the API

Ensure that both the **Database Container** and the **API Container** are running:

1. **Start Database Container**:

   ```bash
   docker run -p 3306:3306 --name deep_dive_database_container tiesnoordhuis/deep_dive_database
   ```

2. **Start API Container**:

   ```bash
   docker run -p 8000:8000 --link deep_dive_database_container:db --name deep_dive_api_container tiesnoordhuis/deep_dive_api
   ```

---

## Project Structure

### Prompt Book Features

- **List of prompts**
- **Fragment Tags**
- **Responsive on all devices**
- **Chatgpt Intergration**
- **Add prompts**
- **Delete prompts**
- **Edit prompts**

---
