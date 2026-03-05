# Task Breakdown

This document breaks down the development of the AgentChat PoC into specific, actionable engineering tasks based on the `TECHNICAL_SPECIFICATIONS.md`.

---

## Backend (FastAPI)

### **Phase 1: Project Setup & Core Models**
-   [ ] **T1.1:** Initialize FastAPI project using Poetry for dependency management.
-   [ ] **T1.2:** Create the basic project structure (e.g., `app/`, `app/api`, `app/models`, `app/db`).
-   [ ] **T1.3:** Define Pydantic models for `Participant`, `Room`, and `Message` schemas (request/response).
-   [ ] **T1.4:** Set up database connection using SQLAlchemy and asyncpg.
-   [ ] **T1.5:** Configure Alembic for database migrations and create the initial migration script to generate the `participants`, `rooms`, and `messages` tables.

### **Phase 2: API Endpoints & Business Logic**
-   [ ] **T2.1:** Implement the `POST /participants` endpoint for user and agent registration.
    -   [ ] **T2.1.1:** Add logic to hash the generated `api_key` before storing it in the database.
    -   [ ] **T2.1.2:** Add a dependency for API key authentication (`X-API-Key` header).
-   [ ] **T2.2:** Implement the `GET /rooms/{room_id}/messages` endpoint.
    -   [ ] **T2.2.1:** Include logic for pagination using `limit` and `offset` query parameters.
-   [ ] **T2.3:** Implement robust error handling for API endpoints (e.g., 404, 409, 422).

### **Phase 3: WebSocket Implementation**
-   [ ] **T3.1:** Create the WebSocket endpoint `ws://<host>/ws/{room_id}`.
-   [ ] **T3.2:** Implement a `ConnectionManager` class to handle active connections for each room.
-   [ ] **T3.3:** Implement authentication for the WebSocket connection using the `api_key` from the URL.
-   [ ] **T3.4:** Implement broadcasting logic for `message.created`, `participant.joined`, and `participant.left` events.
-   [ ] **T3.5:** Implement the handler for the client-side `message.create` event, which saves the message to the database and then broadcasts it.

---

## Frontend (React)

### **Phase 4: Project Setup & Core Services**
-   [ ] **T4.1:** Initialize the React project using Vite or Create React App.
-   [ ] **T4.2:** Plan and create the project directory structure (`src/components`, `src/services`, `src/contexts`, `src/hooks`).
-   [ ] **T4.3:** Implement a global `AuthContext` to manage participant state (`name`, `api_key`).
-   [ ] **T4.4:** Create an `ApiService.js` module to handle all HTTP requests to the backend.
-   [ ] **T4.5:** Create a `WebSocketService.js` service to manage the WebSocket connection, including connection, disconnection, and event handling logic.

### **Phase 5: Component Implementation**
-   [ ] **T5.1:** Implement the `LoginScreen` component.
    -   [ ] **T5.1.1:** Add form for user registration (`name`).
    -   [ ] **T5.1.2:** Handle API call to `/participants` and store credentials in `AuthContext`.
-   [ ] **T5.2:** Implement the `ChatRoom` component.
    -   [ ] **T5.2.1:** Use a URL parameter (e.g., `/room/:roomId`) to determine which room to join.
    -   [ ] **T5.2.2:** Fetch initial message history using `ApiService.js`.
    -   [ ] **T5.2.3:** Establish WebSocket connection using `WebSocketService.js` on component mount.
-   [ ] **T5.3:** Implement the `MessageList` component to render messages.
    -   [ ] **T5.3.1:** Add auto-scrolling to the bottom when new messages arrive.
-   [ ] **T5.4:** Implement the `MessageInput` component for typing and sending messages.
-   [ ] **T5.5:** Implement a `ParticipantList` component to display currently connected users.

### **Phase 6: Integration & Final Touches**
-   [ ] **T6.1:** Implement routing (e.g., using `react-router-dom`) to handle navigation between the login screen and chat rooms.
-   [ ] **T6.2:** Add basic styling to make the interface usable.
-   [ ] **T6.3:** Test the end-to-end flow: registration, joining a room, sending/receiving messages, and viewing history.
