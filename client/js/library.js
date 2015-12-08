
  Template.library.events({
    'submit .search': function(event){
      


      var searchTerms = event.target.searchTerms.value;
      console.log(searchTerms);
      event.preventDefault();
    }

  });

  Template.library.helpers({

    stories: function() {
      return Panels.find({origin: true}).fetch();
    },  
  })

  Template.libraryStory.helpers({

    /*truncatedText: function(text) {
      
      //TODO: use regex to clear all tags
      var cleanTags = text.replace(/<span>/g, '');

      cleanTags = cleanTags.replace(/<\/span>/g, '');
      var truncatedText = cleanTags.substring(0, 500) + "...";
      return truncatedText;
    },*/

    textPreview: function(text) {
      return stripHTML(text);
    },

    getAuthor: function(id) {
      console.log(Meteor.users.findOne({_id: id}));
      return Meteor.users.findOne({_id: id});
    }

  })