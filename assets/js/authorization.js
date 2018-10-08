import { config } from "./firebase.js";
import { triviaAPI } from "./trivia.js";

// create instance of Google provider object
export const auth = firebase.auth();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const githubAuthProvider = new firebase.auth.GithubAuthProvider();
const database = firebase.database();

// grab login and logout buttons
const logoutBtn = document.getElementById("logout");
const loginBtn = document.getElementById("loginModalBtn");

//grab username and password input
// const userEmail = $("#user-email").val();
// const userPassword = $("#user-password").val();

// database object
export const firebaseAuth = {
  gameRef: database.ref("game/"),
  activeHostRef: database.ref("game/activeHost"),
  activeUsersRef: "",
  userDisplayName: "",
  loggedIn: "",
  uid: "",
  gameIsHost: "",
  isHost: false,
  timestamp: Date.now(),
  signOut: () => {
    auth.signOut();
  },
  createUser: () => {
    let email = $("#user-email").val();
    let password = $("#user-password").val();
    auth.createUserWithEmailAndPassword(email, password).catch(error => {
      console.log(error);
      console.log(email);
    });
  },
  signIn: authProvider => {
    auth
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(function() {
        return auth.signInWithRedirect(authProvider).then(result => {
          console.log(result);
          console.log(email);
        });
      })
      .catch(error => {});
  },
  AuthStateChanged: () => {
    auth.onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        console.log("FirebaseUser object below");
        console.log(firebaseUser);
        // grab display name
        firebaseAuth.userDisplayName = firebaseUser.displayName;
        if (firebaseUser.displayName !== null) {
          firebaseAuth.userDisplayName = firebaseUser.displayName;
        } else {
          firebaseAuth.userDisplayName = firebaseUser.email;
        }
        // grab unique user id
        firebaseAuth.uid = firebaseUser.uid;
        // create unique ref under activeUsers with the uid
        firebaseAuth.activeUsersRef = database.ref(
          `game/activeUsers/${firebaseAuth.uid}`
        );
        firebaseAuth.loggedIn = true;
        // hide login or logout buttons depending on if user is authenticated
        firebaseAuth.swapLoginBtn(firebaseAuth.loggedIn);
        console.log(`user is logged in: ${firebaseAuth.loggedIn}`);
        firebaseAuth.insertActiveUser(
          firebaseAuth.userDisplayName,
          firebaseAuth.loggedIn,
          firebaseAuth.timestamp,
          firebaseAuth.isHost
        );
        firebaseAuth.gameHostCheck();
        // disconnect logic here
        firebaseAuth.activeUsersRef.onDisconnect().remove();
      } else {
        firebaseAuth.loggedIn = false;
        firebaseAuth.swapLoginBtn(firebaseAuth.loggedIn);
        console.log(`firebase uid: ${firebaseAuth.uid}`);
        console.log(`user is logged in: ${firebaseAuth.loggedIn}`);
        firebaseAuth.activeUsersRef = database.ref(
          `game/activeUsers/${firebaseAuth.uid}`
        );
        if (firebaseAuth.isHost) {
          firebaseAuth.gameRef.update({
            activeHost: false
          });
        }
        firebaseAuth.activeUsersRef.remove();
      }
    });
  },
  insertActiveUser: (displayName, loggedIn, timestamp, isHost) => {
    const postData = {
      displayName,
      loggedIn,
      timestamp,
      isHost
    };
    firebaseAuth.activeUsersRef.set(postData);
  },
  gameHostCheck: () => {
    firebaseAuth.activeHostRef.once("value").then(snapshot => {
      console.log(`game host check object: ${snapshot.val()}`);
      if (snapshot.val() === false) {
        console.log("looking for new host");
        database
          .ref("game/activeUsers/")
          .once("value")
          .then(usersSnapshot => {
            let lowestTimestamp = 9999999999999;
            let newHost = "";
            usersSnapshot.forEach(user => {
              if (user.val().timestamp < lowestTimestamp) {
                newHost = user.key;
                lowestTimestamp = user.timestamp;
              }
              console.log(`new possible host: ${newHost}`);
            });
            console.log(`new host determined: ${newHost}`);
            if (newHost === firebaseAuth.uid) {
              console.log("setting new host");
              firebaseAuth.isHost = true;
              database
                .ref(`game/activeUsers/${firebaseAuth.uid}/`)
                .update({
                  isHost: true
                })
                .then(function() {
                  firebaseAuth.gameRef.update({
                    activeHost: true
                  });
                });
            }
          });
      }
    });
  },
  hostListener: function() {
    database.ref("game/activeUsers").on("child_removed", function(data) {
      firebaseAuth.gameHostCheck();
      if (firebaseAuth.isHost) {
        triviaAPI.questionReturn();
      }
    });
  },
  swapLoginBtn: status => {
    if (status) {
      $("#loginModalBtn")
        .attr("data-tooltip", "Logout Game")
        .text("Logout");
      loginBtn.classList.remove("modal-trigger");
    } else {
      $("#loginModalBtn")
        .attr("data-tooltip", "Login to play the game")
        .text("Login");
    }
  }
};

//signs up new user
$("#auth-sign-in").on("click", event => {
  firebaseAuth.createUser();
});

// signs out then authenticated user
$(".logout").on("click", event => {
  firebaseAuth.signOut();
  loginBtn.classList.add("modal-trigger");
});

// Sign in through google
$("#google-login").on("click", event => {
  firebaseAuth.signIn(googleAuthProvider);
});

// Sign in through github
$("#github-login").on("click", event => {
  firebaseAuth.signIn(githubAuthProvider);
});

firebaseAuth.AuthStateChanged();
