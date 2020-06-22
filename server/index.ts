const express = require("express");
const path = require("path");
const csrf = require("csurf");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const logger = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const historyApi = require("connect-history-api-fallback");
const keys = require("./keys");

const homeRoutes = require("./routes/home");
const coursesRoutes = require("./routes/courses");
const courseRoutes = require("./routes/course");
const cardRoutes = require("./routes/card");
const addRoutes = require("./routes/add");
const ordersRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");

const userMiddleware = require("./middleware/user");
const fileMiddleware = require("./middleware/file");

const PORT = process.env.PORT || 3000;

const app = express();

const store = new MongoStore({
  collection: "sessions",
  uri: keys.MONGODB_URI,
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../dist")));
app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
);
if (!process.env.MY_TEST) {
  app.use(csrf());
}
app.use(helmet());
app.use(compression());
app.use(fileMiddleware.single("avatar"));
app.use(userMiddleware);

app.use("/api/card", cardRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/add", addRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use(historyApi());
app.all("*", homeRoutes);

async function start(): Promise<void> {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start().then();

module.exports = app;
