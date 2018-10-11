import { config } from "./firebase.js";
import { firebaseAuth } from "./authorization.js";
import { auth } from "./authorization.js";
import { triviaAPI } from "./trivia.js";

const database = firebase.database();

const leaderRef = database.ref(`/game/activeUsers/`);

let userArr = [];

// listener for when user logins
leaderRef.on("child_changed", function(snapshot) {
  let displayName = snapshot.val().displayName;
  let userPoints = snapshot.val().points;
  let newScore = { name: displayName, score: userPoints };
  // checks if user already exists in array if not then add them
  if (!isUserExist(userArr, displayName)) {
    userArr.push({ name: displayName, score: userPoints });
    displayLeader(userArr);
  } else {
    // loops through array to remove the existing user to update their score with  newScore
    for (var i = 0; i < userArr.length; i++) {
      if (userArr[i].name == displayName) {
        userArr.splice(i, 1);
      }
    }
    userArr.push(newScore);
    sortPlayerScores();
    displayLeader(userArr);
  }
});

// listener for when user logouts then remove them from the array and dom
leaderRef.on("child_removed", snapshot => {
  let displayName = snapshot.val().displayName;
  userArr = removeUser(userArr, displayName);
  displayLeader(userArr);
});

// function to handle is a user exists
function isUserExist(arr, name) {
  // if one user in the array has the same name as the argument passed in it returns true otherwise return false
  return arr.some(user => user.name === name);
}

// function to handle removing a user
function removeUser(arr, name) {
  // if the name being passed in as an argument doesn't exist in the userArr then add it
  return arr.filter(user => user.name !== name);
}

// function to sort players by their score
function sortPlayerScores() {
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
}

//execute this to display message
displayLeader(userArr);

// displays top 3 leaders to the dom if 3 players are present if not display waiting message
function displayLeader(array) {
  if (userArr.length >= 3) {
    console.log(`updating the display with new array`);
    console.log(array);
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
