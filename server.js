const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const session = require("express-session");
const passport = require("passport");

app.use(cookieParser());
app.use(express.json());

app.use(session({secret: "секрет", resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

// подключение разных путей
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const userRoutes = require("./routes/user");
app.use("/user", userRoutes);

const threadRoutes = require("./routes/threads");
app.use("/api", threadRoutes);


//Подключаем фронт
app.use(express.static("public"));
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

app.use("/uploads", express.static("uploads"));

app.listen(5000, () => console.log("Сервер запущен на порту 5000"));
