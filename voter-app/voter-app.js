Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  // This code only runs on the client
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

Template.twilio_test.events({
  "click button": function() {
    //
    console.log("hey");
    Meteor.call("sendsms");
  }
});
}

Meteor.methods({
  sendsms: function() {
    var accountSid = 'AC05a65b25f93c0661020d39873a925618';
    var authToken = "7f9b1c480cb2e82a540eec3ccea2a502";
    var client = Twilio(accountSid, authToken);
    client.sendSms({
        body: "Adway is a chut",
        to: "+16787561965",
        from: "+16787854359"
    }, function(err, message) {
        if (err) {
            console.log(err.message);
        }
        process.stdout.write(message.sid);
    });
  }
})
