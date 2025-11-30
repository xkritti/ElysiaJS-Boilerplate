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

### Standardized Response Handling

This boilerplate includes a global middleware that automatically standardizes all API responses.

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": { ... },
  "timestamp": "2023-11-30T..."
}
```

**Error Response:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error Message",
  "error": { ...details... },
  "timestamp": "2023-11-30T..."
}
```

**How to use:**
- **Success**: Just return your data object. The middleware wraps it automatically.
- **Custom Success**: Use `return success(data, 201, 'Created')`.
- **Business Logic Failure**: Use `return fail('Invalid Input', 400)`.
- **System Error**: Use `throw new AppError('Critical Error', 500)`.

See [docs/RESPONSE_HANDLING.md](docs/RESPONSE_HANDLING.md) for more details.

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
   Use the `.use(authGuard)` middleware:
   ```typescript
   import { authGuard } from '../guards/auth.guard';
   
   export const protectedController = new Elysia({ prefix: '/protected' })
     .use(authGuard) // Protects all routes below
     .get('/', () => ({ message: 'Access Granted' }));
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
- **Standardized Response**: ระบบจัดการ Response และ Error แบบมาตรฐานเดียวกันทั้งโปรเจค
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
├── middlewares/    # Global Middleware (Response, Error Handling)
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

### ระบบจัดการ Response (Standardized Response)

โปรเจคนี้มี Middleware ที่ช่วยจัดการรูปแบบการตอบกลับให้เป็นมาตรฐานเดียวกันโดยอัตโนมัติ

**รูปแบบเมื่อสำเร็จ (Success):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": { ... },
  "timestamp": "2023-11-30T..."
}
```

**รูปแบบเมื่อเกิดข้อผิดพลาด (Error):**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error Message",
  "error": { ...details... },
  "timestamp": "2023-11-30T..."
}
```

**วิธีใช้งาน:**
- **กรณีปกติ**: `return` ข้อมูลออกไปได้เลย ระบบจะห่อให้อัตโนมัติ
- **กำหนด Message เอง**: ใช้ `return success(data, 201, 'Created')`
- **Business Logic ไม่ผ่าน**: ใช้ `return fail('ข้อมูลไม่ถูกต้อง', 400)`
- **System Error**: ใช้ `throw new AppError('Database Error', 500)`

ดูรายละเอียดเพิ่มเติมได้ที่ [docs/RESPONSE_HANDLING.md](docs/RESPONSE_HANDLING.md)

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
   ใช้ `.use(authGuard)`:
   ```typescript
   import { authGuard } from '../guards/auth.guard';
   
   export const protectedController = new Elysia({ prefix: '/protected' })
     .use(authGuard) // ป้องกันทุก Route ด้านล่างนี้
     .get('/', () => ({ message: 'เข้าถึงข้อมูลได้' }));
   ```
   ทดสอบโดยการส่ง Header: `Authorization: Bearer <your-token>`
