import { firebaseAuth } from "./authorization.js";
import { triviaAPI } from "./trivia.js";


  console.log("document ready...");
  //Listener for player dropping from game
  firebaseAuth.hostListener();
