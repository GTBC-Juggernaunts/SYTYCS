import { config } from "./firebase.js";
import { firebaseAuth } from "./authorization.js";
import { auth } from "./authorization.js";
import { triviaAPI } from "./trivia.js";

const database = firebase.database();
console.log("leaderboard js is here...");
firebaseAuth.AuthStateChanged();
// triviaAPI.questionReturn();

const leaderRef = database.ref(`/game/activeUsers/`);

leaderRef.on("child_added", snapshot => {
  let displayName = snapshot.val().displayName;
  let userPoints = snapshot.val().userPoints;
  userArrayManage(displayName);
  console.log(`username child add: ${name}`);
  console.log(`arr: ${userArr}`);
});

leaderRef.on("child_removed", snapshot => {
  let displayName = snapshot.val().displayName;
  let displayPoints = snapshot.val().userPoints;
  userArrayManage(displayName, displayPoints);
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

function displayLeader(users, points) {
  if (userArr.length > 3) {
    $("#leader0").html(`<h6>1st: ${users[0]} - ${points} points</h6>`);
    $("#leader1").html(`<h6>2nd: ${users[1]} - ${points} points</h6>`);
    $("#leader2").html(`<h6>3rd: ${users[2]} - ${poitns} points</h6>`);
  } else {
    $("#leader0").html(`<h6>Waiting For More Players To Join</h6>`);
  }
}

// var userMap = new Map();
// userMap.set(0, "zero");
// userMap.set(1, "one");
// for (var [key, value] of userMap) {
//   console.log(key + " = " + value);
//   console.log(userMap);
//   console.log(key);
//   console.log(value);
// }
// 0 = zero
// 1 = one

// users gets added to array
// array gets displayed on DOM in list
// if user is removed then remove user from array and remove from dom

//for each value in this arr we want to
// push the item to the array
// and push item to dom

// we dont' have to limit the amount of users in the array to 3
// we just need to sort by top points field and display first 3 indices of array
