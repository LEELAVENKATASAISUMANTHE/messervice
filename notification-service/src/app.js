import express from 'express';
import bodyParser from 'body-parser';
import tokenroutes from './routes/token.routes.js';
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', tokenroutes);

// Sample route for sending notifications
export default app;