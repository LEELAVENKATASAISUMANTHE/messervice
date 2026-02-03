import app from "./app.js";
import tokenRoutes from "./routes/token.routes.js";
import webnotificationroutes from './routes/webnotification.routes.js';

// 🔑 THIS LINE IS REQUIRED
app.use("/notify", tokenRoutes);
app.use('/notify', webnotificationroutes);

// optional health/root routes
app.get("/notify", (req, res) => {
  res.send("Notification Service is up and running!");
});

app.get("/notify/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(4000, () => {
  console.log("Notification Service listening on port 4000");
});
export default app;
