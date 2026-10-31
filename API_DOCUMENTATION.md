# GoodTogether Backend API Documentatio

**Base URL:** `http://localhost:5000`

## 1. Events API

### 1. Create 
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
- **Authentication:** Required (JWT)
- **Description:** Join the authenticated user to an event. User identity is read from the JWT.
- **Request Body:**
```json
{
  "eventId": "EVENT_ID"
}
```
- **Duplicate Join:** Returns `409 Conflict` if the user already joined.
- **Success response:** Includes the updated volunteer count and public roster.

### 7. Leave Event
- **Method:** DELETE
- **Endpoint:** `/api/participants`
- **Authentication:** Required (JWT)
- **Description:** Remove the authenticated user from an event. User identity is read from the JWT.
- **Request Body:**
```json
{
  "eventId": "EVENT_ID"
}
```
- **Success response:** Includes the updated volunteer count and public roster.

### 8. Get Joined Events
- **Method:** GET
- **Endpoint:** `/api/participants`
- **Authentication:** Required (JWT)
- **Description:** Get events joined by the authenticated user. User identity is read from the JWT.

### 9. Get Event Volunteers
- **Method:** GET
- **Endpoint:** `/api/participants/event/:eventId`
- **Description:** Get an event's confirmed volunteer count and public profile names/images. Volunteer emails are not returned.

### 10. Organizer Profile
- **Method:** GET
- **Endpoint:** `/api/events/:id`
- **Description:** Includes the creator email and public organizer profile (`name`, `image`, `emailVerified`) when the matching Better Auth user exists.

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
- Protected participant and event routes require a Better Auth JWT.
- Do not expose MongoDB credentials or secret keys.
- Update this documentation whenever a new API is created.