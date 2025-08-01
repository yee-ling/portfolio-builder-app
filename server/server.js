require("dotenv").config();
const express = require("express");
const app = express();
const port = 5555;
const cors = require("cors");
const connectDB = require("./connection");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://20.2.2.220/"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static("public"));

app.use("/users", require("./controllers/users"));
app.use("/portfolios", require("./controllers/portfolios"));
app.use("/categories", require("./controllers/categories"));
app.use("/likes", require("./controllers/likes"));
app.use("/comments", require("./controllers/comments"));
app.use("/saves", require("./controllers/saves"));

app.use("/editors-files", express.static("public/editor"));
app.use("/editors", require("./controllers/editors"));

connectDB();
app.listen(port, () => console.log(`App is running on PORT: ${port}`));
