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

// get elements
const txtEmail = $("#email");
const txtPassword = $("#password");


// add login event lister for existing user
$("#loginBtn").on("click", event => {
  const email = $("#email").val();
  const pass = $("#password").val();
  const auth = firebase.auth();
  const signInExistingUser = auth.signInWithEmailAndPassword(email, pass);
  signInExistingUser.catch(event => console.log(event.message));
});

// sign up event listener for new user
$("#signupBtn").on("click", event => {
  const email = $("#email").val();
  const pass = $("#password").val();
  const signInNewUser = auth.createUserWithEmailAndPassword(email, pass);
  signInNewUser.catch(event => console.log(event.message));
});

// signs out then authenticated user
$("#logoutBtn").on("click", event => {
  auth.signOut();
});

// real time authentication state listener
auth.onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    console.log(firebaseUser);
    // firebase unique user id
    console.log(firebaseUser.uid);
    logoutBtn.classList.remove("hide");
  } else {
    console.log("not logged in");
    logoutBtn.classList.add("hide");
  }
});
