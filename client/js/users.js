Template.register.events({
  'submit form': function(event){
    event.preventDefault();

    //trims whitespace
    var trimInput = function(text){
      return text.replace(/^\s*|\s*$/g, "");
    }

    var firstName = event.target.firstName.value;
    var email = trimInput(event.target.registerEmail.value);
    var password = event.target.registerPassword.value;

    var options = {
        email: email,
        password: password,
        profile: {
            name: firstName,
            avatar: '/img/placeholder_avatar_300x300.png',
            bookmarks: [],
        },
    };

    Accounts.createUser(options, function(error){
      if(error){
        Session.set('errorMessage', error.message);
      }
      else{
        Session.set('errorMessage', null);
        Meteor.loginWithPassword(email, password);
      }
    });  
  }
});

Template.register.helpers({
  getErrors: function(){
    return Session.get('errorMessage');
  }
})

Template.login.events({
  'submit form': function(event){

    event.preventDefault();
    
    var email = event.target.loginEmail.value;
    var password = event.target.loginPassword.value;
    var errorMessage;

    Meteor.loginWithPassword(email, password, function(error)
      {
        if(error){
          console.log(error.message);
          errorMessage = error.message;
          Session.set('errorMessage', error.message);
        }
        else{
          console.log('logged in');
          Session.set('errorMessage', null);

          $('#loginModal').modal('toggle');
          $('.modal-backdrop').remove();
          
        }
      });
    console.log('login submit');
    return false;  
  },

});


Template.login.helpers({
  getErrors: function(){
    return Session.get('errorMessage');
  }
})

Template.nav.events({
  'click .logout': function(event){
    event.preventDefault();
    Meteor.logout();
    Router.go('/');
  }
});


