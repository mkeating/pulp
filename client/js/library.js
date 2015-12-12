
  Template.library.events({
    'submit .search': function(event){
      event.preventDefault();
      var searchTerms = event.target.searchTerms.value;
      if (searchTerms == ''){
        Session.set('searching', false);
        return false;
      }
      else{
        Session.set('searching', true);
        Session.set('searchTerms', searchTerms);
      }
      return false;
      
    },

  });

  Template.library.helpers({

    stories: function() {
      return Panels.find({origin: true}).fetch();
    }, 

    searching: function() {
      return Session.get('searching');
    },

    searchResults: function(){

      var searchTerms = Session.get('searchTerms');
      var results = [];

      //Apparently meteor cant do multiple cursors from the same collection? going single search term for now
     /* searchTerms.forEach(function(word){
          //console.log('search results: ' + Panels.find({origin: true, tags: word}).fetch());
          results.push(Panels.find({origin: true, tags: word}).fetch());
        });*/

      console.log(results);
      return Panels.find({origin: true, tags: searchTerms}).fetch();
    }
  })

  Template.libraryStory.helpers({

    textPreview: function(text) {
      return stripHTML(text);
    },

    getAuthor: function(id) {
      console.log(Meteor.users.findOne({_id: id}));
      return Meteor.users.findOne({_id: id});
    }

  })