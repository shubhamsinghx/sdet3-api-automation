# API Test Cases — Reqres Users Collection

## Target API
- **Base URL**: `https://reqres.in/api/test-suite/collections/users`
- **Authentication**: `x-api-key` header

---

## TC-01: List All Users

| Field           | Value                          |
|-----------------|--------------------------------|
| **Method**      | GET                            |
| **Endpoint**    | `/records`                     |
| **Payload**     | N/A                            |
| **Expected Status** | 200                        |

**Assertions:**
- Response contains `data` array
- `total` is a number
- `page` equals 1
- `per_page` equals 20

---

## TC-02: Create New User

| Field           | Value                                                        |
|-----------------|--------------------------------------------------------------|
| **Method**      | POST                                                         |
| **Endpoint**    | `/records`                                                   |
| **Payload**     | `{ "name": "John Doe", "email": "john@example.com", "role": "tester" }` |
| **Expected Status** | 201                                                      |

**Assertions:**
- Response contains `id` (string)
- `name` == "John Doe"
- `email` == "john@example.com"
- `role` == "tester"
- `createdAt` exists
- `updatedAt` exists

---

## TC-03: Get Single User by ID

| Field           | Value                          |
|-----------------|--------------------------------|
| **Method**      | GET                            |
| **Endpoint**    | `/records/:id`                 |
| **Payload**     | N/A                            |
| **Expected Status** | 200                        |

**Assertions:**
- `id` matches the requested ID
- `name` == "John Doe"
- `email` == "john@example.com"
- Response schema includes `id`, `name`, `email`, `createdAt`, `updatedAt`

---

## TC-04: Update User

| Field           | Value                                          |
|-----------------|-------------------------------------------------|
| **Method**      | PUT                                             |
| **Endpoint**    | `/records/:id`                                  |
| **Payload**     | `{ "name": "John Updated", "role": "lead" }`   |
| **Expected Status** | 200                                         |

**Assertions:**
- `name` == "John Updated"
- `role` == "lead"
- `id` unchanged
- `updatedAt` is updated
- `createdAt` is preserved

---

## TC-05: Delete User

| Field           | Value                          |
|-----------------|--------------------------------|
| **Method**      | DELETE                         |
| **Endpoint**    | `/records/:id`                 |
| **Payload**     | N/A                            |
| **Expected Status** | 204                        |

**Assertions:**
- Response body is empty
- Subsequent GET for same ID returns 404

---

## E2E: Full User Lifecycle

Sequential test covering the complete CRUD lifecycle:

1. **Create** a user → verify 201 + all fields
2. **Read** the user → verify 200 + correct data
3. **Update** the user → verify 200 + changed fields
4. **Read** again → verify update persisted
5. **List** users → verify user appears in collection
6. **Delete** the user → verify 204
7. **Read** again → verify 404 (user gone)
