/**
* Collections
*/
Votes = new Mongo.Collection("votes");

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
        Tasks.update(this._id, {$set: {checked: ! this.checked}});
    },
    "click .delete": function () {
        Tasks.remove(this._id);
    }
});

Template.twilio_test.events({
    "click button": function() {
        console.log("hey");
        Meteor.call("sendSMS", "Testing", "+16787561965");
    }
});
// Login Functionality
Accounts.ui.config({
    "ready": function() {
        var next = 1;
        $(".add-more").click(function(e){
            e.preventDefault();
            var addto = "#field" + next;
            addto.style.backgroundColor = "black";
            var addRemove = "#field" + (next);
            next = next + 1;
            var newIn = '<input autocomplete="off" class="input form-control" id="field' + next + '" name="field' + next + '" type="text">';
            newIn.style.backgroundColor = "black";
            var newInput = $(newIn);
            newInput.style.backgroundColor = "black";
            var removeBtn = '<button id="remove' + (next - 1) + '" class="btn btn-danger remove-me" >-</button></div><div id="field">';
            var removeButton = $(removeBtn);
            $(addto).after(newInput);
            $(addRemove).after(removeButton);
            $("#field" + next).attr('data-source',$(addto).attr('data-source'));
            $("#count").val(next);

            $('.remove-me').click(function(e){
                e.preventDefault();
                var fieldNum = this.id.charAt(this.id.length-1);
                var fieldID = "#field" + fieldNum;
                $(this).remove();
                $(fieldID).remove();
            });
        });
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