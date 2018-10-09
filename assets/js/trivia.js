//=====================================================================================================================
//Import Modules
//=====================================================================================================================

import {
  firebaseAuth
} from "./authorization.js";

//=====================================================================================================================
//Trivia API and all related methods
//=====================================================================================================================

export const triviaAPI = {
  queryUrl: "https://opentdb.com/api.php?amount=1&difficulty=easy&type=multiple&encode=base64",

  // Grab Questions from the API
  // Unselect any anuwer that may have been selected for the given round
  questionReturn: function () {
    game.unselector();
    $.ajax({
      url: triviaAPI.queryUrl,
      method: "GET"
    }).then(response => {
      console.log(response);
      let answers = [];
      let results = response.results[0];
      answers.push(atob(results.correct_answer));
      results.incorrect_answers.forEach(answer => {
        answers.push(atob(answer));
      });
      game.currentQStatus = "Active";
      game.correctAnswer = (results.correct_answer);
      triviaAPI.shuffle(answers);
      console.log(`correct answer: ${results.correct_answer}`);
      game.displayQ(atob(results.question), answers);
      game.startTimer();
    });
  },

  //Stolen shamelessly from stack overflow @ https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
  shuffle: function (a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }
  //END OF STEALING #MUSA
};

//=====================================================================================================================
//Game Methods
//=====================================================================================================================


// Game object
export const game = {
  userId: "",
  sessionId: "",
  isActive: false,
  points: 0,
  questionTimer: 10,
  questionIntervalId: "",
  intervalId: "",
  userPoints: 0,
  currentQStatus: "Inactive",
  correctAnswer: "",
  selectedAnswer: "",
  selectionTimer: 0, //masking name of variable so people don't immediately change it

  // Methods
  // Display the Questions
  displayQ: function (question, answers) {
    $("#question").html(`<h4>${question}</h4>`);
    $("#answer1").text(answers[0]);
    $("#answer2").text(answers[1]);
    $("#answer3").text(answers[2]);
    $("#answer4").text(answers[3]);
  },

  // Decrease points in game and reflect in progress bar
  decrementPoints: function () {
    game.points -= 1;
    $("#progress-bar-value").text(`${game.points}pts`);
    $("#progress-bar-value").css("width", (1000 - game.points) / 10 + '%')
  },

  // Decrease question timer
  decrementQ: function () {
    game.questionTimer -= 1;
    if (game.questionTimer === 0) {
      game.points = 1;
      game.decrementPoints();
      game.endQuestion();
    }
  },

  // Start timer for a given question
  startTimer: function () {
    game.questionTimer = 10;
    game.points = 1000;
    game.questionIntervalId = setInterval(game.decrementQ, 1000);
    game.intervalId = setInterval(game.decrementPoints, 10);
    $("#progress-bar-value").text('1000pts')
  },

  // Assign player points and clear Q&A block for next question
  endQuestion: function () {
    game.currentQStatus = "Inactive";
    clearInterval(game.questionIntervalId);
    clearInterval(game.intervalId);
    console.log(`Possible Points: ${game.selectionTimer}`);
    console.log("End of question");
    //check for if answer matches the correct answer
    if (game.selectedAnswer === atob(game.correctAnswer)) {
      console.log(`Correct!`);
      game.userPoints += game.selectionTimer;
      console.log(game.userPoints);
      game.currentQStatus = "Inactive";
    } else {
      game.currentQStatus = "Inactive";
      console.log(`Correct Answer: ${atob(game.correctAnswer)}`);
    }
    if (firebaseAuth.isHost === true) {
      setTimeout(triviaAPI.questionReturn, 3000);
    }
  },

  //  Unselect any answer from the board
  unselector: function () {
    let collections = $(".answer");
    for (let i = 0; i < collections.length; i++) {
      $(collections[i]).parent().removeClass('active');
    }
  },

  // Determine which answer a user selected and if within the window of an active question
  onClick: function (event) {
    if (game.currentQStatus === "Inactive") {
      console.log("Question not active.")
    } else {
      game.unselector();
      game.selectedAnswer = event[0].target.innerText;
      game.selectionTimer = game.points;
      $(event[0].target).parent().addClass('active');
    }
  }
};

//=====================================================================================================================
//Game Runtime
//=====================================================================================================================

if (firebaseAuth.isHost === true) {
  triviaAPI.questionReturn();
}
$(".answer").click(event => {
  game.onClick($(event));
});