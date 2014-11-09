/**
* Collections
*/
Votes = new Mongo.Collection("votes");
Events = new Mongo.Collection("events");
Items = new Mongo.Collection("items");
PhoneNumbers = new Mongo.Collection("phone_numbers");

/**
* Setup
*/
var accountSid = 'AC05a65b25f93c0661020d39873a925618';
var authToken = "7f9b1c480cb2e82a540eec3ccea2a502";
var client = Twilio(accountSid, authToken);
Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({
    extended: false
}));

/**
* Constants
*/
var user_messages = {
  ALREADY_VOTED: "You have already voted for this event.",
  VOTE_SUCCESSFUL: "Thank you for voting. Your vote has successfully been recorded.",
  VOTE_WRONG_FORM: "Your message was in the incorrect form. Please enter it in the proper form: 'eventID itemID'"
};

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
            Tasks.update(this._id, {$set: {checked: ! this.checked}});
        },
        "click .delete": function () {
            Tasks.remove(this._id);
        }
    });

<<<<<<< HEAD
  Template.twilio_test.events({
    "click button": function() {
      console.log("hey");
      Meteor.call("sendsms", "Testing", "+16787561965");
    }
  });
  // Login Functionality
  Accounts.ui.config({
    "ready": function() {
    var next = 1;
    $(".add-more").click(function(e){
        e.preventDefault();
        var addto = "#field" + next;
        var addRemove = "#field" + (next);
        next = next + 1;
        var newIn = '<input autocomplete="off" class="input form-control" id="field' + next + '" name="field' + next + '" type="text">';
        var newInput = $(newIn);
        var removeBtn = '<button id="remove' + (next - 1) + '" class="btn btn-danger remove-me" >-</button></div><div id="field">';
        var removeButton = $(removeBtn);
        $(addto).after(newInput);
        $(addRemove).after(removeButton);
        $("#field" + next).attr('data-source',$(addto).attr('data-source'));
        $("#count").val(next);  
        
            $('.remove-me').click(function(e){
=======
    Template.twilio_test.events({
        "click button": function() {
            console.log("hey");
            Meteor.call("sendsms", "Testing", "+16787561965");
        }
    });
    // Login Functionality
    Accounts.ui.config({
        "ready": function() {
            var next = 1;
            $(".add-more").click(function(e){
>>>>>>> a86b0095abb259dcc9d9f8997248faf8f85361bb
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
            Meteor.call("sendsms", "Testing", "+16787561965");
        },
        "click #rec": function() {
            console.log("Rec attempt")
            Meteor.call("recsms")
        }
    });

}

/**
* Routes
*/
Router.route('/api/test', {where: 'server'})
.post(function(req, res) {
    console.log(req.body);
});

Router.route('/api/twiml/sms', {where: 'server'})
  .post(function(req, res) {
<<<<<<< HEAD
    this.render('twilio_test', {message_received: req.body.Message})
    Meteor.call("sendsms", "Thanks for texting, your response has been recorded", req.body.From);
=======
    this.render('twilio_test', {message_received: req.body.Body})
    Meteor.call("sendsms", "Thanks for texting", req.body.From);
>>>>>>> a86b0095abb259dcc9d9f8997248faf8f85361bb
  });
Router.route('/vote', {where: 'server'})
  .post(function(req, res) {
    var content = req.body.Body;
    // Parse the content to be an event id and a thing to vote for.
    var parsed = Meteor.call("verify_vote", content);

    if (parsed) {
      message = Meteor.call("add_vote", req.body.From, parsed.event_id, parsed.item);
    }
    else {
      message = user_messages.VOTE_WRONG_FORM;
    }
    Meteor.call("sendsms", message, req.body.From);
  });

/**
* Test Routes
*/
Router.route('/api/generate/event', {where: 'server'})
.post(function(req, res) {
    Meteor.call("add_event", "hack nash", 0);
});
Router.route('/api/generate/item', {where: 'server'})
.post(function(req, res) {
    Meteor.call("add_item", "oMpgdRC2yM7JByFzX", "Voter", "best voting app", "gt");
});
Router.route('/api/generate/vote', {where: 'server'})
.post(function(req, res) {
    Meteor.call("add_vote", "+16787561965", "oMpgdRC2yM7JByFzX", 1)
});

/**
* Server methods that Client can call.
*/
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
  },
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
  },
  add_event: function(event_name, num_items) {
      // var shorter_id = Math.random().toString(36).substring(11);
      // var num_collisions = Events.find({ short_id: shorter_id }).count(function(err, count) {
      //   if (count > 1) {
      //     shorter_id = Math.random().toString(36).substring(11);
      //     num_collisions();
      //   }
      //   else {
      return Events.insert({
          name: event_name,
          createdAt: new Date(),
          owner: Meteor.userId(),
          items_counter: num_items,
          short_id: Math.random().toString(36).substring(11)
      });
      //   }
      // });
  },
  delete_event: function() {
      Events.delete(this._id);
  },
  add_item: function(event_id, item_name, item_description, item_team) {
      // Assume event is valid.
      var result = Events.findOne( { _id: event_id });
      Events.update( { _id: event_id }, {$inc: {items_counter: 1}});
      result.items_counter = result.items_counter + 1;

      Items.insert({
          name: item_name,
          description: item_description,
          team: item_team,
          num: result.items_counter,
          votes: 0,
          event: event_id
      });
  },
  add_vote: function(number, event_id, item_num) {
    // Check if number has ever voted.
    var result = PhoneNumbers.findOne({ _id: number });
    if (result) {
      // Check if voted.
      if (result.voted_events.indexOf(event_id) != -1) {
          return user_messages.ALREADY_VOTED;
      }
      else {
          result.voted_events.push(event_id);
          console.log(item_num);
          Items.update({ event: event_id, num: item_num }, {$inc: {votes: 1}});
          return user_messages.VOTE_SUCCESSFUL;
      }
    }

    // If never encountered number, insert it.
    PhoneNumbers.insert({
      _id: number,
      voted_events: [ event_id ]
    });
    Items.update({ event: event_id, num: item_num }, {$inc: {votes: 1}});
    return user_messages.VOTE_SUCCESSFUL;
  },
  verify_vote: function(body) {
    // Parse body to be event_id and the table number
    var result = null;
    var parts = body.split(' ');
    if (parts.length != 2) return result;

    var item_num = parseInt(parts[1], 10);
    if (isNaN(item_num)) return result;

    return {
      event_id: parts[0],
      item: item_num
    };
  }
});
