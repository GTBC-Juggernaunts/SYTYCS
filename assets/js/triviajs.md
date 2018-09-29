# Process - Flow
* User Logs In
    * If Session is active - User is view only / has to wait
    * If Session is inactive -
        * If Session has no registered users - User is registered as host
        * If Session has registered users - User is registered as player
    * Session timer begins once 3 users (rows) have been added
* Session/Game Begins once timer runs out
    * Host's browser sets game session to Active
    * Host's browser uses trivia API to retrieve question
    * Host's browsers sends update to DB for game session with question 1
    * On update, all player's browsers receive question 1
        * On receipt of question, interval begins decrementing points
        * Decrement stops when user selects a displayed answer
        * If correct answer - points are set in DB for user session
        * If incorrect answer - 0 points are set in DB for user session
    * After question time is done - host browser pulls all session users and sets top 3 for display
    * If question # is 10 - Game is ended
    * Game status is set to inactive
    
## Considerations
* What happens when a host leaves the game?
   
 
