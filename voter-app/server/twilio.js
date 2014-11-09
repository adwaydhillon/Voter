var accountSid = 'AC05a65b25f93c0661020d39873a925618';
var authToken = "7f9b1c480cb2e82a540eec3ccea2a502";
var client = Twilio(accountSid, authToken);
Meteor.methods({
    sendSMS: function(body, number) {
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
});
