# ElysiaJS Boilerplate

[English](#english) | [ภาษาไทย](#thai)

---

<a name="english"></a>
## 🇬🇧 English Documentation

A production-ready boilerplate for building scalable APIs with [ElysiaJS](https://elysiajs.com/) (v1.4.16). Designed with best practices, type safety, and modular architecture in mind.

### Features
- **Modular Structure**: Organized by feature (Controllers, Services, Models).
- **Type Safety**: End-to-end type safety with TypeScript and Elysia's `t` schema.
- **Authentication**: Built-in JWT Authentication (Bearer Token).
- **Documentation**: Auto-generated Swagger UI.
- **CORS**: Pre-configured Cross-Origin Resource Sharing.
- **Health Check**: Ready-to-use health check endpoint.

### Project Structure
```
src/
├── controllers/    # Route handlers (API Endpoints)
├── services/       # Business logic and data processing
├── models/         # DTOs and Data Schemas
├── guards/         # Authentication & Authorization middleware
├── plugins/        # Custom Elysia plugins
├── utils/          # Helper functions
├── types/          # Global type definitions
└── index.ts        # Application entry point
```

### Getting Started

1. **Prerequisites**
   - [Bun](https://bun.sh/) runtime installed.

2. **Installation**
   ```bash
   bun install
   ```

3. **Development**
   Start the development server with hot-reload:
   ```bash
   bun dev
   ```
   The server will start at `http://localhost:3000`.

4. **Documentation**
   Visit `http://localhost:3000/swagger` to view the interactive API documentation.

### Usage Examples

#### Creating a New Route
Create a new controller in `src/controllers/`:
```typescript
import { Elysia } from 'elysia';

export const userController = new Elysia({ prefix: '/users' })
  .get('/', () => ({ users: [] }));
```
Then register it in `src/index.ts`.

#### Authentication (JWT)
1. **Login** to get a token:
   POST `/auth/login` with body `{ "username": "admin", "password": "password" }`
2. **Protect a Route**:
   Use the `.use(authGuard)` and `{ isAuth: true }`:
   ```typescript
   import { protectedController } from './controllers/protected.controller';
   // ...
   app.use(protectedController);
   ```
   Test with header: `Authorization: Bearer <your-token>`

---

<a name="thai"></a>
## 🇹🇭 เอกสารภาษาไทย

Boilerplate สำหรับสร้าง API ด้วย [ElysiaJS](https://elysiajs.com/) (v1.4.16) ที่ออกแบบมาเพื่อรองรับการขยายตัว (Scalability) และยึดตาม Best Practices

### คุณสมบัติเด่น
- **โครงสร้างแบบแยกส่วน**: จัดเก็บไฟล์แยกตามหน้าที่ (Controllers, Services, Models)
- **Type Safety**: รองรับ TypeScript เต็มรูปแบบ ปลอดภัยตั้งแต่ต้นจนจบ
- **ระบบยืนยันตัวตน**: รองรับ JWT Authentication (Bearer Token)
- **เอกสาร API**: สร้าง Swagger UI ให้โดยอัตโนมัติ
- **CORS**: ตั้งค่า CORS มาให้พร้อมใช้งาน
- **Health Check**: มี Endpoint สำหรับตรวจสอบสถานะ Server

### โครงสร้างโปรเจค
```
src/
├── controllers/    # ตัวจัดการ Route (API Endpoints)
├── services/       # ส่วนประมวลผล Logic ทางธุรกิจ
├── models/         # โครงสร้างข้อมูล (DTOs/Schemas)
├── guards/         # Middleware สำหรับตรวจสอบสิทธิ์
├── plugins/        # ปลั๊กอินเสริมต่างๆ
├── utils/          # ฟังก์ชันช่วยเหลือทั่วไป
├── types/          # Type Definitions ที่ใช้ร่วมกัน
└── index.ts        # จุดเริ่มต้นของโปรแกรม
```

### การเริ่มต้นใช้งาน

1. **สิ่งที่ต้องมี**
   - ติดตั้ง [Bun](https://bun.sh/) เรียบร้อยแล้ว

2. **การติดตั้ง**
   ```bash
   bun install
   ```

3. **การรันโปรเจค (Development)**
   รัน Server พร้อมระบบ Hot-reload:
   ```bash
   bun dev
   ```
   Server จะทำงานที่ `http://localhost:3000`

4. **ดูเอกสาร API**
   เข้าไปที่ `http://localhost:3000/swagger` เพื่อดูและทดสอบ API

### ตัวอย่างการใช้งาน

#### การสร้าง Route ใหม่
สร้างไฟล์ Controller ใหม่ใน `src/controllers/`:
```typescript
import { Elysia } from 'elysia';

export const userController = new Elysia({ prefix: '/users' })
  .get('/', () => ({ users: [] }));
```
จากนั้นนำไปลงทะเบียนใน `src/index.ts`

#### การใช้งาน Authentication (JWT)
1. **Login** เพื่อขอ Token:
   POST `/auth/login` ส่ง body `{ "username": "admin", "password": "password" }`
2. **การป้องกัน Route**:
   ใช้ `.use(authGuard)` และ `{ isAuth: true }`:
   ```typescript
   import { protectedController } from './controllers/protected.controller';
   // ...
   app.use(protectedController);
   ```
   ทดสอบโดยการส่ง Header: `Authorization: Bearer <your-token>`
