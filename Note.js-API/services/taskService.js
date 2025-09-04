const{db , admin}  = require("../config/firebase");

const taskService = {
  async createTask(task_title) {
    return db.collection("users").add({
      task_title,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  },

async getTasks() {
  const snapshot = await db.collection("users").get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null
    };
  });
}
,
  async getTaskDetails(id) {
    const doc = await db.collection("users").doc(id).get();
    if (!doc.exists) throw new Error("Task not found");
    return { id: doc.id, ...doc.data() };
  },

  async deleteTask(id) {
    return db.collection("users").doc(id).delete();
  },

  async updateTask(id, data) {
    return db.collection("users").doc(id).update(data);
  },

   async updateTitle(id , title) {
     return db.collection("users").doc(id).update({
      task_title:title
     },
    { merge: true })
   }

};

module.exports = taskService;
