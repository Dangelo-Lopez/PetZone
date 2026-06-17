# PetZone Fullstack

Sistema Fullstack desarrollado con una arquitectura basada en microservicios utilizando **React, Spring Boot, MySQL y Docker**. La aplicación está orientada a la gestión de productos y servicios para mascotas, incorporando autenticación, panel administrativo, carrito de compras, control de stock y carga de imágenes.

---

# Descripción del Proyecto

PetZone es una plataforma web que permite visualizar, administrar y adquirir productos para mascotas, además de cotizar servicios de cuidado y peluquería.

El proyecto fue desarrollado utilizando una arquitectura desacoplada basada en microservicios, lo que facilita su mantenimiento, escalabilidad y modularidad.

Entre sus principales características destacan:

* Frontend desarrollado con React + Vite.
* Backend construido con Spring Boot.
* Patrón Backend For Frontend (BFF).
* Microservicios independientes para autenticación y productos.
* Persistencia de datos con MySQL.
* APIs REST.
* Docker y Docker Compose.
* Context API para autenticación y carrito.
* Gestión de imágenes para perfiles y productos.
* Panel de administración completo.
* Pruebas automatizadas con Vitest y JUnit.

---

# Arquitectura del Sistema

```text
                 React + Vite
                      │
                      ▼
             BFF / API Gateway
                 (Puerto 8080)
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
 MS-AUTH (8081)             MS-PRODUCTOS (8082)
        │                           │
        └─────────────┬─────────────┘
                      ▼
                MySQL petzone_db
```

---

# Arquitectura Implementada

Cada componente del sistema posee responsabilidades independientes.

| Servicio     | Función                                |
| ------------ | -------------------------------------- |
| Frontend     | Interfaz gráfica de usuario            |
| BFF          | Punto de entrada para el frontend      |
| MS-AUTH      | Gestión de usuarios y autenticación    |
| MS-PRODUCTOS | Gestión de productos, imágenes y stock |
| MySQL        | Persistencia de la información         |

---

# Estructura del Proyecto

```text
PETZONE/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
│
├── backend/
│   ├── bff/
│   ├── ms-auth/
│   └── ms-productos/
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
* React Router DOM
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

## DevOps

* Docker
* Docker Compose
* Git
* GitHub

## Testing

* Vitest
* React Testing Library
* JUnit
* Spring Boot Test

---

# Funcionalidades Implementadas

## Gestión de Usuarios

* Registro de usuarios.
* Inicio de sesión.
* Persistencia de sesión.
* Edición del perfil.
* Cambio de contraseña.
* Actualización de teléfono.
* Actualización de dirección.
* Gestión de fotografía de perfil.
* Subida de imágenes desde el computador.
* Visualización de avatar personalizado en la barra de navegación.

---

## Gestión de Productos

* Catálogo dinámico conectado a MySQL.
* CRUD completo de productos.
* Carga de imágenes desde el computador.
* Visualización automática de imágenes.
* Clasificación por categorías.
* Edición desde el panel administrativo.
* Eliminación de productos.
* Gestión de stock disponible.
* Indicador de productos agotados.

---

## Carrito de Compras

* Agregar productos.
* Eliminar productos.
* Modificar cantidades.
* Cálculo automático del total.
* Persistencia mediante LocalStorage.
* Validación de stock antes de agregar productos.
* Descuento automático del stock al finalizar una compra.
* Bloqueo de compras cuando no existe stock suficiente.

---

## Panel Administrativo

Acceso exclusivo para usuarios con rol **ADMIN**.

Permite:

* Crear productos.
* Editar productos.
* Eliminar productos.
* Modificar precios.
* Modificar categorías.
* Modificar stock.
* Subir imágenes de productos.
* Crear usuarios.
* Editar usuarios.
* Eliminar usuarios.
* Cambiar roles entre `USER` y `ADMIN`.
* Administrar la información general del sistema.

---

## Servicios de Cuidado

* Cotizador dinámico.
* Selección por tipo de mascota.
* Selección por rango de peso.
* Cálculo automático del precio.
* Restricción de reservas para usuarios autenticados.

---

# Configuración de Puertos

| Servicio     | Puerto |
| ------------ | ------ |
| Frontend     | 5173   |
| BFF          | 8080   |
| MS-AUTH      | 8081   |
| MS-PRODUCTOS | 8082   |
| MySQL        | 3306   |

---

# Ejecución del Proyecto

## Clonar repositorio

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

```
http://localhost:5173
```

---

## Backend BFF

```bash
cd backend/bff
./mvnw spring-boot:run
```

Disponible en:

```
http://localhost:8080
```

---

## Backend MS-AUTH

```bash
cd backend/ms-auth
./mvnw spring-boot:run
```

Disponible en:

```
http://localhost:8081
```

---

## Backend MS-PRODUCTOS

```bash
cd backend/ms-productos
./mvnw spring-boot:run
```

Disponible en:

```
http://localhost:8082
```

---

# Docker

## Construir y levantar los servicios

```bash
docker compose up --build
```

## Ver contenedores activos

```bash
docker ps
```

## Detener los servicios

```bash
docker compose down
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

