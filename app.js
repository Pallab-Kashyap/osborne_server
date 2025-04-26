const express = require("express");
const fs =  require('fs')
const path =  require('path')
const morgan =  require('morgan')
const logger = require('./src/utils/logger')


const bodyParser = require("body-parser");
const rateLimite = require("express-rate-limit");
const authRouter = require("./src/routes/authRoutes");
const highlightsRoute = require("./src/routes/highlightRoutes");
const bookmarkRoutes = require("./src/routes/bookmark");
const noteRoutes = require("./src/routes/note") ;
const markRoutes = require("./src/routes/marksRoutes");
const { connectDB } = require("./src/config/db");
const { syncDB } = require("./src/models");
const errorHandler = require("./src/utils/globalErrorHandler");
const { swaggerDocs } = require('./src/swagger');

const app = express();
// const client = require("prom-client") 

fs.mkdirSync(path.join('.', 'logs'), { recursive: true });

const morganStream = {
  write: (message) => logger.info(message.trim()),
};

app.use(morgan('combined', { stream: morganStream }));

const limiter = rateLimite({
  max: 50,
  windowMs: 60 * 1000,
  message: "to many request",
});
// const collectDefaultMetrics = client.collectDefaultMetrics;
// collectDefaultMetrics({ register: client.register });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send("server is up and running"))
app.get("/testLimit", limiter, (req, res) => res.send({ message: "success" }));
app.use("/api/v1/auth", authRouter);
// app.use("/api/webhook", webhookRouter);
// app.use("/api/publications", publicationRouter);
app.use("/api/v1/highlights", highlightsRoute);
app.use("/api/v1/bookmarks", bookmarkRoutes);
app.use("/api/v1/notes", noteRoutes);
app.use("/api/v1/marks", markRoutes);
// app.get("/api/v1/metrics", async (req, res) => { 
//   res.setHeader("Content-Type", client.register.contentType); 
//   try {
//     const metrics = await client.register.metrics();
//     res.send(metrics);
//   } catch (error) {
//     console.error("error geying matrics", error);
//     res.status(500).send("error matrics mecs");
//   }
// });
swaggerDocs(app);
app.use(errorHandler);

const port = process.env.PORT

const startServer = async () => {
  try {
    await connectDB();
    await syncDB();
    app.listen(port, () => console.log("server started"));
  } catch (error) {
    console.log(error);
  }
};

startServer();
