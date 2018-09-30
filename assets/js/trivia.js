const

triviaAPI = {
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
      triviaAPI.shuffle(answers);
      console.log(results.correct_answer);
      console.log(answers);
      triviaAPI.displayQ(results.question, answers);
    });
  },

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

  displayQ: function(question,answers) {
    $("#question").html(`<h4>${question}</h4>`);
    $("#answer1").text(answers[0]);
    $("#answer2").text(answers[1]);
    $("#answer3").text(answers[2]);
    $("#answer4").text(answers[3]);
  },
};


