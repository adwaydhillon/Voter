/**
 * Collections
 */
Events = new Mongo.Collection("events");
Items = new Mongo.Collection("items");
PhoneNumbers = new Mongo.Collection("phone_numbers");

Meteor.methods({
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