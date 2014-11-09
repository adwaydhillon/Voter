// This code only runs on the client
Meteor.subscribe("tasks");
Meteor.subscribe("events");
Meteor.subscribe("items");

/**
 * Body helpers and events
 */
Template.body.helpers({
  tasks: function () {
    var current_event = Session.get("current_event");
    if (current_event) {
      return Items.find({ event: current_event }, {sort: {createdAt: -1}});
    }
    else {
      return [];
    }
  },
  creating_event: function() {
    return Session.get("creating_event");
  }
});
Template.body.events({
  "submit .new-task": function (event) {
    // This function is called when the new task form is submitted
    var text = event.target.text.value;
    var current_event = Session.get("current_event");
    if (current_event) {
      Meteor.call("add_item", current_event, text);
      // Clear form
      event.target.text.value = "";
    }
    else {
      alert("Please select an existing event or create a new event first.");
    }

    // Prevent default form submit
    return false;
  },
  "submit #creating-event": function(event) {
    var event_name = event.target.event_name.value;

    Meteor.call("add_event", event_name, function(err, data) {
      Session.set("current_event", data);
    });

    Session.set("creating_event", false);

    return false;
  }
});

/**
 * eventButtons helpers and events
 */
Template.eventButtons.helpers({
  events: function() {
    return Events.find({ owner: Meteor.userId() }, {sort: {createdAt: -1}});
  },
  active_button_text: function() {
    var current_event = Session.get("current_event");
    if (current_event) {
      var event = Events.findOne({ _id: current_event });
      return event.name;
    }
    else {
      return "Choose an Event";
    }
  }
});
Template.eventButtons.events({
  "click #new_event": function(event) {
    event.preventDefault();
    Session.set('creating_event', true);
  }
});

/**
 * event_item helpers and events
 */
Template.event_item.helpers({
  event_name: function() {
    return this.name;
  }
});
Template.event_item.events({
  "click": function() {
    Session.set("current_event", this._id);
  }
});

Template.task.events({
  "click .delete": function () {
    Meteor.call("delete_item", this._id);
  }
});

Template.task.helpers({
  isOwner: function () {
    return this.owner === Meteor.userId();
  },
  item_name: function() {
    return this.name;
  }
});

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});