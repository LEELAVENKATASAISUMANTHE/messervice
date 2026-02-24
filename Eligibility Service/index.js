
import express from 'express';
import bodyParser from 'body-parser';
import { getmessage } from './utils/main.js';
import { connectMongo } from "./mongo.connection.js";
// import * as db from './db/db.js';


const app = express();
app.use(bodyParser.json());


// Sample endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Eligibility Service is running' });
});


// TODO: Add more endpoints and business logic


const PORT = process.env.PORT || 5789;
app.listen(PORT, async () => {
  console.log('Server is up and running');
  console.log("\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n");
  await connectMongo();
  await getmessage();
   // Start Kafka consumer cwhen the server starts
  console.log(`Eligibility Service running on port ${PORT}`);
});
