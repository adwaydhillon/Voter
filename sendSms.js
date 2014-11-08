// Your accountSid and authToken from twilio.com/user/account
var accountSid = 'AC21f850538ec9bb250cd0de8b5c0badb3';
var authToken = "eaa95b3091b8866e36c1ec9aa82588e5";
var client = require('twilio')(accountSid, authToken);

client.messages.create({
    body: "Adway is a chut",
    to: "+14049407775",
    from: "+15204471690"
}, function(err, message) {
    if (err) {
        console.log(err.message);
    }
    process.stdout.write(message.sid);
});
