/**
* Collections
*/
Tasks = new Mongo.Collection("tasks");

// This code only runs on the client
if (Meteor.isClient) {
 Template.body.helpers({
    tasks: function () {
      // Show newest tasks first
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  });

Template.body.events({
    "submit .new-task": function (event) {
      // This function is called when the new task form is submitted
      var text = event.target.text.value;

      Tasks.insert({
        text: text,
        createdAt: new Date() // current time
      });

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    }
  });



Template.task.events({
    "click .toggle-checked": function () {
        // Set the checked property to the opposite of its current value
        Tasks.update(this._id, {$set: {checked: ! this.checked}});
    },
    "click .delete": function () {
        Tasks.remove(this._id);
    }
});
}

// Login Functionality
Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});


Template.twil.events({
    "click #send": function() {
        console.log("Send Attempt");
        Meteor.call("sendSMS", "Testing", "+16787561965");
    },
    "click #rec": function() {
        console.log("Rec attempt")
        Meteor.call("recsms")
    }
});



/**
* Server methods that Client can call.
*/
Meteor.methods({
  recsms: function() {
    var twil_client = Twilio(accountSid, authToken);
    twil_client.listSms({
      from:'+14049407775'
    }, function (err, responseData) {
      responseData.smsMessages.forEach(function(message) {
        console.log('Message sent on: '+message.dateCreated.toLocaleDateString());
        console.log(message.body);
      });
    });
  }
});
