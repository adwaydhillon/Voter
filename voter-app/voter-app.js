Votes = new Mongo.Collection("tasks");
//twilio = Twilio("AC21f850538ec9bb250cd0de8b5c0badb3", "eaa95b3091b8866e36c1ec9aa82588e5");
var accountSid = 'AC05a65b25f93c0661020d39873a925618';
var authToken = "7f9b1c480cb2e82a540eec3ccea2a502";
//var twil_client = Twilio(accountSid, authToken);

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
  tasks: function () {
    if (Session.get("hideCompleted")) {
      // If hide completed is checked, filter tasks
      return Votes.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
    } else {
      // Otherwise, return all of the tasks
      return Votes.find({}, {sort: {createdAt: -1}});
    }
  },
  hideCompleted: function () {
    return Session.get("hideCompleted");
    },
  incompleteCount: function () {
  return Votes.find({checked: {$ne: true}}).count();
    }
});

  Template.body.events({
  "submit .new-task": function (event) {
    // This function is called when the new task form is submitted

    var text = event.target.text.value;

    Votes.insert({
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



Template.task.events({
  "click .toggle-checked": function () {
    // Set the checked property to the opposite of its current value
    Votes.update(this._id, {$set: {checked: ! this.checked}});
  },
  "click .delete": function () {
    Votes.remove(this._id);
  }
});

Template.twil.events({
  "click #send": function() {
    console.log("Send Attempt");
    //Meteor.call("sendsms");
},
    "click #rec": function() {
        console.log("Rec attempt")
        Meteor.call(receivesms)
    }
});
// Login Functionality
Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

}

Meteor.methods({
  sendsms: function() {
    var twil_client = Twilio(accountSid, authToken);
    twil_client.sendSms({
        body: "method sendsms",
        to: "+16787561965",
        from: "+16787854359"
    }, function(err, message) {
        if (err) {
            console.log(err.message);
        }
        process.stdout.write(message.sid);
    });
  }, receivesms: function() {
  	   var twil_client = Twilio(accountSid, authToken);
         twil_client.listSms({
    from:'+14049407775'
  }, function (err, responseData) {
    responseData.smsMessages.forEach(function(message) {
        console.log('Message sent on: '+message.dateCreated.toLocaleDateString());
        console.log(message.body);
    });
  });
  },
})
