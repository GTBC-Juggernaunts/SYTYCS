import { firebaseAuth } from "./authorization.js";
import { triviaAPI } from "./trivia.js";

// Initialize Materialize
M.AutoInit();

$(document).ready(function() {
  console.log("document ready...");
  //Listener for player dropping from game
  firebaseAuth.hostListener();
})
