import { config } from "./firebase.js";
import { firebaseAuth } from "./authorization.js";
import {auth} from "./authorization.js";

const database = firebase.database();
// console.log(`below is the database object bruh`);
// console.log(database);

const userActions = {
  userDisplayName: `${firebaseAuth.userDisplayName}`,
//   loggedIn: firebaseAuth.loggedIn,
  insertActiveUser: () => {
    if (firebaseAuth.loggedIn) {
    //   console.log(`logged in: ${firebaseAuth.loggedIn}`);
    //   console.log(firebaseAuth.loggedIn);
    } else {
    //   console.log(`logged in: ${firebaseAuth.loggedIn}`);
    //   console.log(firebaseAuth.loggedIn);
    }
  }
}
userActions.insertActiveUser();

