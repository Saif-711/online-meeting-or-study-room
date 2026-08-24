# Frontend MVP Roadmap

Step-by-step guide to building the React frontend against the Spring Boot backend.  
**Instructions only — no code.** Tick each box as you complete it.

**Backend base URL:** `http://localhost:8088`  
**Frontend dev server:** `http://localhost:3000`  
**Swagger UI:** `http://localhost:8088/swagger-ui.html`

---

## How to use this document

1. Work phases **in order** — each phase depends on the previous checkpoint passing.
2. After every step, run the **Verify** action before moving on.
3. Use the **Progress tracker** at the bottom to see where you are.
4. If something breaks, go back to the last checkpoint that passed and fix it there first.

**Dependency rule:** Do not start Phase N until Checkpoint N-1 passes.

---

## You are here (current project state)

> **Approximate position: between Phase 6 and Phase 7**
>
> Most core features exist. Remaining work is polish, missing edge cases, and cleanup.

| Area | Status |
|------|--------|
| Routing in App.jsx | Done |
| AuthContext + ProtectedRoute | Done (no useAuth hook yet) |
| Login / Register with real API | Done |
| Dashboard (list rooms) | Done |
| Create Room | Partial — no redirect to room after create |
| Join Room | Done (separate JoinRoom page) |
| Room chat | Done — REST history + WebSocket live messages |
| WebSocket (Phase 8) | Done — per-room topic `/topic/room/{roomCode}` |
| NotFound page | Missing |
| Leave room API wired | Missing (TODO in Room.jsx) |
| Bootstrap CSS imported | Missing |
| Shared API config / 401 handler | Missing |
| Test.jsx / debug leftovers | Removed |

---

## Phase 0 — Fix foundation before building features

**Goal:** App boots cleanly, all routes resolve, auth guard works, styles load.

| Step | What to do | File(s) | Verify |
|------|-----------|---------|--------|
| 0.1 | Start backend (`mvn spring-boot:run` in Backend/OnlineBackend) | — | Swagger UI opens at port 8088 |
| 0.2 | Start frontend (`npm run dev` in Frontend) | — | Browser shows app at port 3000 |
| 0.3 | Import Bootstrap CSS once in the entry file | `src/main.jsx` | Forms and buttons look styled |
| 0.4 | Keep one auth provider — use `AuthContext.jsx` only; remove any duplicate or missing `AuthProviders` imports | `src/context/AuthContext.jsx`, any page importing auth | No import errors in terminal |
| 0.5 | Add a `useAuth` hook that wraps `useContext(AuthContext)` | `src/context/AuthContext.jsx` | Pages can import `useAuth` instead of raw context |
| 0.6 | Confirm `ProtectedRoute` redirects to `/login` when token is missing or expired | `src/routes/ProtectedRoute.jsx` | Visit `/dashboard` without token → redirected |
| 0.7 | Confirm `App.jsx` defines all routes (login, register, dashboard, create-room, join-room, room/:roomCode) | `src/App.jsx` | Each URL loads without "module not found" |
| 0.8 | Confirm `BrowserRouter` wraps the app once (in `main.jsx`, not duplicated in App) | `src/main.jsx` | No router nesting warnings in console |

**Test recipe — Phase 0**
1. Open app with no token → you should see Login.
2. Manually go to `/dashboard` → redirected to `/login`.
3. UI should look styled (after Bootstrap import).

**Checkpoint 0:** App boots, all routes load, login page renders with styles, protected routes guard correctly.

- [ ] Checkpoint 0 passed

---

## Phase 1 — API layer (services, no UI yet)

**Goal:** All backend calls go through service files with a shared base URL and token handling.

