import dotenv from "dotenv";
import app from "./app.js";
import {createServer} from "http";
import { Server } from "socket.io";
import { db } from "../config/db.js";
import { users } from "./models/user.js";
import { eq } from "drizzle-orm";
dotenv.config({ path: "./.env" });

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

let activeUsers = [];

const PORT = process.env.PORT || 8080;

io.on("connection",(socket) => {
  //add a new user to socket server
  socket.on('add-new-user', (newUserId) => {
    if(!activeUsers.some((user) => user.userId === newUserId)){
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id
      })
    }
    io.emit('get-users', activeUsers)
  })

  // Handle sending and receiving messages
  socket.on('send-message', (data) => {
    const { receiverId, message } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      
      io.to(user.socketId).emit('receive-message', message);
    }
  });

  socket.on('user-typing', ({ userId, receiverId }) => {
    const user = activeUsers.find(u => u.userId === userId);
    if (user) {
      user.isTyping = true;
      io.to(activeUsers.find(u => u.userId === receiverId)?.socketId).emit('user-typing', userId);
    }
  });

  socket.on('user-stop-typing', ({ userId, receiverId }) => {
    const user = activeUsers.find(u => u.userId === userId);
    if (user) {
      user.isTyping = false;
      io.to(activeUsers.find(u => u.userId === receiverId)?.socketId).emit('user-stop-typing', userId);
    }
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
    io.emit('get-users', activeUsers)
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});