# School Management API

## Setup (local)
1. Clone repository.
2. Create database and table:
   - Run `create_table.sql` in your MySQL (e.g., via MySQL Workbench or CLI).
3. Copy `.env.example` -> `.env` and fill DB credentials.
4. Install packages:
   - `npm install`
5. Start server:
   - `npm run dev` (development) or `npm start`
6. Test endpoints:
   - POST http://localhost:3000/addSchool
   - GET  http://localhost:3000/listSchools?lat=<>&lng=<>

## Example CURL
Add school:
