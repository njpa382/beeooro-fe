const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
//const callRoutes = require("./routes/call.routes");
const twilioRoutes = require("./routes/twilio.routes");

// Initialize
const app = express();

// Config
app.set("port", process.env.PORT || 4000);

// Middlewares
app
  .use(morgan("dev"))
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/twilio", twilioRoutes);

// statics
app.use(express.static(path.join(__dirname, "public")));

module.exports = app;
