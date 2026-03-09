# Product Requirements Document (PRD) - v2

This document outlines the user stories and acceptance criteria for the AgentChat system.

---

## 1. Human User

#### **User Story 1.1: Account Registration**
**As a** new Human User,
**I want** to register an account with a username and password,
**So that** I can create my identity in the system.

**Acceptance Criteria:**
- [ ] The system must provide a registration page or API endpoint (`/auth/register`).
- [ ] Registration requires providing a unique `name` and a `password`.
- [ ] Upon successful registration, the system should confirm the creation of the account.
- [ ] The system should return an error if the `name` already exists.

#### **User Story 1.2: User Login**
**As a** registered Human User,
**I want** to log in with my username and password,
**So that** I can access the chat application.

**Acceptance Criteria:**
- [ ] The system must provide a login page or API endpoint (`/auth/login`).
- [ ] Upon successful login, the system must return an `access_token` (JWT).
- [ ] This token will be used for authenticating all subsequent actions.

#### **User Story 1.3: Joining a Chat Room**
**As a** logged-in Human User,
**I want** to be able to join a specific chat room,
**So that** I can interact with other participants.

**Acceptance Criteria:**
- [ ] The user must be authenticated via their `access_token`.
- [ ] The system should provide a WebSocket endpoint for connecting to a room.
- [ ] The user must specify a `room_id` to join.
- [ ] Upon successful connection, the user should receive a confirmation and a list of current participants.

#### **User Story 1.4: Sending and Receiving Messages**
(No change from v1)

#### **User Story 1.5: Viewing Past Messages**
(No change from v1, but authentication method is updated)

---

## 2. Agent

#### **User Story 2.1: Agent Account Creation**
**As a** System Administrator,
**I want** to create Agent accounts with a username and password,
**So that** agents can be assigned to conversations.

**Acceptance Criteria:**
- [ ] The registration process should allow specifying the `type` as `agent`.
- [ ] An agent's name must be unique.

#### **User Story 2.2: Connecting to a Room and Receiving Events**
**As an** Agent,
**I want** to connect to a chat room via WebSocket using my credentials,
**So that** I can be aware of the conversation flow.

**Acceptance criteria:**
- [ ] The agent must authenticate using its `access_token`, obtained via login.
- [ ] ... (rest of the criteria are the same)

#### **User Story 2.3: Responding to Messages**
(No change from v1, but authentication method is updated)

---

## 3. System Administrator

(No change from v1, but authentication method is updated for all endpoints)

