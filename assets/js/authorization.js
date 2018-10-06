import { config } from "./firebase.js";
console.log(config);

// create instance of Google provider object
export const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const database = firebase.database();

// ref for checking if user isHost
// const isHostRef = database.ref('games/activeUsers/');

// grab login and logout buttons
const logoutBtn = document.getElementById("logout");
const loginBtn = document.getElementById("login");

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
  signIn: () => {
    auth
      .signInWithRedirect(provider)
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      });
  },
  AuthStateChanged: () => {
    auth.onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        console.log("FirebaseUser object below");
        console.log(firebaseUser);
        // grab display name
        firebaseAuth.userDisplayName = firebaseUser.displayName;
        // grab unique user id
        firebaseAuth.uid = firebaseUser.uid;
        // create unique ref under activeUsers with the uid
        firebaseAuth.activeUsersRef = database.ref(
          `game/activeUsers/${firebaseAuth.uid}`
        );
        // hide login or logout buttons depending on if user is authenticated
        logoutBtn.classList.remove("hide");
        loginBtn.classList.add("hide");
        firebaseAuth.loggedIn = true;
        console.log(`user is logged in: ${firebaseAuth.loggedIn}`);
        firebaseAuth.insertActiveUser(
          firebaseAuth.userDisplayName,
          firebaseAuth.loggedIn,
          firebaseAuth.timestamp,
          firebaseAuth.isHost
        );
        firebaseAuth.gameHostCheck();
      } else {
        logoutBtn.classList.add("hide");
        loginBtn.classList.remove("hide");
        firebaseAuth.loggedIn = false;
        firebaseAuth.activeUsersRef = database.ref(
          `game/activeUsers/${firebaseAuth.uid}`
        );
        if(firebaseAuth.isHost){
          firebaseAuth.gameRef.update({
            activeHost: false
          })
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
  userHostChecker: () => {
    ref
      .child("activeUsers")
      .equalTo("true")
      .once("value", snapshot => {
        if (snapshot.exists()) {
          return false;
        } else {
          return true;
        }
      });
  },
  gameHostCheck: () => {
      firebaseAuth.activeHostRef.once('value')
      .then(snapshot=>{
          console.log(`game host check object: ${snapshot.val()}`);
        if (snapshot.val() === false) {
          console.log("looking for new host");
          database.ref("game/activeUsers/").once('value')
              .then(usersSnapshot => {
                let lowestTimestamp = 9999999999999;
                let newHost = "";
                usersSnapshot.forEach(user=>{
                  if (user.val().timestamp < lowestTimestamp){
                    newHost = user.key;
                    lowestTimestamp = user.timestamp;
                  }
                console.log(`new possible host: ${newHost}`)
                });
                console.log(`new host determined: ${newHost}`);
                if (newHost === firebaseAuth.uid) {
                  console.log("setting new host");
                  firebaseAuth.isHost = true;
                  database.ref(`game/activeUsers/${firebaseAuth.uid}/`).update({
                    isHost: true
                  })
                      .then(function(){
                        firebaseAuth.gameRef.update({
                          activeHost: true
                        })
                      })
                }
              })
        }
      })
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

// if ishost = true exists then set ishost = false else isHost = true

//every user must have an email
// firebase.database().ref(`users/${userId}/email`).once("value", snapshot => {
//     if (snapshot.exists()){
//        console.log("exists!");
//        const email = snapshot.val();
//      }
//  });

//  ref.child("users").orderByChild("ID").equalTo("U1EL5623").once("value",snapshot => {
//     if (snapshot.exists()){
//       const userData = snapshot.val();
//       console.log("exists!", userData);
//     }
// });
