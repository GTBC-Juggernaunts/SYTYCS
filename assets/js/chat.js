import { config } from "./firebase.js";
import { firebaseAuth } from "./authorization.js";
import {auth} from "./authorization.js";

const database = firebase.database();
const messages = database.ref('/messages');

const userActions = {
  userDisplayName: `${firebaseAuth.userDisplayName}`,
//   loggedIn: firebaseAuth.loggedIn,
  insertActiveUser: () => {
    if (firebaseAuth.loggedIn) {
    //   console.log(`logged in: ${firebaseAuth.loggedIn}`);
    //   console.log(firebaseAuth.loggedIn);
    } else {
    //   console.log(`logged in: ${firebaseAuth.loggedIn}`);
    //   console.log(firebaseAuth.loggedIn);
    }
  }
}

// LISTENER:
// Take user input and add it to the databse
$('#trash-talk').click( () => {
  let trashTalk = $('#trash-talk-message').val().trim()
  event.preventDefault();
  console.log(trashTalk);

  //Write the message to the databse
  messages.push({
      message: trashTalk
  })
});

// DB LISTENER:
// Write messages to chat box
messages.on('child_added', snapshot => {
  $('.trash-talk-chat').append(`<h6> ${snapshot.val().message}`);
  $('#trash-talk-message').val('');
})
