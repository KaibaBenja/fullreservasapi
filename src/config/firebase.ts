import admin from "firebase-admin";

const serviceAccount = require("../config/firebaseServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "fullreservas-api",
});

export default admin;