| Service file | Backend endpoints | Notes |
|-------------|-------------------|-------|
| `AuthService.jsx` | POST /api/auth/register, POST /api/auth/login | Login returns token, username, email |
| `roomService.jsx` | POST /api/rooms/create, POST /api/rooms/{roomCode}/join, POST /api/rooms/{roomCode}/leave, GET /api/rooms/mine, GET /api/rooms/{roomCode} | All need Bearer token |
| `messageService.jsx` | GET /api/messages/{roomCode}/messages, POST /api/messages/{roomCode}/send | Send body is plain text string |
| `websocketService.jsx` | WebSocket connect /ws, send /app/chat.send, subscribe /topic/room/{roomCode} | JWT in CONNECT headers |
| `config/api.js` (optional) | Shared base URL constant | Single place to change port/host |

**What to do**

| Step | What to do | File(s) | Verify |
|------|-----------|---------|--------|
| 1.1 | Create a config file with base URL `http://localhost:8088` | `src/config/api.js` | All services import from one place |
| 1.2 | Confirm auth service calls register and login | `src/services/AuthService.jsx` | Register + login return data in Network tab |
| 1.3 | Confirm room service covers create, join, leave, mine, get details | `src/services/roomService.jsx` | Each call returns expected shape |
| 1.4 | Confirm message service covers history and send | `src/services/messageService.jsx` | GET returns array; POST returns saved message |
| 1.5 | Remove any hardcoded JWT tokens or hardcoded room UUIDs | all services | Grep project for hardcoded bearer strings — none found |
| 1.6 | Add global 401 handling — if any API returns 401, clear token and redirect to login | config or axios interceptor | Expired token triggers logout |

**Test recipe — Phase 1**
1. Log in via Swagger or UI, copy token.
2. Call GET /api/rooms/mine in browser devtools or Swagger — returns room list.
3. Call GET /api/messages/{roomCode}/messages — returns message array.

**Checkpoint 1:** Every service function returns real backend data; no hardcoded credentials.

- [ ] Checkpoint 1 passed

---

## Phase 2 — Register page

**Goal:** New users can sign up from the UI.

**File:** `src/pages/Register.jsx`

| Step | What to do | Backend | Verify |
|------|-----------|---------|--------|
| 2.1 | Form fields: username, email, password | — | All three fields present |
| 2.2 | On submit, call register service | POST /api/auth/register | Network tab shows 201 |
| 2.3 | On success, redirect to `/login` | — | Lands on login page |
| 2.4 | On error (duplicate email/username), show error message | — | Red error text appears |
| 2.5 | Add link to Login page (and Login links back to Register) | — | Can navigate both ways |

**Test recipe — Phase 2**
1. Register user "alice@test.com".
2. Try registering same email again → error shown.
3. Register succeeds → redirected to login.

**Checkpoint 2:** New user registers in UI, appears in database, can log in.

- [ ] Checkpoint 2 passed

---

## Phase 3 — Login page (connect real auth)

**Goal:** Login stores a real JWT and unlocks protected routes.

**File:** `src/pages/Login.jsx`

| Step | What to do | Backend | Verify |
|------|-----------|---------|--------|
| 3.1 | Use **email** field (not username) — backend login expects email | — | Field label says Email |
| 3.2 | On submit, call login service | POST /api/auth/login | Returns token |
| 3.3 | Save token via auth context `login(token)` | — | localStorage has key "token" |
| 3.4 | Optionally store username and email in context or localStorage | — | Available for display in dashboard |
| 3.5 | Redirect to `/dashboard` on success | — | Dashboard loads |
| 3.6 | Show error on wrong password or unknown email | — | Red error text appears |
| 3.7 | Show loading state while request is in flight | — | Button disabled during login |

**Test recipe — Phase 3**
1. Login with wrong password → error shown, stays on login.
2. Login with correct credentials → dashboard loads.
3. Refresh page on dashboard → still logged in (token in localStorage).

**Checkpoint 3:** Login stores real JWT; protected routes become accessible.

- [ ] Checkpoint 3 passed

---

## Phase 4 — Dashboard (my rooms hub)

**Goal:** User sees their rooms and can navigate to create, join, or enter a room.

**File:** `src/pages/Dashboard.jsx`

