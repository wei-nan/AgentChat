# Technical Specifications

This document provides the detailed technical design for implementing the features defined in the `PRODUCT_REQUIREMENTS.md`.

---

## 1. API Endpoint Specifications

The API will be built using FastAPI.

### 1.1. `POST /participants`
-   **Description:** Registers a new participant (human or agent).
-   **Request Body:**
    ```json
    {
      "name": "string",
      "type": "human" | "agent"
    }
    ```
-   **Success Response (201):**
    ```json
    {
      "participant_id": "uuid-string",
      "name": "string",
      "api_key": "unique-api-key-string"
    }
    ```
-   **Error Response (409 Conflict):** If the participant name already exists.
    ```json
    {
      "detail": "Participant name already exists"
    }
    ```

### 1.2. `GET /rooms/{room_id}/messages`
-   **Description:** Retrieves the message history for a specific room.
-   **Authentication:** Requires `X-API-Key` header.
-   **Query Parameters:**
    -   `limit` (integer, default: 50): Number of messages to return.
    -   `offset` (integer, default: 0): Number of messages to skip (for pagination).
-   **Success Response (200):**
    ```json
    [
      {
        "message_id": "uuid-string",
        "room_id": "uuid-string",
        "author_id": "uuid-string",
        "author_name": "string",
        "content": "string",
        "created_at": "iso-8601-datetime"
      }
    ]
    ```
-   **Error Response (401 Unauthorized):** If the API key is invalid or missing.

---

## 2. WebSocket Communication

-   **Endpoint:** `ws://<host>/ws/{room_id}`
-   **Connection URL Parameters:**
    -   `api_key` (string): The participant's API key for authentication.
-   The server will handle different event types. All messages are JSON formatted.

### 2.1. Client-to-Server Events
-   **Send Message:**
    ```json
    {
      "event": "message.create",
      "payload": {
        "content": "Hello, world!"
      }
    }
    ```

### 2.2. Server-to-Client Events
-   **Connection Acknowledged:** Sent to a client upon successful connection.
    ```json
    {
      "event": "system.connected",
      "payload": {
        "room_id": "uuid-string",
        "participants": [
          { "participant_id": "uuid-string", "name": "string" }
        ]
      }
    }
    ```
-   **New Message:** Broadcast to all clients in a room when a message is sent.
    ```json
    {
      "event": "message.created",
      "payload": {
        "message_id": "uuid-string",
        "author_id": "uuid-string",
        "author_name": "string",
        "content": "Hello, world!",
        "created_at": "iso-8601-datetime"
      }
    }
    ```
-   **Participant Joined:**
    ```json
    {
      "event": "participant.joined",
      "payload": {
        "participant_id": "uuid-string",
        "name": "string"
      }
    }
    ```
-   **Participant Left:**
    ```json
    {
      "event": "participant.left",
      "payload": {
        "participant_id": "uuid-string",
        "name": "string"
      }
    }
    ```

---

## 3. Database Schema

We will use a PostgreSQL database with the following table structures.

### `participants`
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | Unique identifier for the participant. |
| `name` | VARCHAR(255) | NOT NULL, UNIQUE | Display name of the participant. |
| `type` | VARCHAR(50) | NOT NULL | Type of participant ('human' or 'agent'). |
| `api_key`| VARCHAR(255) | NOT NULL, UNIQUE | Hashed API key for authentication. |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Timestamp of creation. |

### `rooms`
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | Unique identifier for the chat room. |
| `name` | VARCHAR(255) | NULL | Optional friendly name for the room. |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Timestamp of creation. |

### `messages`
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | Unique identifier for the message. |
| `room_id` | UUID | NOT NULL, FOREIGN KEY (rooms.id) | The room where the message was sent. |
| `author_id` | UUID | NOT NULL, FOREIGN KEY (participants.id) | The participant who sent the message. |
| `content` | TEXT | NOT NULL | The content of the message. |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Timestamp of creation. |

---

## 4. Frontend Component Responsibilities

The frontend will be a single-page application built with React.

-   **`LoginScreen.js`**
    -   **Responsibility:** Handles user registration and login.
    -   **State:** Manages input fields for `name` and the retrieved `api_key`.
    -   **Actions:** Makes API calls to the `/participants` endpoint. Stores the `api_key` and `name` in local storage or context upon success.

-   **`ChatRoom.js`**
    -   **Responsibility:** The main component that orchestrates the chat interface.
    -   **State:** Manages the WebSocket connection status, the list of messages, and the list of participants.
    -   **Actions:** Initializes the WebSocket connection, fetches initial message history, and renders the `MessageList` and `MessageInput` components.

-   **`MessageList.js`**
    -   **Responsibility:** Renders the list of messages.
    -   **Props:** Receives the `messages` array from `ChatRoom.js`.
    -   **Actions:** Scrolls to the latest message automatically.

-   **`MessageInput.js`**
    -   **Responsibility:** Provides a text input field and a send button.
    -   **State:** Manages the content of the message being typed.
    -   **Actions:** On send, it emits the `message.create` event through the WebSocket connection managed by its parent.
