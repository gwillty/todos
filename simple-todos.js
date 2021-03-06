Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
	
	//this code runs on the client
	Template.body.helpers({
		tasks: function () {
			if (Session.get("hideCompleted")) {
				return Tasks.find({checked:{$ne: true}}, {sort:{createdAt: -1}});
			} else {
				return Tasks.find({},{sort: {createdAt: -1}});
			}
		
		},
		hideCompleted: function () {
				return Session.get("hideCompleted");
				
		},
		incompleteCount: function () {
			return Tasks.find({checked: {$ne: true}}).count();
			
		}
		
	});
	
	Template.body.events({
		"submit .new-task": function (event) { 
			//this function is called when the new task is submitted
			
			var text = event.target.text.value;
			
			Tasks.insert({
				text: text,
				createdAt: new Date(), //current time
				owner: Meteor.userId(),
				username: Meteor.user().username
			});
			
			//clear form
			event.target.text.value = "";
			//prevent default form submit;
			return false;
		},
		"change .hide-completed input" : function (event) {
				Session.set("hideCompleted", event.target.checked);
		}
		
	});
	
	Template.task.events({
		"click .toggle-checked": function () {
			//set the checked property opposite to its current value
		Tasks.update(this._id, {$set: {checked: ! this.checked }});	
		},
		"click .delete": function () {
			Tasks.remove(this._id);	
		}
		
		
	});
	
	Accounts.ui.config({
	passwordSignupFields: "USERNAME_ONLY"
	
	});
	
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

