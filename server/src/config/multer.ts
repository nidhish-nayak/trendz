const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (cb: any) {
        cb(null, "../../../client/public/upload");
    },
    filename: function (file: any, cb: any) {
        cb(null, Date.now() + file.originalname);
    },
});

const upload = multer({ storage: storage });

export default upload;
