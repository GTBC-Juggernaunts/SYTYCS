//=====================================================================================================================
//Trivia API and all related methods
//=====================================================================================================================

const triviaAPI = {
  queryUrl:'https://opentdb.com/api.php?amount=1&difficulty=easy&type=multiple',
  questionReturn: function () {
    $.ajax({
      url: queryUrl,
      method: "GET",
    }).then(response => {
      console.log(response);
      let answers = [];
      let results = response.results[0];
      answers.push(results.correct_answer);
      results.incorrect_answers.forEach(answer => {
        answers.push(answer)
      });
      game.currentQStatus = "Active";
      game.correctAnswer = results.correct_answer;
      triviaAPI.shuffle(answers);
      console.log(results.correct_answer);
      console.log(answers);
      game.displayQ(results.question, answers);
    });
  },

  //Taken from stack overflow @ https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
  shuffle: function (a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  },
  //END OF STEALING

};

//=====================================================================================================================
//Game Methods
//=====================================================================================================================

const game = {
  points: 0,
  questionTimer: 10,
  questionIntervalId,
  intervalId,
  userPoints: 0,
  currentQStatus: "Inactive",
  correctAnswer: "",
  displayQ: function(question,answers) {
    $("#question").html(`<h4>${question}</h4>`);
    $("#answer1").text(answers[0]);
    $("#answer2").text(answers[1]);
    $("#answer3").text(answers[2]);
    $("#answer4").text(answers[3]);
  },
  decrement: function(){
    game.points -= 1;
  },
  startTimer: function() {
    game.questionIntervalId = setInterval(()=>{
      game.questionTimer -= 1;
      if(game.questionTImer === 0) {
        game.endQuestion;
      }
    },1000);
    game.intervalId = setInterval(decrement, 10);
  },
  endQuestion: function(){
    game.currentQStatus = "Inactive";
    setTimeout(triviaAPI.questionReturn,3000)
  },
  onClick: function(answer) {
   clearInterval(intervalId);
   if(answer === game.correctAnswer && game.currentQStatus === "Active"){
     game.userPoints += game.points;
     game.currentQStatus = "Inactive";
   }
   else{
     game.currentQStatus = "Inactive";
   }
  }
};




//=====================================================================================================================
//Game Runtime
//=====================================================================================================================