# Tablas Principales

## usuarios

Contiene la información de los usuarios registrados:

* Nombre
* Correo electrónico
* Contraseña cifrada
* Rol
* Teléfono
* Dirección
* Foto de perfil

---

## producto

Contiene:

* Nombre
* Precio
* Categoría
* Stock
* Imagen del producto

---

## servicio_cuidado

Gestiona la información utilizada por el cotizador dinámico de servicios.

---

# Endpoints Principales

## BFF

```
GET /api/test
GET /api/productos
GET /api/cuidados
```

## MS-AUTH

```
POST /auth/register
POST /auth/login

GET /auth/usuarios
PUT /auth/usuarios/{id}
PATCH /auth/usuarios/{id}/rol
DELETE /auth/usuarios/{id}

POST /auth/usuarios/{id}/foto
```

## MS-PRODUCTOS

```
GET /productos
POST /productos
PUT /productos/{id}
DELETE /productos/{id}

PATCH /productos/{id}/descontar-stock

POST /productos/upload
```

---

# Dockerización

El proyecto utiliza contenedores independientes para:

* Frontend React.
* Backend For Frontend.
* Microservicio de autenticación.
* Microservicio de productos.
* Base de datos MySQL.

La orquestación se realiza mediante Docker Compose.

---

# Patrones Utilizados

## Patrones de Diseño

* MVC
* Repository Pattern
* Singleton
* Context API
* Component-Based Architecture

## Patrones Arquitectónicos

* Arquitectura en Capas
* Backend For Frontend (BFF)
* Arquitectura basada en Microservicios

---

# Arquetipos del Proyecto

La solución PetZone fue diseñada utilizando una arquitectura basada en microservicios, donde cada componente cumple una responsabilidad específica y se comunica mediante APIs REST.

## Frontend

Desarrollado con React y Vite, proporciona la interfaz gráfica para los usuarios finales y el panel de administración. Consume los servicios expuestos por el Backend For Frontend (BFF).

## Backend For Frontend (BFF)

Actúa como punto de entrada único para el frontend, centralizando las solicitudes y coordinando la comunicación con los distintos microservicios. Esta capa simplifica la lógica del cliente y desacopla la interfaz de usuario de los servicios internos.

## Microservicio de Autenticación (MS-AUTH)

Responsable de la gestión de usuarios, autenticación y administración de perfiles. Entre sus funciones se incluyen:

- Registro e inicio de sesión.
- Edición de datos personales.
- Gestión de roles (`USER` y `ADMIN`).
- Actualización de fotografías de perfil.
- Administración de credenciales y seguridad.

## Microservicio de Productos (MS-PRODUCTOS)

Encargado de la administración de los productos de la tienda y del control de inventario. Sus principales responsabilidades son:

