# Online Study Meeting Rooms

A full-stack application for creating study/meeting rooms, joining with a room code, and chatting in real time.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Spring Boot, Java 17+ |
| Database | MySQL (`study_online_db`) |
| Security | Spring Security + JWT |
| Real-time | WebSocket (STOMP + SockJS) |
| API Docs | Swagger UI (`/swagger-ui.html`) |
| Frontend | React + Vite (`Frontend/src/`) |

## Project Structure

```
Online_Study_MeetingRooms/
├── Backend/OnlineBackend/
│   └── src/main/java/com/online/study_meet/
│       ├── Controller/          # REST + WebSocket controllers
│       ├── WebSocket/           # WebSocket config + JWT interceptor
│       ├── Service/             # Business logic
│       └── DTO/Message/         # Message DTOs
├── Frontend/
│   └── src/
│       ├── pages/               # Login, Dashboard, Room, etc.
│       └── services/
│           ├── messageService.jsx    # HTTP: chat history
│           └── websocketService.jsx  # WebSocket: live messaging
└── README.md
```

---

## WebSocket Implementation (What Was Done)

Previously, the **React frontend used HTTP only** for messaging (`POST /api/messages/.../send`), even though the backend had WebSocket set up. Messages were not real-time — users had to refresh the page to see new messages.

### Problem

| Before | Issue |
|--------|-------|
| Frontend sends via HTTP | No real-time updates |
| Backend WebSocket existed | Not connected from React |
| Global topic `/topic/messages` | All rooms shared one channel |
| WebSocket had no JWT auth | Sender showed as "Anonymous" |
| WebSocket did not save to DB | Messages lost on refresh |

### Solution

WebSocket was wired up end-to-end: React client, room-scoped topics, JWT auth, and DB persistence.

#### Frontend changes

| File | What it does |
|------|--------------|
| `Frontend/src/services/websocketService.jsx` | **New file.** Creates a STOMP client over SockJS. Connects to `/ws` with JWT, subscribes to `/topic/room/{roomCode}`, sends to `/app/chat.send`. |
| `Frontend/src/pages/Room.jsx` | Loads chat history via HTTP on mount, then connects WebSocket for live send/receive. Deduplicates messages by `id`. |
| `Frontend/vite.config.js` | Added `global: "globalThis"` so `sockjs-client` works in Vite. |

#### Backend changes

| File | What it does |
|------|--------------|
| `ChatController.java` | Receives WebSocket messages, saves them via `MessageService`, broadcasts to `/topic/room/{roomCode}`. |
| `ChatSendRequest.java` | **New DTO.** Payload: `{ "roomCode": "...", "content": "..." }`. |
| `WebSocketAuthInterceptor.java` | **New file.** Reads JWT from STOMP `CONNECT` headers and sets the authenticated user. |
| `WebSocketConfig.java` | Registers the JWT interceptor on the inbound channel. |

### How messaging works now

```
1. User opens a room
   └── HTTP GET /api/messages/{roomCode}/messages  →  load past messages

2. WebSocket connects
   └── SockJS → http://localhost:8088/ws
   └── Header: Authorization: Bearer <jwt-token>
   └── Subscribe: /topic/room/{roomCode}

3. User sends a message
   └── Publish to: /app/chat.send
   └── Body: { "roomCode": "abc-123", "content": "Hello!" }

4. Backend receives it
   └── Validates JWT → gets username
   └── Saves message to MySQL
   └── Broadcasts to /topic/room/{roomCode}

5. All users in that room see the message instantly
```

### WebSocket API

| Type | Path | Description |
|------|------|-------------|
| Connect | `/ws` | SockJS/STOMP handshake (pass JWT in `Authorization` header) |
| Send | `/app/chat.send` | Publish a message `{ roomCode, content }` |
| Subscribe | `/topic/room/{roomCode}` | Receive messages for a specific room |

**Send payload example:**

```json
{
  "roomCode": "abc-123-uuid",
  "content": "Hello everyone!"
}
```

**Received message example:**

```json
{
  "id": 1,
  "content": "Hello everyone!",
  "senderUsername": "john",
  "createdAt": "2026-08-22T14:30:00"
}
```

### Dependencies used (already in package.json)

- `@stomp/stompjs` — STOMP protocol client
- `sockjs-client` — WebSocket fallback transport

---

## Progress So Far

### Done

- User authentication (register, login, JWT)
- Room management (create, join, leave, list mine)
- Messaging via REST (send + get history)
- **React frontend with real-time WebSocket chat**
- **Room-scoped WebSocket topics**
- **JWT authentication on WebSocket connect**
- **Messages persisted to DB via WebSocket**
- Swagger API docs

### In Progress / Next Steps

- Room password validation on join
- Get room details / list members
- Update or delete room (owner only)
- Leave room API call from frontend
- Auto-scroll chat to latest message
- Connection status indicator (connected / disconnected)

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

### Messages — `/api/messages`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/messages/{roomCode}/send` | Send a message (REST — still available) |
| GET | `/api/messages/{roomCode}/messages` | Get chat history (used on room load) |

> **Note:** The React app uses **WebSocket** to send messages and **HTTP** only to load history when entering a room.

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

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

App runs on **http://localhost:3000**.

### Test real-time chat

1. Register two users (e.g. in two browser windows or incognito tabs).
2. Log in as User A → create a room → note the room code.
3. Log in as User B → join the room with that code.
4. Both users open the room — messages appear instantly without refresh.

---

## Entity Relations

```
User ──owns──> Room
User <──members──> Room   (room_members join table)
Room ──has──> Message
```

See `Backend/OnlineBackend/ENTITY_RELATIONS.md` for more detail.
