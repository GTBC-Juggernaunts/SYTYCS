import { firebaseAuth } from "./authorization.js";
import { triviaAPI } from "./trivia.js";
import { game } from "./trivia.js";
import { config } from "./firebase.js";
const database = firebase.database();
const QaAref = database.ref("game/QandAs/");

// Initialize Materialize
M.AutoInit();


$(document).ready(function() {
  console.log("document ready...");
  //Listener for player dropping from game
  firebaseAuth.hostListener();

  //Temporary listener for if user is host to start game
  console.log(`checking firebaseAuth isHost: ${firebaseAuth.isHost}`);
  // if(firebaseAuth.isHost){
  //   triviaAPI.questionReturn();
  // }

  game.currentQ = 1;
  database.ref('game').child('activeGame').once('value', function (snapshot) {
    console.log(`activeGame: ${snapshot.val()}`);
    //console.log(`firsbaseauth.is host is: ${firebaseAuth.isHost} and number of users is ${Object.keys(snapshot.val()).length >= 3}`);
    if (!snapshot.val()) {
      database.ref(`game/activeUsers`).on('value', function (snapshot) {
        console.log('checking active users');
        console.log(Object.keys(snapshot.val()).length);
        if (Object.keys(snapshot.val()).length === 1 && firebaseAuth.loggedIn) {
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
        }
        else if
        (firebaseAuth.isHost && Object.keys(snapshot.val()).length >= 3) {
          console.log('starting game');
          setTimeout(game.startGame(), 10000);
        }
      });
    }
  });


  // Listener for question changes
  QaAref.on('value', function (snapshot) {
    let response = snapshot.val();
    triviaAPI.onQuestionChange(response.question, response.answers, response.correctAnswer, response.activeQuestion)
  })
});