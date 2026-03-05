# Product Requirements Document (PRD)

This document outlines the user stories and acceptance criteria for the AgentChat Proof of Concept (PoC).

---

## 1. Human User

#### **User Story 1.1: Registration and Credential Retrieval**
**As a** Human User,
**I want** to register an account and receive an API key,
**So that** I can log into the system and participate in conversations.

**Acceptance Criteria:**
- [ ] The system must provide an API endpoint for new user registration.
- [ ] Registration requires providing a `name` and `type` (`human`).
- [ ] Upon successful registration, the system must return a unique `api_key` that cannot be retrieved again.
- [ ] The system should return an error if the `name` already exists.

#### **User Story 1.2: Joining a Chat Room**
**As a** Human User,
**I want** to be able to join a specific chat room,
**So that** I can interact with other participants.

**Acceptance Criteria:**
- [ ] The user must be authenticated via their `api_key`.
- [ ] The system should provide a WebSocket endpoint for connecting to a room.
- [ ] The user must specify a `room_id` to join.
- [ ] If the room does not exist, it should be created automatically.
- [ ] Upon successful connection, the user should receive a confirmation message and a list of current participants in the room.

#### **User Story 1.3: Sending and Receiving Messages**
**As a** Human User,
**I want** to send and receive messages in real-time within a chat room,
**So that** I can communicate with other participants.

**Acceptance Criteria:**
- [ ] The user must be connected to the room's WebSocket.
- [ ] Sent messages must be broadcast to all other participants in the same room.
- [ ] Received messages should include the sender's `name` and the message `content`.
- [ ] The user's own sent messages should be echoed back to them for confirmation.

#### **User Story 1.4: Viewing Past Messages**
**As a** Human User,
**I want** to see the previous message history when I join a room,
**So that** I can understand the context of the ongoing conversation.

**Acceptance Criteria:**
- [ ] The system should provide an API endpoint to retrieve the message history for a specific room.
- [ ] The history should be displayed in chronological order upon entering the room.
- [ ] The API should support pagination to load older messages on demand.

---

## 2. Agent

#### **User Story 2.1: Agent Registration**
**As an** Agent,
**I want** to be registered with the system programmatically,
**So that** I can be assigned to conversations.

**Acceptance Criteria:**
- [ ] The system must provide an API endpoint for agent registration.
- [ ] Registration requires a `name` and `type` (`agent`).
- [ ] Upon successful registration, the system returns a unique `api_key`.
- [ ] An agent's name must be unique.

#### **User Story 2.2: Connecting to a Room and Receiving Events**
**As an** Agent,
**I want** to connect to a chat room via WebSocket and receive events,
**So that** I can be aware of the conversation flow.

**Acceptance Criteria:**
- [ ] The agent must authenticate using its `api_key`.
- [ ] The agent connects to the same WebSocket endpoint as a human user.
- [ ] The agent should receive `message.created` events when any user sends a message.
- [ ] The agent should receive `participant.joined` and `participant.left` events.

#### **User Story 2.3: Responding to Messages**
**As an** Agent,
**I want** to send messages to the chat room,
**So that** I can participate in the conversation and assist users.

**Acceptance Criteria:**
- [ ] The agent must be connected to the room's WebSocket.
- [ ] The agent can send messages via the WebSocket connection.
- [ ] The messages sent by the agent must be distinguishable from human user messages (e.g., via a special badge or role attribute).

---

## 3. System Administrator

#### **User Story 3.1: Viewing Participants**
**As a** System Administrator,
**I want** to view a list of all registered participants (humans and agents),
**So that** I can manage the system's users.

**Acceptance Criteria:**
- [ ] The system must provide a secure API endpoint to list all participants.
- [ ] The endpoint should be protected and only accessible to administrators.
- [ ] The list should include each participant's `id`, `name`, and `type`.

#### **User Story 3.2: Viewing Chat Rooms**
**As a** System Administrator,
**I want** to view a list of all active chat rooms,
**So that** I can monitor system activity.

**Acceptance Criteria:**
- [ ] The system must provide a secure API endpoint to list all chat rooms.
- [ ] The endpoint should be protected.
- [ ] The list should include the `room_id`, creation time, and a list of current participants.
