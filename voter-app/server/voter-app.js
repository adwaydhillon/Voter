/**
* Collections
*/
PhoneNumbers = new Mongo.Collection("phone_numbers");

Meteor.methods({
	add_event: function(event_name) {
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
			items_counter: 0,
			short_id: Math.random().toString(36).substring(11)
		});
		//   }
		// });
	},
	delete_event: function() {
		Events.delete(this._id);
	},
	add_item: function(event_id, item_name) {
		// Assume event is valid and item about to inserted is unique for the event.
		var result = Events.findOne( { _id: event_id });
		Events.update( { _id: event_id }, {$inc: {items_counter: 1}});
		result.items_counter = result.items_counter + 1;

		Items.insert({
			name: item_name,
			owner: Meteor.userId(),
			num: result.items_counter,
			votes: 0,
			event: event_id
		});
	},
	delete_item: function(item_id) {
		var item = Items.findOne(item_id);
		if (item.owner !== Meteor.userId()) {
			//Make sure only the owner can delete it
			throw new Meteor.Error("not-authorized");
		}
		Items.remove(item_id);
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
	},
	get_items: function(event_id) {
		return Items.find( { event: event_id } );
	},
	get_totals: function(event_id) {
		var sum_votes = 0;
		var summary = {};
		var items = {};
		Items.find( { event: event_id }, function(err, result) {
			result.forEach(function(element, index) {
				var num_votes = element.votes;
				sum_votes += num_votes;

				items[element.name] = num_votes;
			});
		});

		summary["item_totals"] = items;
		summary["total_votes"] = sum_votes;
		return summary;
	},
	addTask: function (text) {
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Tasks.insert({
			text: text,
			createdAt: new Date(),
			owner: Meteor.userId(),
			username: Meteor.user().username,
			private: true //Every task is private by default
		});
	},
	deleteTask: function (taskId) {
		var task = Tasks.findOne(taskId);
		if (task.owner !== Meteor.userId()) {
			//Make sure only the owner can delete it
			throw new Meteor.Error("not-authorized");
		}

		Tasks.remove(taskId);
	}
});

Meteor.publish("tasks", function () {
	return Tasks.find({
		$or: [
		{ private: {$ne: true} },
		{ owner: this.userId }
		]
	});
});
Meteor.publish("events", function() {
	return Events.find({ owner: this.userId });
});
Meteor.publish("items", function() {
	return Items.find({
		owner: this.userId
	});
});
