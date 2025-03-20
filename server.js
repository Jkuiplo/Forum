const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(session({ secret: "секрет", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Подключаем API-маршруты
const threadRoutes = require("./routes/threads");
app.use("/api", threadRoutes);

// Обслуживание фронта
app.use(express.static(path.join(__dirname, "public")));

app.get(["/", "/threads"], (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Запуск сервера
app.listen(3000, () => console.log("Сервер запущен на порту 3000"));
