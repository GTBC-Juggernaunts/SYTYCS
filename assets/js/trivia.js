//=====================================================================================================================
//Import Modules
//=====================================================================================================================

import {
  firebaseAuth,
  auth
} from "./authorization.js";
import {
  config
} from "./firebase.js";

const database = firebase.database();
//=====================================================================================================================
//Trivia API and all related methods
//=====================================================================================================================

export const triviaAPI = {
  newGame: false,
  queryUrl: "https://opentdb.com/api.php?amount=1&difficulty=easy&type=multiple&encode=base64",

  // Grab Questions from the API
  // Unselect any anuwer that may have been selected for the given round
  questionReturn: function () {
    game.unselector();
    $.ajax({
      url: triviaAPI.queryUrl,
      method: "GET"
    }).then(response => {
      console.log("host question received");
      let answers = [];
      let results = response.results[0];
      answers.push(atob(results.correct_answer));
      results.incorrect_answers.forEach(answer => {
        answers.push(atob(answer));
      });
      triviaAPI.shuffle(answers);
      //answers now stored in random order inside 'answers' array on host computer
      console.log("pushing question");
      game.currentQ += 1;
      if (triviaAPI.newGame === true) {
        game.currentQ = 1;
        triviaAPI.newGame = false;
      }
      triviaAPI.hostPushQuestion(results.question, answers, results.correct_answer, game.currentQ)
    });
  },

  onQuestionChange: function (question, answers, correctAnswer, activeQuestion, currentQ) {
    if (activeQuestion) {
      game.currentQ = currentQ
      game.unselector();
      game.displayQ(atob(question), answers);
      game.currentQStatus = "Active";
      game.correctAnswer = correctAnswer;
      clearInterval(game.questionIntervalId);
      clearInterval(game.intervalId);
      game.startTimer();
    }
  },

  hostPushQuestion: function (question, answers, correctAnswer, currentQ) {
    database.ref("game/QandAs/").update({
      question,
      answers,
      correctAnswer,
      currentQ,
      activeQuestion: true,
    });
    setTimeout(function () {
      database.ref("game/QandAs/").update({
        activeQuestion: false,
      })
    }, 10);
    console.log(`question ${game.currentQ} pushed`)
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
  points: 0,
  questionTimer: 10,
  questionIntervalId: "",
  intervalId: "",
  userPoints: 0,
  currentQStatus: "Inactive",
  correctAnswer: "",
  selectedAnswer: "",
  selectionTimer: 0, //masking name of variable so people don't immediately change it
  currentQ: 0,

  startGame: function () {
    triviaAPI.newGame = true
    database.ref('game/QandAs/').update({
      currentQ: 1,
    }).then(triviaAPI.questionReturn());
  },

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

    //sets coloring on correct/incorrect answers
    let collections = $(".answer");
    console.log("activate color changing technology");
    for (let i = 0; i < collections.length; i++) {
      if(collections[i].innerText === atob(game.correctAnswer)){
        $(collections[i]).parent().addClass('correct')
      }
      else {
         $(collections[i]).parent().addClass('incorrect');
      }
    }

    // Check for if selected answer matches the correct answer
    // Checks if current user is logged in before adding points otherwise we get dangling points in game object

    if (game.selectedAnswer === atob(game.correctAnswer)) {
      console.log(`Correct!`);
      game.userPoints += game.selectionTimer;
      console.log(game.userPoints);
      if (auth.currentUser) {
        console.log(`currentUser: ${auth.currentUser}`);
        console.log(`I'm supposed to receive ${game.userPoints}`);
        database.ref(`game/activeUsers/${firebaseAuth.uid}/`).update({
          points: game.userPoints
        });
        $("#player-points").text(game.userPoints);
      }
      game.currentQStatus = "Inactive";
    } else {
      game.currentQStatus = "Inactive";
      console.log(`Correct Answer: ${atob(game.correctAnswer)}`);
    }

    if (game.currentQ >= 10) {
      setTimeout(function () {
        if (auth.currentUser) {
          database.ref(`game/activeUsers/${firebaseAuth.uid}/`).update({
            points: 0
          })
        }
      }, 2000)
    }

    if (firebaseAuth.isHost === true && game.currentQ < 10) {
      setTimeout(triviaAPI.questionReturn, 3000);
    } else if (firebaseAuth.isHost === true && game.currentQ >= 10) {
      game.endGame();
    }
  },

  endGame: function () {
    game.currentQ = 0;
    console.log("game-over")
    database.ref("game/").update({
      currentQ: game.currentQ,
    });
    // setTimeout(game.startGame, 15000)
  },

  //  Unselect any answer from the board
  unselector: function () {
    let collections = $(".answer");
    for (let i = 0; i < collections.length; i++) {
      $(collections[i]).parent().removeClass('active')
        .removeClass('correct')
        .removeClass('incorrect')
    }
  },

  // Determine which answer a user selected and if within the window of an active question
  selectAnAnswer: function (event) {
    if (game.currentQStatus === "Inactive") {
      console.log("Question not active.")
    }
    // Checked if a user is logged in to determine if points will be awarded for answering 
    else {
      if (auth.currentUser) {
        game.unselector();
        game.selectedAnswer = event[0].target.innerText;
        game.selectionTimer = game.points;
        $(event[0].target).parent().addClass('active');
      }
    }
  },
};

//=====================================================================================================================
//Game Runtime
//=====================================================================================================================

$(".answer").click(event => {
  game.selectAnAnswer($(event));
});