import {
  firebaseAuth
} from "./authorization.js";
import {
  triviaAPI
} from "./trivia.js";
import {
  game
} from "./trivia.js";
import {
  config
} from "./firebase.js";
const database = firebase.database();
const QaAref = database.ref("game/QandAs/");

// Initialize Materialize
M.AutoInit();


$(document).ready(function () {
  console.log("document ready...");
  //Listener for player dropping from game
  firebaseAuth.hostListener();
  console.log('Page loaded')

  //Temporary listener for if user is host to start game
  console.log(`checking firebaseAuth isHost: ${firebaseAuth.isHost}`);

  // Makes sure 1st user is set as the host
  // As soon as 3 people join the game will start
  database.ref(`game/activeUsers`).on('child_added', function (snapshot) {
    console.log('checking active users');
    if (Object.keys(snapshot.val()).length === 1 && firebaseAuth.loggedIn) {
      console.log(`Assigning the first person and the only person as the host`)
      firebaseAuth.isHost = true;
      database.ref(`game/activeUsers/${firebaseAuth.uid}/`)
        .update({
          isHost: true
        })
        .then(function () {
          firebaseAuth.gameRef.update({
            activeHost: true
          })
        })
    } else if (firebaseAuth.isHost && Object.keys(snapshot.val()).length === 3) {
      console.log('starting game');
      setTimeout(game.startGame, 10000);
    }
  });


  // Listener for question changes
  QaAref.on('value', function (snapshot) {
    let response = snapshot.val();
    triviaAPI.onQuestionChange(response.question, response.answers, response.correctAnswer, response.activeQuestion, response.currentQ)
  })
});