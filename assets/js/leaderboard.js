import { config } from "./firebase.js";
import { firebaseAuth } from "./authorization.js";
import { auth } from "./authorization.js";
import { triviaAPI } from "./trivia.js";

const database = firebase.database();

const leaderRef = database.ref(`/game/activeUsers/`);

let userArr = [];

// listener for when user logins
leaderRef.on("child_added", snapshot => {
  let displayName = snapshot.val().displayName;
  let userPoints = snapshot.val().points;
  if (!isUserExist(userArr, displayName)) {
    userArr.push({ name: displayName, score: userPoints });
  }
  displayLeader(userArr);
  console.log(`username child add: ${displayName}`);
  console.log(userArr);
});

// listener for when user logouts
leaderRef.on("child_removed", snapshot => {
  let displayName = snapshot.val().displayName;
  userArr = removeUser(userArr, displayName);
  displayLeader(userArr);
  console.log(`username child removed: ${displayName}`);
  console.log(`arr: ${JSON.parse(userArr)}`);
});

// function to a handle is a user exists
function isUserExist(arr, name) {
  // if one user in the array has the same name as the argument passed in it returns true otherwise return false
  return arr.some(user => user.name === name);
}

// function to handle removing a user
function removeUser(arr, name) {
  // if the name being passed in as an argument doesn't exist int he userArr then add it
  return arr.filter(user => user.name !== name);
}

// function to sort players by their score
userArr.sort(function(a, b) {
  if (a.score > b.score) {
    return -1;
  }
  if (a.score < b.score) {
    return 1;
  }
  // scores must be equal
  return 0;
});

// even if user is not logged in display the leaderboard
displayLeader(userArr);

// displays top 3 leaders to the dom
function displayLeader(array) {
  if (userArr.length >= 3) {
    $("#leader0").html(
      `<h6>1st: ${array[0].name} - ${array[0].score} points</h6>`
    );
    $("#leader1").html(
      `<h6>2nd: ${array[1].name} - ${array[1].score} points</h6>`
    );
    $("#leader2").html(
      `<h6>3rd: ${array[2].name} - ${array[2].score} points</h6>`
    );
  } else {
    $("#leader0").html(`<h6>Waiting For More Players To Join</h6>`);
  }
}