| Step | What to do | Backend | Verify |
|------|-----------|---------|--------|
| 4.1 | On page load, fetch user's rooms | GET /api/rooms/mine | Room list renders |
| 4.2 | Display each room: name + room code | — | Cards or rows visible |
| 4.3 | "Enter Room" button navigates to `/room/{roomCode}` | — | Opens room page |
| 4.4 | "Create Room" button navigates to `/create-room` | — | Opens create form |
| 4.5 | "Join Room" button navigates to `/join-room` (or inline join form on dashboard) | POST /api/rooms/{roomCode}/join | Join succeeds |
| 4.6 | After join success, refresh room list or navigate to room | — | New room appears or room opens |
| 4.7 | Logout button clears token and goes to `/login` | — | Token removed; cannot access dashboard |
| 4.8 | Empty state message when user has no rooms | — | Friendly message shown |

**Test recipe — Phase 4**
1. Login → dashboard shows your rooms (or empty state).
2. Click Create Room → form opens.
3. Click Join Room → join form opens.
4. Logout → back to login, dashboard blocked.

**Checkpoint 4:** User sees their rooms, can join by code, can open a room.

- [ ] Checkpoint 4 passed

---

## Phase 5 — Create Room page

**Goal:** User creates a room and enters it immediately.

**File:** `src/pages/CreateRoom.jsx`

| Step | What to do | Backend | Verify |
|------|-----------|---------|--------|
| 5.1 | Form: room name (required), description (optional), password (optional) | — | Fields present |
| 5.2 | On submit, call create room service | POST /api/rooms/create | Returns roomCode |
| 5.3 | On success, redirect to `/room/{roomCode}` using returned roomCode | — | Lands inside new room |
| 5.4 | Cancel or Back button returns to dashboard | — | Navigates to /dashboard |
| 5.5 | Show error if create fails | — | Error message visible |

**Known limitation:** Backend stores room password but does not validate it on join yet. Password field is optional for MVP.

**Test recipe — Phase 5**
1. Create room "Math Study" → redirected into room.
2. Go to dashboard → new room appears in list.

**Checkpoint 5:** User creates a room and lands inside it.

- [ ] Checkpoint 5 passed

---

## Phase 6 — Room page (chat)

**Goal:** Two users in the same room can read history and send messages in real time.

**File:** `src/pages/Room.jsx`  
**Route param:** `/room/:roomCode`

| Step | What to do | Backend | Verify |
|------|-----------|---------|--------|
| 6.1 | Read roomCode from URL params | — | Correct room loads |
| 6.2 | Fetch room details for header (name, owner, member count) | GET /api/rooms/{roomCode} | Header shows room info |
| 6.3 | Fetch chat history on page load | GET /api/messages/{roomCode}/messages | Old messages appear |
| 6.4 | Render each message: sender username, content, timestamp | — | Messages readable |
| 6.5 | Message input + Send button | WebSocket /app/chat.send (preferred) or REST POST /api/messages/{roomCode}/send | Message appears in chat |
| 6.6 | After send, message appears without page refresh | WebSocket subscribe /topic/room/{roomCode} | Live update works |
| 6.7 | Deduplicate messages if same id arrives twice | — | No duplicate rows |
| 6.8 | "Leave Room" button calls leave API then goes to dashboard | POST /api/rooms/{roomCode}/leave | User removed from room |
| 6.9 | "Back to Dashboard" link | — | Navigates to /dashboard |
| 6.10 | Handle not-member and room-not-found errors | — | Friendly error, redirect if needed |
| 6.11 | Disconnect WebSocket when leaving the page (cleanup in useEffect return) | — | No memory leaks; no duplicate connections |

**Test recipe — Phase 6**
1. User A creates room, sends "hello".
2. User B joins same room (second browser/incognito).
3. User B sees "hello" in history.
4. User B sends "hi back" → User A sees it instantly without refresh.
5. User A leaves room → removed from members; dashboard no longer shows room (or join required again).

**Checkpoint 6:** Two users in same room can send and read messages. Core MVP complete.

- [ ] Checkpoint 6 passed

---

