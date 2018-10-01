// Initialize Firebase
const config = {
  apiKey: "AIzaSyB1mTIhOYX96jVOGwxTJ77H73rrCtkyhAc",
  authDomain: "trivia-bootcamp.firebaseapp.com",
  databaseURL: "https://trivia-bootcamp.firebaseio.com",
  projectId: "trivia-bootcamp",
  storageBucket: "trivia-bootcamp.appspot.com",
  messagingSenderId: "15638323154"
};
firebase.initializeApp(config);
const auth = firebase.auth();

// create instance of Google provider object
const provider = new firebase.auth.TwitterAuthProvider();

// signout
const logoutBtn = document.getElementById("logout");
const loginBtn = document.getElementById("login");

// signs out then authenticated user
$("#logout").on("click", event => {
  auth.signOut();
});

// test google sign in
$("#login").on("click", event => {
  auth
    .signInWithRedirect(provider)
    .them(result => {
      // this gives you a google access token. Used to access the google api
      const token = result.credential.accessToken;
      // the signed-in user info
      const user = result.user;
      console.log(`user: ${user}`);
      console.log(`token: ${token}`);
    })
    .catch(error => {
      // error handling here
      const errorCode = error.code;
      const errorMessage = error.message;
      // email of user's account used
      const email = error.email;
      // firebase auth auth credential type that was used
      const credential = error.credential;
      console.log(errorCode);
      console.log(errorMessage);
      console.log(email);
      console.log(credential);
    });
});

// real time authentication state listener
auth.onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    firebase.auth.Auth.Persistence.SESSION;
    console.log("FirebaseUser object below");
    console.log(firebaseUser);
    // firebase unique user id
    console.log(`Firebase uid: ${firebaseUser.uid}`);
    console.log(`displayName: ${firebaseUser.displayName}`);
    logoutBtn.classList.remove("hide");
    loginBtn.classList.add("hide");
  } else {
    console.log("not logged in");
    logoutBtn.classList.add("hide");
    loginBtn.classList.remove("hide");
  }
});
