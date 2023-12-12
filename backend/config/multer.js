import multer from "multer";
import path from "path";

const englishAuctionStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "frontend/public/Images/Auctions");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const englishAuctionUpload = multer({ storage: englishAuctionStorage });

const profileUpdateStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "frontend/public/Images/Auctioneer/ProfileImage");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const profileUpdateUpload = multer({ storage: profileUpdateStorage });

export { englishAuctionUpload, profileUpdateUpload };
