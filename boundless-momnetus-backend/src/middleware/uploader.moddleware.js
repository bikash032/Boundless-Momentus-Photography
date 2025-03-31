const multer = require("multer");
const fs = require("node:fs");

const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // destination
        let uploadPath = "./public";
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const filename = file.originalname;
        cb(null, filename);
    },
});

const uploader = (fileType = "image") => {
    let allowedExts = ["jpg", "jpeg", "png", "svg", "bmp", "webp", "gif"];

    if (fileType === "doc") {
        allowedExts = ["doc", "docx", "pdf", "ppt", "csv", "xlsx", "txt"];
    } else if (fileType === "audio") {
        allowedExts = ["mp3", "m8u8"];
    } else if (fileType === "video") {
        allowedExts = ["mp4", "wav"];
    } //

    return multer({
        storage: myStorage,
        fileFilter: (req, file, cb) => {
            const ext = file.originalname.split(".").pop(); // JPG

            // TODO: explore file object manipulate
            if (allowedExts.includes(ext.toLowerCase())) {
                cb(null, true);
            } else {
                cb({
                    code: 400,
                    status: "VALIDATION_FAILED",
                    message: "File format not supported",
                    detail: { image: "Image format not supported" },
                });
            }
        },
        limits: {
            fileSize: 3000000,
        },
    });
};

module.exports = {
    uploader,
};
