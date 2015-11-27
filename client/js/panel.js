
  Template.panel.events({
    'submit .new-panel': function(event){
      console.log("event is: " + event.type);
      event.preventDefault();

      console.log(event.type);

      var text = event.target.text.value;
      var parentPanel = event.target.parent.value;
      var choiceName = event.target.choiceName.value;

      //TODO: add validation and feedback

      var thisID = Panels.insert({
        text: spanify(text),
        choiceName: choiceName,
        createdAt: new Date(),
        createdBy: Meteor.userId(),
        origin: false,
        terminal: false,
        parentStory: Session.get('currentStoryID'),
        children: [],
        parentPanel: parentPanel,
      }, function(){
          //TODO error handling
        }
      );

      //update parent panel's children with this new panel
      Panels.update( 
          {_id: parentPanel},
          {$push: {children: thisID}}
      );

      console.log('new panel setting active....');
      Session.set('activePanel', thisID);
      console.log('panel create active panel: ' + Session.get('activePanel'));

      var addedPanel = UI.renderWithData(Template.panel, {id: thisID}, $('#workspace').get(0));
      console.log('scrolling to active...');
      scrollToActive();

      event.target.text.value = '';
      return false;
  },

    'click .storyLink': function(event){
    
      var addedPanel = UI.renderWithData(Template.panel, {id: event.target.id}, $('#workspace').get(0));
      Session.set('activePanel', event.target.id);
      scrollToActive();
    },

    'click span': function(event){
      $(event.currentTarget).addClass('red');
    },

    'click .bookmarkButton': function(event){
      //TODO: prevent redundancies
      
      var toBeBookmarked = event.target.parentElement.id;


      /*
        get all bookmarks
        if(!all.includes(toBeBookmarked)){
          update
        }else{
          do nothing, or provide feedback
          another idea is make the button not clickable with visual feedback if already in bookmarks
        }

      */
      Meteor.users.update(Meteor.userId(), {$push: {'profile.bookmarks': event.target.parentElement.id}});
      console.log('bookmarks updated:' + event.target.parentElement.id);

    }

});

Template.panel.helpers({
      activePanel: function (id) {
        console.log('panel helper input: ' + id);
        console.log('panel helper active:' + Session.get('activePanel'));
        if(Session.get('activePanel') == id){
          console.log('found true');
          return true;
        }else{
          return false;
        }
      },

      getPanel: function(id) {
        return Panels.findOne({_id: id});
      },

      //is this superfluous? can i just call getPanel?
      getChild: function(id){
        return Panels.findOne({_id: id});
      },

      getAvatar: function(id){
        console.log('getting avatar for: '+ id);
        console.log(Meteor.users.findOne(id).profile.avatar);
        return avatar = Meteor.users.findOne(id);
        //return avatar = Meteor.users.findOne(id, {fields: {'profile.avatar': 1}});
      }
  });
