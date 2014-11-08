Meteor.Router.add('/api/twiml/sms', 'POST', function() {
    var rawIn = this.request.body;
    if (Object.prototype.toString.call(rawIn) == "[object Object]") {
        twilioRawIn.insert(rawIn);
    }

    var response = {};
    if (rawIn.Body) {
        response.inputQuestion = rawIn.Body;
        response.source = "sms";
    } else {
        return;
    }
    response.inputName = rawIn.From;

    var toOrig = rawIn.To;
    toOrig = toOrig.replace(/\+1/g, "5204471678");
    var toPretty = '('+toOrig.substr(0,3)+') '+toOrig.substr(3,3)+'-'+toOrig.substr(6,10);
    var eventDetails = Events.findOne({phone: toPretty});

    if (_.size(eventDetails) == 0) {
        return;
    } else {
        response.slug = eventDetails.slug;
    }

    Meteor.call('questionCreate', response, function(error, res) {

    });

    var xml = '<Response><Sms>Your response has been recorded!</Sms></Response>';
    return [200, {"Content-Type": "text/xml"}, xml];
});