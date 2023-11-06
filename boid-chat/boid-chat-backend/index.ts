import express from "express";
import { Server, Socket } from "socket.io";
import http from "http";
import { addUser, removeUser, getUser, getUsersInRoom } from "./users";
const PORT = 5000 || process.env.PORT;
import router from "./router";
const app = express();
const server = http.createServer(app);
import cors from "cors";

/* // Allow connections from localhost:3000
const io = new Server(server, {
  cors: {
    origin: "https://boid-chat.com, "https://www.boid-chat.com",
    methods: ["GET", "POST"],
  },
}); */


const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(router);


// Server is online
io.on("connection", (socket: Socket) => {
  // When a client connects to the server
  socket.on("join", ({ name, room }, callback) => {
    // Store the users name and room that they joined
    //console.log(name, room);
    const result = addUser({ id: socket.id, name, room });
    const user = result.user;
    //console.log("result", result);
    if (user) {
      // Emit the join event to the user that joined
      socket.emit("message", {
        user: "admin",
        text: `Hello ${user.name}, welcome to Boid Chat.... you joined the ${user.room} room`,
      });

      // Emit the join event from the server to the rest of users in the room
      socket.broadcast.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name}, has joined Boid Chat`,
      });
      socket.join(user?.room);
      // Initialises room data and sends it to client on joining
      io.to(user.room).emit("RoomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });

      callback();
    } else {
      // add user returns error if the name the user picked is not available
      return callback(result.error);
    }
  });

  // When a user sends a message
  socket.on("sendMessage", (message, callback) => {
    // If user exists send the users message to everyone in the room and update number of people in room
    const user = getUser(socket.id);
    if (user) {
      // Broadcasts the message to the socket that corresponds to the room so all users in the room can see it
      io.to(user.room).emit("message", { user: user.name, text: message.text });
      // Updates the number of users in that room
      io.to(user.room).emit("RoomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
      callback();
    } else {
      //console.log("User not found");
    }
  });

  // When a disconnect event is triggered
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    // Broadcast to the room that user has left
    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left the building.`,
      });
    }
  });
});

// Server port
server.listen(5000 || process.env.port, () => {
  console.log(`server has started on port ${PORT}`);
});
