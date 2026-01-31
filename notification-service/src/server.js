import app from './app.js';

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Notification service is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Notification Service is up and running!');
});