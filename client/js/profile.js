
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

 	myProfile:function(id) {
    console.log(id);
    if (id == Meteor.userId()){
      return true;
    }
  }
})
  

  