
  Template.main.events({
    'submit .new-story': function(event){
      event.preventDefault();

      var title = event.target.title.value;
      var text = event.target.text.value;
      var tags = event.target.tags.value.split(';');

      console.log(tags);

      var newStoryID = Panels.insert({
        title: title,
        text: spanify(text),
        tags: tags,
        parentPanel: null,
        parentStory: null,
        children: [],
        createdAt: new Date(),
        createdBy: Meteor.userId(),
        origin: true,
        terminal: false,
      }, function(){
          //TODO: error handling
      }
      );

      //update this new panel so it's its own parent story
      Panels.update( 
          {_id: newStoryID},
          {$set: {parentStory: newStoryID}}
      );

      Router.go('/story/' + newStoryID);
  }
});
