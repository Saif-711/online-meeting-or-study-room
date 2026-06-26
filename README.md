# Online Study Meeting Rooms

A full-stack application for creating study/meeting rooms, joining with a room code, and chatting in real time.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Spring Boot 4.1, Java 17+ |
| Database | MySQL (`study_online_db`) |
| Security | Spring Security + JWT |
| Real-time | WebSocket (STOMP + SockJS) |
| API Docs | Swagger UI (`/swagger-ui.html`) |
| Frontend | Basic HTML + SockJS/STOMP (`Frontend/chat.html`) |

## Project Structure

```
Online_Study_MeetingRooms/
├── Backend/OnlineBackend/     # Spring Boot REST API
├── Frontend/chat.html         # Simple WebSocket chat demo
└── README.md
```

## Progress So Far

### Done

- **User authentication**
  - Register and login
  - JWT token returned on login
  - Protected routes for all `/api/**` except auth

- **Room management**
  - Create a room (owner is added as a member)
  - Join a room by `roomCode`
  - Leave a room
  - List current user's rooms (`GET /api/rooms/mine`)

- **Messaging (REST)**
  - Send a message to a room
  - Get chat history for a room

- **WebSocket chat**
  - STOMP endpoint at `/ws`
  - Send messages via `/app/chat.send`
  - Subscribe to `/topic/messages`

- **Database models**
  - `User`, `Room`, `Message`
  - Many-to-many: users ↔ room members (`room_members`)
  - Room owner, optional room password field

- **Swagger**
  - API documentation available at `http://localhost:8088/swagger-ui.html`

### In Progress / Next Steps

- Full frontend UI (login, room list, join/create room)
- Room password validation on join
- Get room details / list members
- Update or delete room (owner only)
- Room-scoped WebSocket topics (messages per room, not global)

---

## API Endpoints

Base URL: `http://localhost:8088`

All endpoints below except **Auth** require:

```
Authorization: Bearer <jwt-token>
```

### Auth — `/api/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Rooms — `/api/rooms`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/rooms/create` | Create a new room |
| POST | `/api/rooms/{roomCode}/join` | Join a room |
| POST | `/api/rooms/{roomCode}/leave` | Leave a room |
| GET | `/api/rooms/mine` | List rooms for the logged-in user |

**Example — GET `/api/rooms/mine` response:**

```json
[
  { "roomCode": "abc-123-uuid", "roomName": "Math Study Group" }
]
```

### Messages — `/api/messages`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/messages/{roomCode}/send` | Send a message |
| GET | `/api/messages/{roomCode}/messages` | Get chat history |

### WebSocket

| Type | Path | Description |
|------|------|-------------|
| Connect | `/ws` | SockJS/STOMP handshake |
| Send | `/app/chat.send` | Publish a chat message |
| Subscribe | `/topic/messages` | Receive broadcast messages |

---

## Database Setup

1. Create MySQL database:

```sql
CREATE DATABASE study_online_db;
```

2. Configure `Backend/OnlineBackend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/study_online_db
spring.datasource.username=root
spring.datasource.password=<your-password>
```

3. Tables are created automatically (`spring.jpa.hibernate.ddl-auto=update`).

---

## How to Run

### Backend

```bash
cd Backend/OnlineBackend
mvn spring-boot:run
```

Server runs on **port 8088**.

### Frontend (WebSocket demo)

Open `Frontend/chat.html` in a browser (or serve it locally). It connects to `http://localhost:8088/ws`.

### Quick test flow

1. `POST /api/auth/register` — create a user
2. `POST /api/auth/login` — copy the JWT token
3. `POST /api/rooms/create` — create a room (with `Authorization: Bearer <token>`)
4. `GET /api/rooms/mine` — see your rooms
5. `POST /api/rooms/{roomCode}/join` — join with another user
6. `POST /api/messages/{roomCode}/send` — send a message

---

## Entity Relations

```
User ──owns──> Room
User <──members──> Room   (room_members join table)
Room ──has──> Message
```

See `Backend/OnlineBackend/ENTITY_RELATIONS.md` for more detail.
