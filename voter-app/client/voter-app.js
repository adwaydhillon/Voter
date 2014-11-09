// This code only runs on the client
Meteor.subscribe("tasks");

Template.body.helpers({
  tasks: function () {
    //if (Session.get("hideCompleted")) {
      return Tasks.find({}, {sort: {createdAt: -1}});
  }
});

Template.body.events({
  "submit .new-task": function (event) {
    // This function is called when the new task form is submitted
    var text = event.target.text.value;

    Meteor.call("addTask", text);

    // Clear form
    event.target.text.value = "";

    // Prevent default form submit
    return false;
  }
});

Template.task.events({
  "click .delete": function () {
    Meteor.call("deleteTask", this._id);
  }
});

Template.task.helpers({
  isOwner: function () {
    return this.owner === Meteor.userId();
  }
});

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});