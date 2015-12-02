
  Template.profile.helpers({


    getProfile: function(id){
      console.log(id);
      console.log(Meteor.users.findOne(id));
      return Meteor.users.findOne(id);
    }
  })

  