## Phase 7 — Polish and error handling

**Goal:** App feels finished for demo; no debug leftovers.

| Step | What to do | File(s) | Verify |
|------|-----------|---------|--------|
| 7.1 | Create NotFound page for unknown routes | `src/pages/NotFound.jsx`, `src/App.jsx` | `/random-url` shows 404 page with link home |
| 7.2 | If logged-in user visits `/login` → redirect to dashboard | `src/pages/Login.jsx` | No login form when already authenticated |
| 7.3 | Add loading states on all pages that fetch data | all pages | Spinner or "Loading..." text during fetch |
| 7.4 | Add inline error messages on all forms | all pages | Errors visible to user, not just console |
| 7.5 | Remove console.log debug statements | all files | Clean console in normal use |
| 7.6 | Delete or archive any Test.jsx probe page | — | File gone or unused |
| 7.7 | Add navigation links between pages (Login ↔ Register, back buttons) | all pages | User never stuck on a page |
| 7.8 | After create room, redirect to room (fix if still showing success message only) | `src/pages/CreateRoom.jsx` | No dead-end after create |
| 7.9 | Wire leave room API in Room page (remove TODO) | `src/pages/Room.jsx` | Leave actually calls backend |
| 7.10 | Basic CSS for room chat, dashboard cards, forms | `src/index.css` or `src/App.css` | UI readable and consistent |

**Test recipe — Phase 7**
1. Walk full flow: register → login → create room → chat → leave → logout.
2. No console errors during normal use.
3. Unknown URL shows 404.
4. Expired token redirects to login.

**Checkpoint 7:** App feels complete for demo, no debug leftovers.

- [ ] Checkpoint 7 passed

---

## Phase 8 — Real-time WebSocket (enhancement)

**Goal:** Messages appear instantly without refresh. Hybrid: REST for history, WebSocket for live send/receive.

> **Note:** This phase is largely implemented in the current codebase. Use this section to verify and harden it.

| Step | What to do | Backend | Verify |
|------|-----------|---------|--------|
| 8.1 | Confirm STOMP + SockJS client libraries installed | — | `@stomp/stompjs` and `sockjs-client` in package.json |
| 8.2 | Create websocket service that connects to /ws with JWT in CONNECT headers | WebSocketAuthInterceptor validates token | Connection succeeds when logged in |
| 8.3 | Subscribe to `/topic/room/{roomCode}` when entering a room | ChatController broadcasts to same topic | Only room members' messages appear |
| 8.4 | Send messages via `/app/chat.send` with payload roomCode + content | Message saved to DB then broadcast | Message persisted and live |
| 8.5 | On incoming WebSocket message, append to chat list (dedupe by id) | — | No duplicates |
| 8.6 | Disconnect WebSocket on page unmount | — | No ghost connections |
| 8.7 | Handle WebSocket connection failure gracefully (show reconnecting message) | — | User informed if connection drops |

**Test recipe — Phase 8**
1. Open room in two browsers.
2. Send from browser A → appears instantly in browser B.
3. Refresh browser B → message still in history (persisted via backend).
4. Close room tab → WebSocket disconnects (check Network tab).

**Checkpoint 8:** Real-time chat works reliably alongside REST history.

- [ ] Checkpoint 8 passed

---

## Target folder structure (end state)

```
Frontend/src/
├── config/
│   └── api.js              ← base URL constant
├── context/
│   └── AuthContext.jsx     ← AuthProvider + useAuth hook
├── services/
│   ├── AuthService.jsx     ← register, login
│   ├── roomService.jsx     ← create, join, leave, mine, details
│   ├── messageService.jsx  ← history, send (REST fallback)
│   └── websocketService.jsx← STOMP client for live chat
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── CreateRoom.jsx
│   ├── JoinRoom.jsx
│   ├── Room.jsx
│   └── NotFound.jsx
├── routes/
│   └── ProtectedRoute.jsx
├── components/             ← optional: Navbar, RoomCard, MessageList
├── App.jsx
└── main.jsx
```

