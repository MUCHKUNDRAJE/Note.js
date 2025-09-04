const taskService = require("../services/taskService");
const{db}  = require("../config/firebase");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Real-time Firestore listener
    db.collection("users").onSnapshot((snapshot) => {
      const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      socket.emit("tasksUpdated", tasks);
    });

    // Handle task updates
    socket.on("updateTaskContent", async ({ Id, content }) => {
      try {
        await taskService.updateTask(Id, { task: content });
      } catch (err) {
        console.error("Error updating task:", err);
      }
    });

       socket.on("updateTitleContent", async ({ Id, title }) => {
      try {
        await taskService.updateTitle(Id, title );
      } catch (err) {
        console.error("Error updating task:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};
