# Technical Specifications - v2

This document provides the detailed technical design for implementing the features defined in the `PRODUCT_REQUIREMENTS.md`.

---

## 1. API Endpoint Specifications

The API will be built using FastAPI.

### 1.1. `POST /auth/register`
-   **Description:** Registers a new participant.
-   **Request Body:**
    ```json
    {
      "name": "string",
      "password": "string",
      "type": "user" | "agent" | "admin"
    }
    ```
-   **Success Response (201):**
    ```json
    {
      "id": "uuid-string",
      "name": "string",
      "type": "string"
    }
    ```
-   **Error Response (409 Conflict):** If the participant name already exists.

### 1.2. `POST /auth/login`
-   **Description:** Authenticates a user and returns a JWT.
-   **Request Body:** (OAuth2 Form Data) `username=string&password=string`
-   **Success Response (200):**
    ```json
    {
      "access_token": "jwt-string",
      "token_type": "bearer"
    }
    ```
-   **Error Response (401 Unauthorized):** If credentials are invalid.

### 1.3. `GET /rooms/{room_id}/messages`
-   **Description:** Retrieves the message history for a specific room.
-   **Authentication:** Requires `Authorization: Bearer <token>` header.
-   ... (rest is unchanged)

---

## 2. WebSocket Communication

-   **Endpoint:** `ws://<host>/ws/{room_id}`
-   **Authentication:** The client must provide the `access_token` as a query parameter upon connection (e.g., `ws://.../ws/room1?token=jwt-string`).
-   ... (rest is unchanged)

---

## 3. Database Schema

### `participants`
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | Unique identifier for the participant. |
| `name` | VARCHAR(255) | NOT NULL, UNIQUE | Display name of the participant. |
| `password_hash`| VARCHAR(255) | NOT NULL | Hashed password. |
| `type` | VARCHAR(50) | NOT NULL | Type of participant. |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Timestamp of creation. |

... (other tables are unchanged)

---

## 4. Frontend Component Responsibilities

The frontend will be a single-page application built with React.

-   **`LoginScreen.js`**
    -   **Responsibility:** Handles user login.
    -   **State:** Manages input fields for `name` and `password`.
    -   **Actions:** Makes API calls to `/auth/login`. Stores the JWT in context/local storage.

-   **`RegisterScreen.js` (New)**
    -   **Responsibility:** Handles new user registration.
    -   **State:** Manages input fields for `name`, `password`, and confirmation.
    -   **Actions:** Makes API calls to `/auth/register`.

-   **`ChatRoom.js`**
    -   **Responsibility:** Main chat interface.
    -   **State:** Manages WebSocket connection, messages, participants.
    -   **Actions:** Initializes WebSocket with the JWT.
... (other components are largely unchanged but will use token for auth)

