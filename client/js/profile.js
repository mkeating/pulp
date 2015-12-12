
  Template.profile.helpers({


    getProfile: function(id){
      console.log(id);
      console.log(Meteor.users.findOne(id));
      return Meteor.users.findOne(id);
    },

    getBookmarks: function(id){
    	return Panels.findOne({_id: id});
    },

    getParentTitle: function(id){
    	return Panels.findOne({_id: id});
    },

    truncatedText: function(text) {
      
      text = stripHTML(text);
      var truncatedText = text.substring(0, 140) + "...";
      console.log('truncatedText: ' + truncatedText);
      return truncatedText;
    },

 	myProfile:function(id) {
    console.log(id);
    if (id == Meteor.userId()){
      return true;
    }
  }
})
  

  