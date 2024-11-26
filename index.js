const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/connectDB");
const createAdminAccounts = require("./utils/createAdminAccount");
const adminRoutes = require("./routes/adminRoutes");
const projectsRoutes = require("./routes/projectsRoutes");
const port = process.env.PORT || 3001;

/*===== Middlewares =====*/
dotenv.config();
createAdminAccounts();
app.use(bodyParser.json({ limit: "100mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/uploads/projects",
  express.static(path.join(__dirname, "..", "uploads", "projects"))
);
app.use(
  "/uploads/avatars",
  express.static(path.join(__dirname, "..", "uploads", "avatars"))
);
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

/*===== Rouets =====*/
app.use("/api/admin", adminRoutes);
app.use("/api/projects", projectsRoutes);

app.get("/", (req, res) => {
  res.send("Alramlaa");
});

app.listen(port, () => {
  console.log(`App running on port => ${port}`);
});
