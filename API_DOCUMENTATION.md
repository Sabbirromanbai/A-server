# GoodTogether Backend API Documentation

**Base URL:** `http://localhost:5000`

## 1. Events API

### 1. Create Event
- **Method:** POST
- **Endpoint:** `/api/events`
- **Description:** Create a new event.
- **Request Body:**
```json
{
  "title": "Tree Plantation",
  "description": "Plant trees together",
  "eventType": "Environment",
  "thumbnailUrl": "https://example.com/tree.jpg",
  "location": "Chattogram",
  "eventDate": "2026-11-15",
  "creatorEmail": "sabbir@example.com"
}
```

### 2. Get All Upcoming Events
- **Method:** GET
- **Endpoint:** `/api/events`
- **Description:** Get all upcoming events, sorted by nearest date first.

### 3. Get Single Event
- **Method:** GET
- **Endpoint:** `/api/events/:id`
- **Description:** Get event details using Event ID.

### 4. Update Event
- **Method:** PUT
- **Endpoint:** `/api/events/:id`
- **Description:** Update an existing event.
- **Request Body:** Updated event information.

### 5. Delete Event
- **Method:** DELETE
- **Endpoint:** `/api/events/:id`
- **Description:** Delete an event using Event ID.

---

## 2. Participants API

### 6. Join Event
- **Method:** POST
- **Endpoint:** `/api/participants`
- **Description:** Join a user to an event.
- **Request Body:**
```json
{
  "eventId": "EVENT_ID",
  "userEmail": "sabbir@example.com"
}
```
- **Duplicate Join:** Returns `409 Conflict` if the user already joined.

### 7. Get Joined Events
- **Method:** GET
- **Endpoint:** `/api/participants/:email`
- **Description:** Get all events joined by a specific user.
- **Status:** Planned (Not implemented yet).

---

## 3. General API Routes

### Server Status
- **Method:** GET
- **Endpoint:** `/`
- **Description:** Check whether the backend server is running.

### API Status
- **Method:** GET
- **Endpoint:** `/api`
- **Description:** Check whether the API is running.

---

## 4. Technology Stack

- Node.js
- Express.js
- MongoDB Atlas
- Native MongoDB Driver
- JavaScript ES Modules
- dotenv
- CORS

## 5. Important Notes

- Base URL will change after backend deployment.
- Protected routes and Better Auth + JWT security are not implemented yet.
- Do not expose MongoDB credentials or secret keys.
- Update this documentation whenever a new API is created.