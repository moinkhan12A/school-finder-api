// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const schoolsRouter = require('./routes/schools');

app.use(express.json());
app.get('/', (req, res) => res.send({ success: true, message: 'School API running' }));
app.use('/', schoolsRouter);

// 404 handler
app.use((req, res) => res.status(404).json({ success: false, message: 'Not Found' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
