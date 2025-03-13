const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/db");
const { body, validationResult } = require("express-validator")

const router = express.Router();
const SECRET_KEY = "Qwe123456Asd";

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const upload = require("../middleware/multer");

router.post (
	"/register",
	//Проверка на непустость, на есть ли этот емэйл и длину пароля
	upload.single("avatar"), // Обработчик загрузки аватара 
	[
		body("username").notEmpty(),
		body("email").isEmail(),
		body("password").isLength({ min: 8 }),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()){
			return res.status(400).json({ errors: errors.array()});
		}

		const {username, email, password} = req.body;
		const avatarPath = req.file ? '/uploads/avatars/${req.file.filename}' : null; //Проверяем есть ли файл		

		//Проверка на существующего пользователя
		const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
		if(existingUser){
			return res.status(400).json({message: "Email уже используется"});
		}
		
		//Хэшируем пароль
		const hashedPassword = await bcrypt.hash(password, 10);
		
		//Запихиваем в БД данные
		const stmt = db.prepare("INSERT INTO users(username, email, password, avatar) VALUES(?, ?, ?, ?)");
		const result = stmt.run(username, email, hashedPassword, avatarPath);
		
		//Забираем из sql id последнего созданного, может наверное вызвать ошибки если несколько одновременно зайдет, но пока пофиг
		const userId = result.lastInsertRowid;

		res.json({message: "Пользователь зарегистрирован!", avatar: avatarPath});
	}
);

router.post(
	"/login",
	[
		body("email").isEmail(),
		body("password").notEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			return res.status(400).json({errors: errors.array() });
		}

		const {email, password} = req.body;
		const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
		
		if (!user) {
			return res.status(400).json({message: "Неверный email или пароль"});
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if(!isMatch) {
			return res.status(400).json({message: "Неверный email или пароль"});
		}

		const accessToken = jwt.sign({userId: user.id, username: user.username }, SECRET_KEY,{expiresIn: "1h"});
		const refreshToken = jwt.sign({userId: user.id}, SECRET_KEY,{expiresIn: "30d"});
		
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: 30 * 24 * 60 * 60 * 1000,
		});

		res.json({accessToken});
	}
);

router.post("/refresh", (req,res) => {
	const refreshToken = req.cookies.refreshToken;

	if(!refreshToken) {
		return res.status(401).json({message: "Нет refresh токена"});
	}

	try{
		const decoded = jwt.verify(refreshToken, SECRET_KEY);
		const newAccessToken = jwt.sign(
			{userId: decoded.userId, username: decoded.username}, 
			SECRET_KEY,
			{expiresIn: "1h"}
		);

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "Strict",
			maxAge: 30 * 24 * 60 * 60 * 1000
		});

		res.json({accessToken: newAccessToken});
	} catch(err){
		return res.status(403).json({message: "Инвалид refresh токен"});
	}
});

router.post("/logout", (req, res) => {
	res.clearCookie("refreshToken");
	return res.json({ message: "Вы вышли из аккаунта" });
})

//google authentication block
passport.use(new GoogleStrategy({
	clientID: "245948251506-vpvqgni6gnpt9k998jkovgdbetbm5kmk.apps.googleusercontent.com",
	clientSecret: "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",
	callbackURL: "/auth/google/callback",
},
async (accessToken, refreshToken, profile, done) => {
	try{
		let user = db.prepare("SELECT * FROM users WHERE googleId = ?").get(profile.id);

		if(!user) {
			const stmt = db.prepare("INSERT INTO users(username, email, googleId) VALUES (?, ?, ?)");
			const result = stmt.run(profile.displayName, profile.emails[0].value, profile.id);
			user = { id: result.lastInsertRowid, username: profile.displayName, email: profile.emails[0].value};
		}

		return done(null, user);
	} catch (err) {
		 return done(err);
	}
}));

router.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}));

router.get("/google/callback",
	passport.authenticate("google", {session: false }),
	(req, res) =>{
		const accessToken = jwt.sign({userId: req.user.id, username: req.user.username}, SECRET_KEY, {expiresIn: "1h"});
		const refreshToken = jwt.sign({iserId: req.user.id}, SECRET_KEY, {expiresIn: "30d"});

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "Strict"
		});

		res.json({accessToken, username: req.user.username});
	}
);



module.exports = router;

