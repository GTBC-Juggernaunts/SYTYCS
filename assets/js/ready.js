import { firebaseAuth } from "./authorization.js";
import { triviaAPI } from "./trivia.js";
import { config } from "./firebase.js";
const database = firebase.database();

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

  triviaAPI.questionReturn();

  //Listener for question changes
  // database.ref("game/QandAs/").on('value', snapshot => {
  //   triviaAPI.onQuestionChange(snapshot.val())
  // });

});
