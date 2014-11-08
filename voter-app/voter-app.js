Tasks = new Mongo.Collection("tasks");
//twilio = Twilio("AC21f850538ec9bb250cd0de8b5c0badb3", "eaa95b3091b8866e36c1ec9aa82588e5");
var accountSid = 'AC05a65b25f93c0661020d39873a925618';
var authToken = "7f9b1c480cb2e82a540eec3ccea2a502";
var client = Twilio(accountSid, authToken);

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
  tasks: function () {
    if (Session.get("hideCompleted")) {
      // If hide completed is checked, filter tasks
      return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
    } else {
      // Otherwise, return all of the tasks
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  },
  hideCompleted: function () {
    return Session.get("hideCompleted");
    },
  incompleteCount: function () {
  return Tasks.find({checked: {$ne: true}}).count();
    }
});

  Template.body.events({
  "submit .new-task": function (event) {
    // This function is called when the new task form is submitted

    var text = event.target.text.value;

    Tasks.insert({
    text: text,
    createdAt: new Date(),            // current time
    owner: Meteor.userId(),           // _id of logged in user
    username: Meteor.user().username  // username of logged in user
    });

    // Clear form
    event.target.text.value = "";

    // Prevent default form submit
    return false;
    },
    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
  }

});

// Template.twil.events({
//     'click button': function () {
//       twilio.sendSms({
//       to:'+14049407775', // Any number Twilio can deliver to
//       from: '+15204471690', // A number you bought from Twilio and can use for outbound communication
//       body: 'Message on click' // body of the SMS message
//     }, function(err, responseData) { //this function is executed when a response is received from Twilio
//       if (!err) { // "err" is an error received during the request, if any
//         // "responseData" is a JavaScript object containing data received from Twilio.
//         // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
//         // http://www.twilio.com/docs/api/rest/sending-sms#example-1
//         console.log(responseData.from); // outputs "+14506667788"
//         console.log(responseData.body); // outputs "word to your mother."
//       }
//   });
//     }
//   });
// }

Template.task.events({
  "click .toggle-checked": function () {
    // Set the checked property to the opposite of its current value
    Tasks.update(this._id, {$set: {checked: ! this.checked}});
  },
  "click .delete": function () {
    Tasks.remove(this._id);
  }
});

Template.twilio_test.events({
  "click button": function() {
    //
    console.log("hey");
    Meteor.call("sendsms", "Testing", "+16787561965");
  }
});
// Login Functionality
Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

}

Router.route('/api/twiml/sms', {where: 'server'})
  .post(function(req, res) {
    Meteor.call("sendsms", "Thanks for texting", req.From);
  });

Meteor.methods({
  sendsms: function(body, number) {
    client.sendSms({
        body: body,
        to: number,
        from: "+16787854359"
    }, function(err, message) {
        if (err) {
            console.log(err.message);
        }
        process.stdout.write(message.sid);
    });
  }
})
