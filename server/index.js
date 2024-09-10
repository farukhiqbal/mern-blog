const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
require("dotenv").config();
const upload = require("express-fileupload");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "https://futurestack.vercel.app" }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://futurestack.vercel.app");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.get("/", (req, res) => {
  res.send("server is running ");
});

app.use(upload());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.use(notFound);
app.use(errorHandler);

connect(process.env.MONGO_URL)
  .then(
    app.listen(process.env.PORT, () =>
      console.log(`server started on port ${process.env.PORT}`)
    )
  )
  .catch((error) => {
    console.log(error);
  });
