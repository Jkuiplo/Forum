const express  = require("express");
const { body, validationResult } = require("express-validator");
const db = require("../database/db");

const router = express.Router();

router.post(
	"/threads",
	[
		body("title").notEmpty(),
		body("content").notEmpty()
	],
	(req, res) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array()});
		}
		
		const { title, content } = req.body;

		const stmt = db.prepare("INSERT INTO threads (title, content) VALUES(?, ?)");
		const result = stmt.run(title, content);

		res.json({message: "Тред создан!", threadId: result.lastInsertRowid});
	}
);

module.exports = router;