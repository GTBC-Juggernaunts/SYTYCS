import { config } from "./firebase.js";
import { firebaseAuth } from "./authorization.js";
import { auth } from "./authorization.js";
import { triviaAPI } from "./trivia.js";

const database = firebase.database();
console.log("leaderboard js is here...");
firebaseAuth.AuthStateChanged();
triviaAPI.questionReturn();

const leaderRef = database.ref(`/game/activeUsers/`);

leaderRef.on("child_added", snapshot => {
  let name = snapshot.val().displayName;
  userArrayManage(name);
  console.log(`username child add: ${name}`);
  console.log(`arr: ${userArr}`);
});


leaderRef.on("child_removed", snapshot => {
  let name = snapshot.val().displayName;
  userArrayManage(name);
  console.log(`username child removed: ${name}`);
  console.log(`arr: ${userArr}`);
});

let userArr = [];
let userArrayManage = name => {
  let index = userArr.indexOf(name);
  if (index !== -1) {
    userArr.splice(index, 1);
    displayLeader(userArr);
  } else {
    userArr.push(name);
    displayLeader(userArr);
  }
};

function displayLeader(users) {
  $("#leader0").html(`<h6>1st: ${users[0]}</h6>`);
  $("#leader1").html(`<h6>2nd: ${users[1]}</h6>`);
  $("#leader2").html(`<h6>3rd: ${users[2]}</h6>`);
};

// users gets added to array
// array gets displayed on DOM in list
// if user is removed then remove user from array and remove from dom

//for each value in this arr we want to
// push the item to the array
// and push item to dom
