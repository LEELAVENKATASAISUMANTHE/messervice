const express = require('express');
const bodyParser = require('body-parser');
const kafka = require('../kafka');
const db = require('./db');

const app = express();
app.use(bodyParser.json());

// Sample endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Eligibility Service is running' });
});

// TODO: Add more endpoints and business logic

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    kafka.start(); // Start Kafka consumer when the server starts
  console.log(`Eligibility Service running on port ${PORT}`);
});
