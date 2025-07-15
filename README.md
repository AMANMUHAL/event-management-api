# 🎟️ Event Management REST API

A RESTful backend API built with **Node.js**, **Express**, and **PostgreSQL** that allows users to manage events and registrations. The system supports event creation, user registrations and cancellations, real-time capacity tracking, and event statistics, while enforcing core business rules.

---

## 🛠️ Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AMANMUHAL/event-management-api.git
   cd event-management-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the project root with:
     ```
     DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<database>
     PORT=3000
     ```
   - Replace `<user>`, `<password>`, `<host>`, `<port>`, and `<database>` with your PostgreSQL details.

4. **Set up the database:**
   - Ensure your PostgreSQL database is running and matches the `DATABASE_URL`.
   - Create the necessary tables:
     ```sql
     CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       email VARCHAR(100) UNIQUE NOT NULL
     );
     CREATE TABLE events (
       id SERIAL PRIMARY KEY,
       title VARCHAR(200) NOT NULL,
       datetime TIMESTAMP NOT NULL,
       location VARCHAR(200) NOT NULL,
       capacity INT NOT NULL CHECK (capacity > 0 AND capacity <= 1000)
     );
     CREATE TABLE registrations (
       user_id INT REFERENCES users(id),
       event_id INT REFERENCES events(id),
       PRIMARY KEY (user_id, event_id)
     );
     ```

5. **Run the development server:**
   ```bash
   npm start
   ```
   The API will be available at `http://localhost:3000`.

---

## 📚 API Description

### Users

- **Create User**
  - `POST /api/users`
  - Body: `{ "name": "Alice", "email": "alice@example.com" }`
- **List All Users**
  - `GET /api/users`

### Events

- **Create Event**
  - `POST /api/events`
  - Body: `{ "title": "Conference", "datetime": "2025-08-01T10:00:00Z", "location": "NYC", "capacity": 200 }`
- **Get Event Details**
  - `GET /api/events/:id`
- **Register User for Event**
  - `POST /api/events/:id/register`
  - Body: `{ "userId": 1 }`
- **Cancel Registration**
  - `DELETE /api/events/:id/register`
  - Body: `{ "userId": 1 }`
- **List Upcoming Events**
  - `GET /api/events/upcoming/list`
- **Event Stats**
  - `GET /api/events/:id/stats`

---

## 💡 Example Requests/Responses

**1. Create User**

Request:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "email": "alice@example.com"}'
```
Response:
```json
{ "id": 1 }
```

**2. Create Event**

Request:
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{"title": "Tech Meetup", "datetime": "2025-09-10T18:00:00Z", "location": "Online", "capacity": 100}'
```
Response:
```json
{ "id": 1 }
```

**3. Register User for Event**

Request:
```bash
curl -X POST http://localhost:3000/api/events/1/register \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}'
```
Response:
```json
{ "message": "Registered successfully" }
```

**4. Cancel Registration**

Request:
```bash
curl -X DELETE http://localhost:3000/api/events/1/register \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}'
```
Response:
```json
{ "message": "Registration cancelled" }
```

**5. List Upcoming Events**

Request:
```bash
curl http://localhost:3000/api/events/upcoming/list
```
Response:
```json
[
  {
    "id": 1,
    "title": "Tech Meetup",
    "datetime": "2025-09-10T18:00:00.000Z",
    "location": "Online",
    "capacity": 100
  }
]
```

**6. Event Stats**

Request:
```bash
curl http://localhost:3000/api/events/1/stats
```
Response:
```json
{
  "totalRegistrations": 10,
  "remainingCapacity": 90,
  "percentUsed": "10.00%"
}
```

---

For extended documentation and details, please see the source code and comments in the repository.
