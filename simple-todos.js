Tasks  = new Mongo.Collection("tasks"); //creates a new collection (table) in our database storing the tasks. 
if (Meteor.isClient) {
  Template.body.helpers({
    tasks: function () {
      if (Session.get("hideCompleted")){ //retieving the value of the session with this statement   
        return Tasks.find({checked: {$ne: true}}, {sort:{createdAt: -1}});
      } else {
    	return Tasks.find({}, {sort: {createdAt: -1}});
    }
    },
    hideCompleted: function(){
      return Session.get("hideCompleted");
    },
    incompleteCount: function() {
      return Tasks.find({checked: {$ne: true}}).count();
    }
  });
  // the above just finds all of our tasks, and then sorts them in createdAt order.
  // the below allows our input field to respond to a submit action. On submit, we insert text into Tasks. This adds fuctionality and interactivity to our page
  

  Template.body.events({
  	"submit .new-task": function(event) {
  		event.preventDefault();
  		var text = event.target.text.value;
  		Tasks.insert({
  			text: text,
  			createdAt: new Date()
  		});
  		event.target.text.value = ""; //clears the input field when we submit a new task
  	},
    "change .hide-completed input": function(event) {
      Session.set("hideCompleted", event.target.checked); //two arguments are in the session. First the name of the session, next the value of the session.
      //this is the data we're storing inside the session. 
    }
  });

  Template.task.events({
    "click .toggle-checked": function() {
      Tasks.update(this._id, {
        $set: {checked: ! this.checked}
      });
    },
    "click .delete": function(){
      Tasks.remove(this._id);
    }
  });

  Accounts.ui.config({
    passwordsSignupFields: "USERNAME_ONLY"
  });
}
