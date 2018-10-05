import { config } from "./firebase.js";
console.log(config);

// create instance of Google provider object
export const auth = firebase.auth();
const provider = new firebase.auth.TwitterAuthProvider();
const database = firebase.database();
const activeUsersRef = database.ref("game/activeUsers/");

// grab login and logout buttons
const logoutBtn = document.getElementById("logout");
const loginBtn = document.getElementById("login");

// database object
export const firebaseAuth = {
  userDisplayName: "",
  loggedIn: "",
  signOut: () => {
    auth.signOut();
  },
  signIn: () => {
    auth
      .signInWithRedirect(provider)
      .them(result => {
        // this gives you a google access token. Used to access the google api
        const token = result.credential.accessToken;
        // the signed-in user info
        const user = result.user;
      })
      .catch(error => {
        // error handling here
        console.log(error);
      });
  },
  AuthStateChanged: () => {
    auth.onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        console.log("FirebaseUser object below");
        console.log(firebaseUser);
        // firebase unique user id
        firebaseAuth.userDisplayName = firebaseUser.displayName;
        console.log(`display name let: ${firebaseAuth.userDisplayName}`);
        logoutBtn.classList.remove("hide");
        loginBtn.classList.add("hide");
        firebaseAuth.loggedIn = true;
        console.log(`user is logged in: ${firebaseAuth.loggedIn}`);
        firebaseAuth.insertActiveUser(firebaseAuth.userDisplayName,firebaseAuth.loggedIn);
        // return firebaseUser.displayName;
      } else {
        logoutBtn.classList.add("hide");
        loginBtn.classList.remove("hide");
        firebaseAuth.loggedIn = false;
        console.log(`user is logged in: ${firebaseAuth.loggedIn}`);
        // return false;
      }
    });
  },
  insertActiveUser: (displayName, loggedIn) => {
    const postData = {
      displayName,
      loggedIn
    };
    activeUsersRef.push(postData);
  }
};

// signs out then authenticated user
$("#logout").on("click", event => {
  firebaseAuth.signOut();
});

// Sign in through twitter
$("#login").on("click", event => {
  firebaseAuth.signIn();
});

// listener for when authentication state changes
firebaseAuth.AuthStateChanged();
