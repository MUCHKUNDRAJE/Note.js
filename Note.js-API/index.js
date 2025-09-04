const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const taskRoutes = require("./routes/taskRoutes");
const taskSocket = require("./sockets/taskSocket");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tasks", taskRoutes);

// Sockets
taskSocket(io);

// Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