---

## MVP user journey (full flow)

```
Open app
  → No token? → Login or Register
  → Register → POST /api/auth/register → Login page
  → Login → POST /api/auth/login → save JWT → Dashboard
  → Dashboard → GET /api/rooms/mine → list rooms
  → Create Room → POST /api/rooms/create → Room page
  → Join Room → POST /api/rooms/{roomCode}/join → Room page
  → Room page → GET history + WebSocket connect
  → Send message → /app/chat.send → live broadcast
  → Leave Room → POST /api/rooms/{roomCode}/leave → Dashboard
  → Logout → clear token → Login
```

---

## Progress tracker (all checkpoints)

Copy and tick as you go:

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | Foundation (routing, auth guard, bootstrap) | [ ] |
| 1 | API services layer | [ ] |
| 2 | Register page | [ ] |
| 3 | Login page | [ ] |
| 4 | Dashboard | [ ] |
| 5 | Create Room | [ ] |
| 6 | Room chat (core MVP) | [ ] |
| 7 | Polish and error handling | [ ] |
| 8 | WebSocket real-time | [ ] |

---

## Backend reference (quick lookup)

All protected REST endpoints require header: `Authorization: Bearer <jwt-token>`

### Auth — /api/auth (public)

| Method | Path | Body | Response |
|--------|------|------|----------|
| POST | /api/auth/register | username, email, password | 201 success message |
| POST | /api/auth/login | email, password | token, username, email |

### Rooms — /api/rooms (protected)

| Method | Path | Body | Response |
|--------|------|------|----------|
| POST | /api/rooms/create | roomName, description?, password? | RoomResponse (includes roomCode) |
| POST | /api/rooms/{roomCode}/join | password? | RoomResponse |
| POST | /api/rooms/{roomCode}/leave | — | success message |
| GET | /api/rooms/mine | — | array of { roomCode, roomName } |
| GET | /api/rooms/{roomCode} | — | RoomResponse (id, roomName, roomCode, description, ownerUsername, roomCount) |

### Messages — /api/messages (protected)

| Method | Path | Body | Response |
|--------|------|------|----------|
| POST | /api/messages/{roomCode}/send | plain text string | MsgRes |
| GET | /api/messages/{roomCode}/messages | — | array of MsgRes |

**MsgRes shape:** id, content, senderUsername, createdAt

### WebSocket (STOMP + SockJS)

| Action | Path | Notes |
|--------|------|-------|
| Connect | /ws | Send JWT in CONNECT headers as Authorization Bearer |
| Send message | /app/chat.send | Body: { roomCode, content } |
| Receive messages | /topic/room/{roomCode} | Subscribe per room |

---

## Known backend gaps (plan accordingly)

| Gap | Impact on frontend |
|-----|-------------------|
| Room password stored but not enforced on join | Password field on join is optional for MVP |
| JWT expires after 1 hour | Handle 401 globally; redirect to login |
| No refresh token | User must log in again after expiry |
| No room update/delete endpoints | No edit room UI needed for MVP |
| No member list endpoint | Show member count only, not usernames list |
| No message edit/delete | Chat is append-only in UI |
| No pagination on chat history | Load all messages (fine for MVP demo) |

---

## What is out of scope for MVP

- Video or audio calling
- Password reset
- User roles or admin panel
- Room ownership transfer
- Typing indicators or online presence
- Mobile-native app

---

## Suggested next steps from current state

Based on where the project is now, focus on these in order:

1. **Phase 7.8** — Redirect to room after create (CreateRoom.jsx)
2. **Phase 7.9** — Wire leave room API (Room.jsx)
3. **Phase 7.1** — Add NotFound page
4. **Phase 0.3** — Import Bootstrap CSS
5. **Phase 1.6** — Global 401 handler
6. **Phase 6.2** — Show room name in room header (fetch room details)
7. **Phase 7.10** — Basic styling pass

Once those pass, run the **Phase 6 test recipe** with two browsers to confirm the full MVP demo works end to end.
