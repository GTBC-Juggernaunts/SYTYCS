import config from "./firebase.js";
import firebaseAuth from "./firebase.js";

export const database = firebase.database();
const sessionDB = database.ref("Game/Session");
const userDB = database.ref("Game/Session/User");

