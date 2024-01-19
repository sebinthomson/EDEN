import asyncHandler from "express-async-handler";
import {
  newEnglishAuction,
  newReverseAuction,
  startBidding,
  biddingHistory as biddingHistoryHelper,
} from "../helper/auctionHelper.js";
import EnglishAuction from "../models/englishAuctionModel.js";
import ReverseAuction from "../models/reverseAuctionModel.js";
import Biddings from "../models/biddingsModel.js";
import Bid from "../models/bidsModel.js";
import Razorpay from "razorpay";
import nodeMailer from "nodemailer";
import excel from "exceljs";

const newEnglishAuctionUser = asyncHandler(async (req, res) => {
  try {
    const { user, item, quantity, startingBid, startsOn, endsOn } = req.body;
    const image = [
      "1705300131409.jpg",
      "1705300132685.jpg",
      "1705300132962.jpg",
      "1705300133364.jpg",
      "1705300133602.jpg",
    ];
    // const image = [];
    // for (let obj of req.files) {
    //   image.push(obj.filename);
    // }
    const auction = await newEnglishAuction(
      user,
      item,
      quantity,
      startingBid,
      startsOn,
      endsOn,
      image
    );
    res.status(200).json({ newEnglishAuction: auction });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const newReverseAuctionUser = asyncHandler(async (req, res) => {
  const { userId, item, quantity, startDate, endDate } = req.body;
  const auction = await newReverseAuction(
    userId,
    item,
    quantity,
    startDate,
    endDate
  );
  res.status(200).json({ newReverseAuction: auction });
});

const listAuctionUser = asyncHandler(async (req, res) => {
  let englishAuctions = await EnglishAuction.find()
    .sort({ _id: -1 })
    .populate("user");
  englishAuctions = englishAuctions.slice(0, 4);
  let reverseAuctions = await ReverseAuction.find()
    .sort({ _id: -1 })
    .populate("user");
  reverseAuctions = reverseAuctions.slice(0, 5);
  res.status(200).json({ auctions: { englishAuctions, reverseAuctions } });
});

const listEnglishAuctionsAdmin = asyncHandler(async (req, res) => {
  try {
    const allAuctions = await EnglishAuction.find().populate("user");
    res.status(201).json(allAuctions);
  } catch (error) {
    console.log(error.message);
  }
});

const listReverseAuctionsAdmin = asyncHandler(async (req, res) => {
  try {
    const allAuctions = await ReverseAuction.find().populate("user");
    res.status(201).json(allAuctions);
  } catch (error) {
    console.log(error.message);
  }
});

const createAuctionBidding = asyncHandler(async (req, res) => {
  try {
    const bidding = await startBidding(
      req.body.auctionId,
      req.body.name,
      JSON.parse(req.body.user),
      req.body.isEnglishAuction
    );
    res.status(200).json(bidding);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const biddingHistory = asyncHandler(async (req, res) => {
  try {
    const bidding = await Biddings.findOne({ auctionId: req.params.AuctionId });
    const bidsHistory = await biddingHistoryHelper(bidding?._id);
    let auction = await ReverseAuction.findOne({
      _id: req.params.AuctionId,
    }).populate("user");
    if (!auction) {
      auction = await EnglishAuction.findOne({
        _id: req.params.AuctionId,
      }).populate("user");
    }
    if (bidsHistory.length > 1) {
      res.status(200).json({ bidsHistory: bidsHistory, auction: auction });
    } else {
      res.json({ noBidHistory: true, bidding: bidding, auction: auction });
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const bid = asyncHandler(async (req, res) => {
  try {
    const { sender, content, auctionId } = req.body;
    const bidding = await Biddings.find({ auctionId: auctionId });
    const newBid = {
      sender: sender,
      content: content,
      biddings: bidding[0]._id.toString(),
    };
    let bid = await Bid.create(newBid);
    bid = await Bid.populate(bid, { path: "sender", select: "name email" });
    bid = await Bid.populate(bid, { path: "biddings", select: "users" });
    await Biddings.findByIdAndUpdate(bidding[0]._id.toString(), {
      latestMessage: bid._id.toString(),
    });
    res.status(200).json(bid);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const addToAuctionBidding = asyncHandler(async (req, res) => {
  const { userId, auctionId } = req.body;
  let bidding;
  bidding = await Biddings.findOneAndUpdate(
    { auctionId: auctionId },
    {
      $push: { users: userId },
    }
  );
  if (!bidding) {
    let englishAuction = false;
    if ((await ReverseAuction.find({ _id: auctionId })).length == 0) {
      await EnglishAuction.find({ _id: auctionId });
      englishAuction = true;
    }
    bidding = await startBidding(auctionId, userId, englishAuction);
  }
  if (!bidding) {
    res.status(404);
    throw new Error("AuctionId not found");
  } else {
    res.json(bidding);
  }
});

const razorpay = asyncHandler(async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    const options = req.body;
    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).send("Error making payment");
    }
    res.json(order);
  } catch (error) {
    throw new Error("Error making payment");
  }
});

const razorpayvalidate = asyncHandler(async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    //order_id + "|" + razorpay_payment_id
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");
    if (digest !== razorpay_signature) {
      return res.status(400).json({ msg: "Transaction is not legit!" });
    }
    res.json({
      msg: "success",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    throw new Error("Error validating payment");
  }
});

const filterAuctions = asyncHandler(async (req, res) => {
  try {
    const { english } = req.body;
    let auction;
    let filterFields = {};
    if (english) {
      auction = await EnglishAuction.find().populate("user");
      filterFields.items = await EnglishAuction.distinct("item");
      filterFields.quantity = await EnglishAuction.distinct("quantity");
      filterFields.quantityLength = filterFields.quantity.length;
    } else {
      auction = await ReverseAuction.find().populate("user");
      filterFields.items = await ReverseAuction.distinct("item");
      filterFields.quantity = await ReverseAuction.distinct("quantity");
      filterFields.quantityLength = filterFields.quantity.length;
    }
    res.json({
      auction: auction,
      filterFields: filterFields,
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

const approveAuctionsQuery = asyncHandler(async (req, res) => {
  try {
    let biddings = await Biddings.find().populate({
      path: "auctionId",
      populate: { path: "user" },
    });
    const currentDate = new Date();
    biddings = biddings.filter((element) => {
      let endsOnDate;
      if (element.auctionId.endsOn) {
        endsOnDate = new Date(element?.auctionId?.endsOn);
      }
      return element.auctionId.winningBid == -1 && endsOnDate < currentDate;
    });
    res.status(200).json(biddings);
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
});

const approveAuction = asyncHandler(async (req, res) => {
  try {
    const { auctionId, winningBid, email, auctionType, auction } = req.body;
    let payment = 0.98 * winningBid;
    payment = payment.toFixed(2);
    auctionType == "ReverseAuction"
      ? await ReverseAuction.findByIdAndUpdate(
          auctionId,
          {
            winningBid: winningBid,
          },
          { new: true }
        )
      : await EnglishAuction.findByIdAndUpdate(
          auctionId,
          {
            winningBid: winningBid,
          },
          { new: true }
        );
    const transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_APP,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_APP,
      to: email,
      subject: "EDEN - Auction Winner",
      html: `<p>Congratulations on winning the Auction for ${auction.item}, ${auction.quantity} Kg. Kindly login and proceed with the completion of the auction.</p><br></br><p>After commission of 2% for EDEN, you should pay a total sum of Rs.${payment}</p>`,
    };
    const mailOptionstwo = {
      from: process.env.EMAIL_APP,
      to: auction.user.email,
      subject: "EDEN - Auction Completed",
      html: `<p>The auction you hosted for ${auction.item}, ${auction.quantity} Kg was won for Rs.${winningBid}, Kindly contact ${email} for future proceedings. </p><br></br><p>After commission of 2% for EDEN, you can collect a total sum of Rs.${payment}</p>`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent as notification:-", info.response);
      }
    });
    transporter.sendMail(mailOptionstwo, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent as notification:-", info.response);
      }
    });
    res.status(200).json({ updation: true });
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
});

const review = asyncHandler(async (req, res) => {
  try {
    const { rate, title, content, auctionId, englishAuction, userId } =
      req.body;
    let auction;
    englishAuction
      ? (auction = await EnglishAuction.updateOne(
          { _id: auctionId },
          {
            $push: {
              review: {
                user: userId,
                rating: rate,
                title: title,
                content: content,
              },
            },
          },
          { new: true }
        ))
      : (auction = await ReverseAuction.updateOne(
          { _id: auctionId },
          {
            $push: {
              review: {
                user: userId,
                rating: rate,
                title: title,
                content: content,
              },
            },
          },
          { new: true }
        ));
    res.status(201).json({ message: "success" });
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
});

const allAuctionsSalesReport = asyncHandler(async (req, res) => {
  try {
    const englishAuctions = await EnglishAuction.find({
      winningBid: { $ne: -1 },
    }).populate("user");
    const reverseAuctions = await ReverseAuction.find({
      winningBid: { $ne: -1 },
    }).populate("user");

    res.json({
      allAuctions: { englishAuctions, reverseAuctions },
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

const downloadSalesReport = asyncHandler(async (req, res) => {
  try {
    let { startDate, endDate, english } = req.body;
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    let data;
    data = await EnglishAuction.find({
      $and: [
        { endsOn: { $gte: startDate } },
        { endsOn: { $lte: endDate } },
        { winningBid: { $ne: -1 } },
      ],
    }).populate("user");
    console.log(startDate, endDate, data.length);
    if (data.length < 1) {
      throw new Error("No Auctions found in this date range");
    }

    let totalProfit = 500;

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    worksheet.columns = [
      { header: "SL. No", key: "s_no", width: 10 },
      { header: "Item", key: "item", width: 20 },
      { header: "Quantity", key: "quantity", width: 20 },
      { header: "Auctioneer Name", key: "auctioneer", width: 30 },
      { header: "Auctioneer Email", key: "auctioneeremail", width: 15 },
      { header: "Start Date", key: "startsOn", width: 15 },
      { header: "End Date", key: "endsOn", width: 15 },
      { header: "Starting Bid", key: "startingBid", width: 15 },
      { header: "Winning Bid", key: "winningBid", width: 15 },
      { header: "", key: "", width: 20 },
      { header: "", key: "", width: 15 },
    ];

    worksheet.duplicateRow(1, 8, true);
    worksheet.getRow(1).values = ["Sales Report"];
    worksheet.getRow(1).font = { bold: true, size: 16 };
    worksheet.getRow(1).alignment = { horizontal: "center" };
    worksheet.mergeCells("A1:H1");

    worksheet.getRow(2).values = [];
    worksheet.getRow(3).values = [
      "",
      "From",
      startDate.toISOString().split("T")[0],
    ];
    worksheet.getRow(3).font = { bold: false };
    worksheet.getRow(3).alignment = { horizontal: "right" };
    worksheet.getRow(4).values = [
      "",
      "To",
      endDate.toISOString().split("T")[0],
    ];
    worksheet.getRow(5).values = ["", "Total Auctions", data.length];
    worksheet.getRow(6).values = ["", "Total Profit", totalProfit];

    worksheet.getRow(7).values = [];
    worksheet.getRow(8).values = [];

    let count = 1;
    data.forEach((order) => {
      order.s_no = count;
      order.item = order.item;
      order.quantity = order.quantity;
      order.auctioneer = order.user.name;
      order.auctioneeremail = order.user.email;
      order.startsOn = order.startsOn;
      order.endsOn = order.endsOn;
      order.startingBid = order.startingBid;
      order.winningBid = order.winningBid;

      worksheet.addRow(order);
      count += 1;
    });

    worksheet.getRow(9).eachCell((cell) => {
      cell.font = { bold: true };
    });

    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.lastRow.eachCell((cell) => {
      cell.font = { bold: true };
    });

    const xlBuffer = await workbook.xlsx.writeBuffer();
    console.log(typeof xlBuffer);
    res.setHeader("Content-Disposition", "attachment; filename=report.xls");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(xlBuffer);
  } catch (error) {
    throw new Error(error.message);
  }
});

export {
  newEnglishAuctionUser,
  newReverseAuctionUser,
  listAuctionUser,
  listEnglishAuctionsAdmin,
  listReverseAuctionsAdmin,
  createAuctionBidding,
  biddingHistory,
  bid,
  addToAuctionBidding,
  razorpay,
  razorpayvalidate,
  filterAuctions,
  approveAuctionsQuery,
  approveAuction,
  review,
  allAuctionsSalesReport,
  downloadSalesReport,
};
