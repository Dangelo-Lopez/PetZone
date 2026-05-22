# PetZone Fullstack

Sistema Fullstack desarrollado utilizando arquitectura de microservicios con React, Spring Boot y MySQL.

---

# Descripción del Proyecto

PetZone es una plataforma orientada a la gestión y visualización de productos para mascotas. El sistema fue desarrollado aplicando una arquitectura desacoplada basada en microservicios, permitiendo una solución más escalable, mantenible y organizada.

La solución implementa:

* Frontend desarrollado con React y Vite
* Backend basado en Spring Boot
* Patrón Backend For Frontend (BFF)
* Microservicios independientes
* Persistencia de datos con MySQL
* APIs REST
* Spring Security
* Maven como gestor de dependencias

---

# Arquitectura del Sistema

```text
Frontend React
        │
        ▼
BFF (8080)
        │
 ┌───────────────┬────────────────┐
 ▼                               ▼
MS-AUTH (8081)          MS-PRODUCTOS (8082)
        │                               │
        └───────────────┬───────────────┘
                        ▼
                  MySQL - petzone_db
```

---

# Estructura del Proyecto

```text
PETZONE/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│
└── backend/
    ├── bff/
    ├── ms-auth/
    └── ms-productos/
```

---

# Tecnologías Utilizadas

## Frontend

* React
* Vite
* JavaScript
* Context API
* CSS

## Backend

* Java 17
* Spring Boot
* Spring Web
* Spring Security
* Spring Data JPA
* Maven
* Hibernate

## Base de Datos

* MySQL
* XAMPP
* phpMyAdmin

---

# Configuración de Puertos

| Servicio     | Puerto |
| ------------ | ------ |
| Frontend     | 5173   |
| BFF          | 8080   |
| MS-AUTH      | 8081   |
| MS-PRODUCTOS | 8082   |

---

# Instalación y Ejecución

## Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Disponible en:

```text
http://localhost:5173
```

---

## Backend - BFF

```bash
cd backend/bff
./mvnw spring-boot:run
```

Disponible en:

```text
http://localhost:8080
```

---

## Backend - MS-AUTH

```bash
cd backend/ms-auth
./mvnw spring-boot:run
```

Disponible en:

```text
http://localhost:8081
```

---

## Backend - MS-PRODUCTOS

```bash
cd backend/ms-productos
./mvnw spring-boot:run
```

Disponible en:

```text
http://localhost:8082
```

---

# Base de Datos

Crear la base de datos:

```sql
CREATE DATABASE petzone_db;
```

Configuración utilizada:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/petzone_db
spring.datasource.username=root
spring.datasource.password=
```

---

# Endpoints Principales

## BFF

```text
GET /api/test
GET /api/productos
```

---

## MS-AUTH

```text
GET /auth/test
```

---

## MS-PRODUCTOS

```text
GET /productos
POST /productos
GET /productos/test
```

---

# Patrones y Arquitectura Implementados

## Patrones de Diseño

* MVC
* Repository Pattern
* Context Pattern
* Singleton Pattern

## Patrones Arquitectónicos

* Arquitectura en capas
* Backend For Frontend (BFF)
* Arquitectura basada en microservicios

---

# Seguridad

El sistema implementa Spring Security en el microservicio de autenticación para gestionar el acceso a los endpoints y controlar la autenticación de usuarios.

---

# Estado del Proyecto

* Frontend funcional
* Arquitectura de microservicios implementada
* Comunicación entre servicios operativa
* Persistencia de datos en MySQL
* APIs REST funcionales
* Seguridad base implementada
* Proyecto versionado en GitHub

---

# Integrantes

* Dangelo López
* Fernanda Lagos
* Marco Maldonado 