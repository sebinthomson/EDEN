import multer from "multer";
import path from "path";

const destinationPath = "./public/Images/Auctions";

const englishAuctionStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const englishAuctionUpload = multer({ storage: englishAuctionStorage });

const profileUpdateStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../public/Images/Auctions");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const profileUpdateUpload = multer({ storage: profileUpdateStorage });

export { englishAuctionUpload, profileUpdateUpload };
