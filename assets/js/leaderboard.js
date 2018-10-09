import { config } from "./firebase.js";
import { firebaseAuth } from "./authorization.js";
import { auth } from "./authorization.js";
import { triviaAPI } from "./trivia.js";

const database = firebase.database();
firebaseAuth.AuthStateChanged();
// triviaAPI.questionReturn();

const leaderRef = database.ref(`/game/activeUsers/`);

let userArr = [{ name: "peter", score: 10 }, { name: "mario", score: 1000 }];

userArr.push({ name: "joseph", score: 1 });
console.log(userArr);

// listener for when user logins
leaderRef.on("child_added", snapshot => {
  let displayName = snapshot.val().displayName;
  let userPoints = snapshot.val().userPoints;
  if (!isUserExist(userArr, displayName)) {
    userArr.push({ name: displayName, score: userPoints });
  }
  console.log(`username child add: ${displayName}`);
  console.log(userArr);
});

// listener for when user logouts
leaderRef.on("child_removed", snapshot => {
  let displayName = snapshot.val().displayName;
  let displayPoints = snapshot.val().userPoints;
  userArr = removeUser(userArr, displayName);
  console.log(`username child removed: ${displayName}`);
  console.log(`arr: ${userArr}`);
});
function isUserExist(arr, name) {
  // if one user in the array has the same name as the argument passed in it returns true otherwise return false
  return arr.some(user => user.name === name);
}
function removeUser(arr, name) {
  // if the name being passed in as an argument doesn't exist int he userArr then add it
  return arr.filter(user => user.name !== name);
}

// function to sort players
userArr.sort(function(a, b) {
  if (a.score < b.score) {
    return -1;
    console.log(userArr);
  }
  if (a.score > b.score) {
    return 1;
    console.log(userArr);
  }
  // scores must be equal
  return 0;
  console.log(userArr);
});

// displays leaders to the dom
function displayLeader(users, points) {
  if (userArr.length >= 3) {
    $("#leader0").html(`<h6>1st: ${users[0]} - ${points} points</h6>`);
    $("#leader1").html(`<h6>2nd: ${users[1]} - ${points} points</h6>`);
    $("#leader2").html(`<h6>3rd: ${users[2]} - ${points} points</h6>`);
    console.log(userArr.length);
  } else {
    $("#leader0").html(`<h6>Waiting For More Players To Join</h6>`);
    console.log(userArr.length);
  }
}

// users gets added to array
// array gets displayed on DOM in list
// if user is removed then remove user from array and remove from dom

//for each value in this arr we want to
// push the item to the array
// and push item to dom

// we dont' have to limit the amount of users in the array to 3
// we just need to sort by top points field and display first 3 indices of array
