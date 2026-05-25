# PetZone Fullstack

Sistema Fullstack desarrollado utilizando arquitectura de microservicios con React, Spring Boot, Docker y MySQL.

---

# Descripción del Proyecto

PetZone es una plataforma orientada a la gestión y visualización de productos y servicios para mascotas. El sistema fue desarrollado aplicando una arquitectura desacoplada basada en microservicios, permitiendo una solución más escalable, mantenible y organizada.

La solución implementa:

* Frontend desarrollado con React y Vite
* Backend basado en Spring Boot
* Patrón Backend For Frontend (BFF)
* Microservicios independientes
* Persistencia de datos con MySQL
* APIs REST
* Docker y Docker Compose
* Context API para autenticación y carrito
* Testing con JUnit y Vitest
* Maven como gestor de dependencias

---

# Arquitectura del Sistema

```text
Frontend React + Vite
          │
          ▼
BFF / API Gateway (8080)
          │
 ┌────────────────┬─────────────────┐
 ▼                                ▼
MS-AUTH (8081)          MS-PRODUCTOS (8082)
                                      │
                                      ▼
                              MySQL - petzone_db
```

---

# Arquitectura Implementada

La aplicación fue desarrollada utilizando una arquitectura basada en microservicios desacoplados.

Cada servicio tiene responsabilidades independientes:

| Servicio | Responsabilidad |
|---|---|
| Frontend | Interfaz gráfica y experiencia de usuario |
| BFF | Punto de entrada único para el frontend |
| MS-AUTH | Gestión de autenticación |
| MS-PRODUCTOS | Gestión de productos y servicios |
| MySQL | Persistencia de datos |

---

# Estructura del Proyecto

```text
PETZONE/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│
├── backend/
│   ├── bff/
│   │   └── Dockerfile
│   │
│   ├── ms-auth/
│   │   └── Dockerfile
│   │
│   └── ms-productos/
│       └── Dockerfile
│
├── docker-compose.yml
├── README.md
└── repositorios.txt
```

---

# Tecnologías Utilizadas

## Frontend

* React
* Vite
* JavaScript
* React Router
* Context API
* CSS

## Backend

* Java 17
* Spring Boot
* Spring Web
* Spring Security
* Spring Data JPA
* Hibernate
* Maven

## Base de Datos

* MySQL
* XAMPP
* phpMyAdmin

## DevOps y Contenedores

* Docker
* Docker Compose
* Git
* GitHub

---

# Funcionalidades Implementadas

## Frontend

* Catálogo dinámico de productos
* Productos cargados desde MySQL
* Visualización de imágenes dinámicas
* Carrito de compras
* Login persistente
* Navegación dinámica con React Router
* Vista de accesorios
* Vista de alimentos
* Cotizador de peluquería
* Protección de reservas para usuarios autenticados
* Diseño responsive

## Backend

* APIs REST
* Arquitectura desacoplada
* Microservicios independientes
* BFF para centralizar solicitudes
* Persistencia con Spring Data JPA
* Integración completa con MySQL

## Servicios de Cuidado

* Cotizador dinámico
* Servicios por tipo de mascota
* Selección por rango de peso
* Cálculo automático de precios
* Restricción de reservas sin login

---

# Configuración de Puertos

| Servicio | Puerto |
|---|---|
| Frontend | 5173 |
| BFF | 8080 |
| MS-AUTH | 8081 |
| MS-PRODUCTOS | 8082 |
| MySQL | 3306 |

---

# Ejecución Local

## Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
```

---

# Frontend

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

# Backend - BFF

```bash
cd backend/bff
./mvnw spring-boot:run
```

Disponible en:

```text
http://localhost:8080
```

---

# Backend - MS-AUTH

```bash
cd backend/ms-auth
./mvnw spring-boot:run
```

Disponible en:

```text
http://localhost:8081
```

---

# Backend - MS-PRODUCTOS

```bash
cd backend/ms-productos
./mvnw spring-boot:run
```

Disponible en:

```text
http://localhost:8082
```

---

# Ejecución con Docker

## Levantar todos los servicios

```bash
docker compose up --build
```

---

## Ver contenedores activos

```bash
docker ps
```

---

## Detener servicios

```bash
docker compose down
```

---

# Base de Datos

## Crear base de datos

```sql
CREATE DATABASE petzone_db;
```

---

## Configuración utilizada

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/petzone_db
spring.datasource.username=root
spring.datasource.password=
```

---

# Tablas Implementadas

## producto

Almacena productos dinámicos de la tienda.

## servicio_cuidado

Gestiona servicios de peluquería y cotización dinámica.

## usuarios

Gestiona usuarios autenticados del sistema.

---

# Endpoints Principales

## BFF

```text
GET /api/test
GET /api/productos
GET /api/cuidados
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

GET /cuidados
POST /cuidados
```

---

# Dockerización

El sistema fue dockerizado utilizando contenedores independientes para:

* Frontend React
* BFF
* Microservicio Auth
* Microservicio Productos

La orquestación se realiza mediante Docker Compose.

---

# Patrones y Arquitectura Implementados

## Patrones de Diseño

* MVC Pattern
* Repository Pattern
* Context API Pattern
* Component-Based Architecture
* Singleton Pattern

## Patrones Arquitectónicos

* Arquitectura en capas
* Backend For Frontend (BFF)
* Arquitectura basada en microservicios

---

# Testing

## Backend

Pruebas unitarias implementadas con:

* JUnit
* Spring Boot Test

Validaciones realizadas:

* Contexto Spring Boot
* Inicialización de microservicios

---

## Frontend

Pruebas implementadas con:

* Vitest
* Testing Library

Validaciones realizadas:

* Renderizado básico
* Ejecución correcta de componentes

---

# Seguridad

El sistema implementa mecanismos básicos de autenticación y control de acceso:

* Validación de sesión mediante Context API
* Persistencia de usuario con localStorage
* Restricción de reservas para usuarios autenticados
* Spring Security configurado en backend

---

# Estado del Proyecto

## Implementado

* Frontend funcional
* Arquitectura de microservicios
* Comunicación entre servicios
* Persistencia en MySQL
* APIs REST funcionales
* Dockerización completa
* Testing backend y frontend
* Integración React + Spring Boot
* Sistema de cuidado dinámico
* Carrito de compras
* Login persistente

---

# Mejoras Futuras

* JWT real
* Panel de administración
* Reservas persistentes
* Historial de compras
* Integración de pagos
* Despliegue cloud
* CI/CD

---

# Integrantes

* Dangelo López
* Fernanda Lagos
* Marco Maldonado