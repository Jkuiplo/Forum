const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authenticateToken, (req, res) => {
	res.json({ message: " Добро пожаловать в профиль", user: req.user });
});

module.exports = router;
