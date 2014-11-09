/**
* Setup
*/
Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({
    extended: false
}));

/**
* Routes
*/
Router.route('/api/test', {where: 'server'})
.post(function(req, res) {
    console.log(req.body);
});

Router.route('/api/twiml/sms', {where: 'server'})
.post(function(req, res) {
    this.render('twilio_test', {message_received: req.body.Body})
    Meteor.call("sendSMS", "Thanks for texting", req.body.From);
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
    Meteor.call("sendSMS", message, req.body.From);
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
