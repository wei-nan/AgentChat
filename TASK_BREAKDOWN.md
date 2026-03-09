# Task Breakdown - v2

This document breaks down the development of the AgentChat system into specific, actionable engineering tasks based on the updated `TECHNICAL_SPECIFICATIONS.md`.

---

## Backend (FastAPI)

### **Phase 1: Authentication Overhaul**
-   [x] **T1.1:** Update the `participants` database model: remove `api_key`, add `password_hash` and `type` fields.
-   [x] **T1.2:** Update the Alembic migration script to reflect the new `participants` table schema.
-   [x] **T1.3:** Implement password hashing utility (e.g., using `passlib`).
-   [x] **T1.4:** Create the `POST /auth/register` endpoint.
-   [x] **T1.5:** Create the `POST /auth/login` endpoint, including logic to generate and return a JWT.
-   [x] **T1.6:** Implement a new authentication dependency (`get_current_user`) to verify JWTs from the `Authorization` header.
-   [x] **T1.7:** Update all protected API endpoints (`/rooms`, `/rooms/{room_id}/messages`) to use the new JWT dependency instead of `X-API-Key`.

### **Phase 2: WebSocket Authentication Update**
-   [x] **T2.1:** Modify the WebSocket connection logic to accept and verify the JWT from a query parameter.
-   [x] **T2.2:** Update the `ConnectionManager` to associate connections with authenticated users from the JWT.

---

## Frontend (React)

### **Phase 3: Authentication Flow Implementation**
-   [x] **T3.1:** Update `AuthContext` to manage user state, including the JWT.
-   [x] **T3.2:** Modify `ApiService.js` to include the JWT in the `Authorization` header for all authenticated requests.
-   [x] **T3.3:** Create a new `RegisterScreen` component with a registration form.
-   [x] **T3.4:** Modify the `LoginScreen` component to handle username/password login and store the returned JWT in `AuthContext`.
-   [x] **T3.5:** Implement protected routing to ensure only authenticated users can access chat rooms.

### **Phase 4: Service and Component Updates**
-   [x] **T4.1:** Update `WebSocketService.js` to pass the JWT as a query parameter during connection.
-   [x] **T4.2:** Ensure all components that make API calls are correctly using the updated `ApiService.js` which now handles token-based authentication.

---
*Note: Previous phases are considered complete or are superseded by these new tasks.*
