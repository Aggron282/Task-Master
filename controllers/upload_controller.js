const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure directories exist
["public/images", "public/files"].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const isValid = allowedTypes.test(file.mimetype);
  cb(null, isValid);
};

const fileFilter = (req, file, cb) => {

  const allowedMIMEs = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
  "text/plain", // txt
  "application/zip", // zip
  "text/csv" // csv
];

  const isValid = allowedMIMEs.includes(file.mimetype);
  console.log(isValid,file.mimetype)
  cb(null, isValid);
};

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/images"),
  filename: (req, file, cb) =>
    cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname),
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/files"),
  filename: (req, file, cb) =>
    cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname),
});

const uploadImage = multer({ storage: imageStorage, fileFilter: imageFilter });
const uploadFile = multer({ storage: fileStorage, fileFilter: fileFilter });


module.exports.UploadImage = uploadImage
module.exports.UploadFile = uploadFile;
