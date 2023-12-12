import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import biddingRoutes from "./routes/biddingRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import morgan from "morgan";
import { Server as ServerIoSocket } from "socket.io";

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(
  session({
    secret: "mysitesessionsecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bids", biddingRoutes);

app.get("/", (req, res) => res.send("server is ready"));

app.use(errorHandler);
app.use(notFound);

const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

const io = new ServerIoSocket(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData?._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    console.log("newMessageRecieved:", newMessageRecieved);
    var biddings = newMessageRecieved.biddings;

    if (!biddings.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
