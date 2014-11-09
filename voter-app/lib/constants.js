/**
* Constants
*/
user_messages = {
    ALREADY_VOTED: "You have already voted for this event.",
    VOTE_SUCCESSFUL: "Thank you for voting. Your vote has successfully been recorded.",
    VOTE_WRONG_FORM: "Your message was in the incorrect form. Please enter it in the proper form: 'eventID itemID'"
};

Tasks = new Mongo.Collection("tasks");
Events = new Mongo.Collection("events");
Items = new Mongo.Collection("items");
