const {Google_Genrative_Model, GoogleGenerativeAI} = require("@google/generative-ai")
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");


const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Change this to match your frontend URL
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());

// Initialize Firebase Admin SDK
const serviceAccount = require("./notesjs-3235a-firebase-adminsdk-fbsvc-a5e39b7b89.json");
const { error } = require("console");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Real-time listener for Firestore
db.collection("users").onSnapshot((snapshot) => {
  const tasks = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  io.emit("tasksUpdated", tasks); // Emit updated data to all connected clients
});

// Socket.io Connection
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("updateTaskContent", async ({ Id, content }) => {
   try
    {
    const taskref  = db.collection("users").doc(Id)
    await taskref.update({task: content})
  
   }  catch(err)
    {
      console.error("Error updating task:", err);
    }  
  });


  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Create Task Endpoint
app.post("/Createtask", async (req, res) => {
  const { task_title} = req.body;
  try {
    const docRef = await db.collection("users").add({ 
       task_title ,
       createdAt: admin.firestore.Timestamp.now(),
      });
    res.status(200).json({ message: "Task created", docRef: docRef});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Tasks Endpoint
app.get("/gettask", async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const tasks = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        task_title: data.task_title,
        createdAt: data.createdAt
          ? new Date(data.createdAt.seconds * 1000).toLocaleString("en-US", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }) 
          : "No Date",
      };
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post("/gettaskdetails", async (req, res) => {
  const { id } = req.body;  // Extract the ID properly

  console.log("Received ID:", id);

  if (!id) {
      return res.status(400).json({ error: "Missing ID in request body" });
  }

  try {
      const docRef = db.collection("users").doc(id);  // Use extracted ID
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
          return res.status(404).json({ error: "Task not found" });
      }
      res.json(docSnap.data()); 
  } catch (error) {
      console.error("Error fetching task:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});







// Delete Task Endpoint
app.delete("/deletetask/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection("users").doc(id).delete();
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the Server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