- Crear, editar y eliminar productos.
- Gestionar categorías y precios.
- Administrar el stock disponible.
- Gestionar imágenes de productos.
- Descontar automáticamente el stock cuando se realiza una compra.

## Base de Datos MySQL

Centraliza el almacenamiento persistente de la información utilizada por el sistema, incluyendo usuarios, productos, servicios y demás datos necesarios para el funcionamiento de la plataforma.

---

# Estrategia de Branching

Para el desarrollo del proyecto se utilizó una estrategia de control de versiones basada en Git, con el objetivo de mantener una organización clara del código fuente y facilitar el trabajo colaborativo.

## Rama principal

- **main:** contiene la versión estable del proyecto y representa el código listo para entrega o despliegue.

## Ramas de funcionalidades

Durante el desarrollo se recomienda utilizar ramas independientes para implementar nuevas funcionalidades o correcciones sin afectar la estabilidad del proyecto principal.

Ejemplos:

- `feature/login`
- `feature/admin-panel`
- `feature/product-images`
- `feature/stock-management`
- `feature/profile-edit`

## Ramas de corrección

Para solucionar errores específicos se pueden utilizar ramas del tipo:

- `bugfix/login-validation`
- `bugfix/cart-stock`
- `bugfix/profile-upload`

## Flujo de trabajo

1. Crear una nueva rama a partir de `main`.
2. Desarrollar y probar la funcionalidad correspondiente.
3. Realizar los commits necesarios documentando los cambios.
4. Integrar la rama al proyecto principal mediante un proceso de revisión.
5. Mantener siempre `main` como la versión estable del sistema.

Esta estrategia permite mantener un historial de cambios organizado, reducir conflictos durante el desarrollo y facilitar la incorporación de nuevas funcionalidades de manera controlada.

# Testing

## Backend

Se implementaron pruebas unitarias utilizando:

* JUnit
* Spring Boot Test

Validando:

* Inicialización correcta de los microservicios.
* Carga del contexto de Spring Boot.

## Frontend

Se implementaron pruebas automatizadas con:

* Vitest
* React Testing Library

Cobertura de pruebas:

* Aplicación principal.
* Inicio de sesión.
* Perfil de usuario.
* Carrito de compras.
* Contexto del carrito.
* Panel administrativo.
* Gestión de productos.
* Gestión de usuarios.
* Validación de stock.

**Total implementado: 36 pruebas automatizadas exitosas.**

---

# Seguridad

El sistema incorpora mecanismos básicos de seguridad:

* Persistencia de sesión mediante Context API.
* Almacenamiento local con LocalStorage.
* Contraseñas cifradas utilizando BCrypt.
* Restricción de acceso al panel administrativo por rol.
* Protección de reservas para usuarios autenticados.
* Configuración de Spring Security.
* Validación de stock antes de procesar compras.

---

# Estado Actual del Proyecto

## Implementado

* Frontend completamente funcional.
* Arquitectura de microservicios.
* Backend For Frontend.
* Integración React + Spring Boot + MySQL.
* Sistema de autenticación.
* Gestión de perfiles.
* Subida de imágenes para perfiles.
* CRUD completo de productos.
* CRUD completo de usuarios.
* Gestión de roles.
* Panel administrativo.
* Carrito de compras.
* Control automático de stock.
* Indicador de productos agotados.
* Persistencia de datos.
* Dockerización.
* Suite de pruebas automatizadas.
* Diseño responsive.
* Soporte para tema claro y oscuro.

---

# Mejoras Futuras

* Implementación de JWT completo.
* Historial de compras.
* Pasarela de pagos real.
* Gestión persistente de pedidos.
* Notificaciones por correo.
* Despliegue en servicios cloud.
* Pipeline CI/CD.
* Recuperación de contraseña.
* Auditoría de acciones administrativas.

---

# Integrantes

* Dangelo López
* Fernanda Lagos
* Marco Maldonado
