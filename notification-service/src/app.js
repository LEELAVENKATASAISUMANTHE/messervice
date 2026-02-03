import express from 'express';
import bodyParser from 'body-parser';
import tokenroutes from './routes/token.routes.js';
import webnotificationroutes from './routes/webnotification.routes.js';
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', tokenroutes);
app.use('/', webnotificationroutes);

// Sample route for sending notifications
export default app;