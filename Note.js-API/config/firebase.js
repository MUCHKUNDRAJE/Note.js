const admin = require("firebase-admin");
const serviceAccount = require("../notesjs-3235a-firebase-adminsdk-fbsvc-6f8f14c41d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = {db , admin} ;
