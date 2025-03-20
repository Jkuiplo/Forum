const multer = require("multer");
const path = require("path");

// Конфигурация хранилища для аватаров
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/avatars/"); // Папка для сохранения
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname)); // Уникальное имя файла
	},
});

// Фильтрация только изображений
const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image/")) {
		cb(null, true);
	} else {
		cb(new Error("Можно загружать только изображения"), false);
	}
};

// Экспорт настроенного `multer`
const upload = multer({ storage, fileFilter });
module.exports = upload;

