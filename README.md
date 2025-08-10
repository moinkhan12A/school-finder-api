📚 School Management API
A Node.js + Express.js + MySQL API for managing schools, including adding new schools and retrieving a list sorted by proximity to a given location.

🚀 Setup (Local Development)
Clone repository


git clone <your-repo-url>
cd <repo-folder>
Create database and table

Run create_table.sql in MySQL (via MySQL Workbench or CLI).

Environment variables

Copy -> .env

Fill in your MySQL credentials:

env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=school_db
DB_PORT=3306


Install dependencies

npm install
Start the server


Development:

npm run dev
Production:

npm start
Test Endpoints (Local)

Add School

POST http://localhost:3000/addSchool
List Schools by Proximity

bash
Copy
Edit
GET http://localhost:3000/listSchools?lat=<latitude>&lng=<longitude>
📌 Example CURL Requests
1️⃣ Add a School


curl -X POST http://localhost:3000/addSchool \
-H "Content-Type: application/json" \
-d '{
  "name": "Green Valley School",
  "address": "123 Green Street, Springfield",
  "latitude": 37.7749,
  "longitude": -122.4194
}'
2️⃣ List Schools (Sorted by Distance)

curl -X GET "http://localhost:3000/listSchools?lat=37.7749&lng=-122.4194"
🌐 Live Deployment
Base URL: https://school-finder-api-nf8s.onrender.com

Example:

Add School → POST /addSchool

List Schools → GET /listSchools?lat=<latitude>&lng=<longitude>

📂 Postman Collection
A Postman collection with example requests and responses is included for easy testing.

🛠 Tech Stack
Node.js

Express.js

MySQL

dotenv

