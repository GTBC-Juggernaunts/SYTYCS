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
  database.ref(`game/activeUsers/${firebaseAuth.uid}/`).once('value', function(snapshot){
    if(snapshot.val().isHost){
      game.startGame();
    }
  });

  // Listener for question changes
  QaAref.on('value',function(snapshot){
    triviaAPI.onQuestionChange(snapshot.val().question, snapshot.val().answers, snapshot.val().correctAnswer)
  })

});
