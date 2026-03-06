# AgentChat

AgentChat is a modern, real-time messaging application built with FastAPI and Vue.js. It features a clean, intuitive interface, secure authentication, and real-time messaging capabilities.

## Features

- **Real-time Messaging**: Instant message delivery using WebSockets.
- **User Authentication**: Secure login and registration system.
- **Chat Interface**: Clean and responsive chat UI.
- **Message History**: Persistent storage of all conversations.

## Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [SQLAlchemy](https://www.sqlalchemy.org/)
- **WebSockets**: Real-time communication.
- **Authentication**: Password hashing and session management.

### Frontend
- **Framework**: [Vue.js](https://vuejs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Custom CSS for a modern look.

## Prerequisites

- **Python** 3.12 or higher
- **Node.js** 18 or higher
- **PostgreSQL** 13 or higher

## Installation

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    poetry install
    ```

3.  Configure the database:
    - Create a `.env` file in the `backend` directory based on `.env.example`.
    - Update the `DATABASE_URL` with your PostgreSQL connection string.

4.  Run database migrations:
    ```bash
    alembic upgrade head
    ```

5.  Start the development server:
    ```bash
    uvicorn backend.main:app --reload
    ```

### 2. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

## Usage

Once both the backend and frontend are running:

1.  Open your browser and navigate to `http://localhost:5173` (or the port Vite is running on).
2.  Register a new account or log in with existing credentials.
3.  Start chatting!

## Project Structure

```
AgentChat/
├── backend/          # FastAPI backend application
│   ├── app/
│   │   ├── api/        # API endpoints
│   │   ├── core/       # Core configuration
│   │   ├── db/         # Database models and session
│   │   ├── models/     # SQLAlchemy models
│   │   ├── schemas/    # Pydantic schemas
│   │   └── main.py     # Application entry point
│   ├── alembic/        # Database migrations
│   └── pyproject.toml  # Project dependencies
├── frontend/         # Vue.js frontend application
│   ├── src/
│   │   ├── components/ # Vue components
│   │   ├── services/   # API services
│   │   ├── views/      # Page views
│   │   └── App.vue     # Main application component
│   ├── index.html      # Entry point
│   └── package.json    # Project dependencies
└── README.md           # Project documentation
```

## License

This project is licensed under the terms of the MIT license.