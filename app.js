const express = require("express");
const bodyParser = require("body-parser");
const rateLimite = require("express-rate-limit");
const authRouter = require("./src/routes/authRoutes");
const highlightsRoute = require("./src/routes/highlights");
const bookmarkRoutes = require("./src/routes/bookmark");
const noteRoutes = require("./src/routes/note");
const markRoutes = require("./src/routes/marks");
const { connectDB } = require("./src/config/db");
const { syncDB } = require("./src/models");
const errorHandler = require("./src/utils/globalErrorHandler");
const { swaggerDocs } = require('./src/swagger');
const app = express();

const limiter = rateLimite({
  max: 50,
  windowMs: 60 * 1000,
  message: "to many request",
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send("server is up and running"))
app.get("/testLimit", limiter, (req, res) => res.send({ message: "success" }));
app.use("/api/v1/auth", authRouter);
// app.use("/api/webhook", webhookRouter);
// app.use("/api/publications", publicationRouter);
app.use("/api/highlights", highlightsRoute);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/v1/notes", noteRoutes);
app.use("/api/marks", markRoutes);
swaggerDocs(app);
app.use(errorHandler);

const port = process.env.PORT

const startServer = async () => {
  try {
    await connectDB();
    // await syncDB();
    app.listen(port || 3000, () => console.log("server started"));
  } catch (error) {
    console.log(error);
  }
};

startServer();
