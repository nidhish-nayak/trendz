import multer from "multer";

const storage = multer.diskStorage({
	destination: function (_req, _file, cb) {
		cb(null, "../client/public/upload");
	},
	filename: function (_req, file, cb) {
		cb(null, Date.now() + file.originalname);
	},
});

export const uploadMulter = multer({ storage: storage });
