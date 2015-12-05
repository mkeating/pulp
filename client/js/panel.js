
  Template.panel.events({
    'submit .new-panel-choice': function(event){
      console.log("event is: " + event.type);
      event.preventDefault();

      //console.log(event.type);

      var text = event.target.text.value;
      var parentPanel = event.target.parent.value;
      var choiceName = event.target.choiceName.value;

      if(text == ''){
        Session.set('storyError', "This can't be empty");
        if(choiceName == ''){
          Session.set('choiceError', "This can't be empty");
          console.log(Session.get('choiceError'));
        }
        return false;
      }

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

      //console.log('new panel setting active....');
      Session.set('activePanel', thisID);
      //console.log('panel create active panel: ' + Session.get('activePanel'));

      var addedPanel = UI.renderWithData(Template.panel, {id: thisID}, $('#workspace').get(0));
      //console.log('scrolling to active...');
      scrollToActive();

      event.target.text.value = '';
      return false;
  },

    'click .storyLink': function(event){

      console.log('storyLink clicked: ' + event);
      var addedPanel = UI.renderWithData(Template.panel, {id: event.target.id}, $('#workspace').get(0));
      Session.set('activePanel', event.target.id);
      scrollToActive();
    },

    'click span': function(event){


      if(event.target.classList.contains('locked') || event.target.classList.contains('storyLink')){

        /*var addedPanel = UI.renderWithData(Template.panel, {id: event.target.id}, $('#workspace').get(0));
        Session.set('activePanel', event.target.id);
        scrollToActive();

        /*console.log('clicked an closed word');
        $(event.currentTarget).removeClass('locked');
        var panelId = event.currentTarget.parentElement.parentElement.id;
        var newText = event.currentTarget.parentElement.innerHTML;
        //update collection
        Panels.update (
          panelId,  
          {$set: {text: newText}}
          );*/
      
       
      }else{

        console.log('clicked an open word');
        console.log(event.currentTarget.classList);

        //console.log('just clicked: ' + event.currentTarget);

        var placeholderID = Random.id();

        //console.log(placeholderID);

        Session.set('pendingImpressionWord', placeholderID);
        //console.log(Session.get('pendingImpressionWord'));

        $(event.currentTarget).addClass('locked');
        $(event.currentTarget).attr({'id': placeholderID, 'lockedBy': Meteor.userId()});

        $('.impression').show();
        $('.choiceNameInputBar').hide();
        $('.addChoiceButton').hide();
        var panelId = event.currentTarget.parentElement.parentElement.id;
        var newText = event.currentTarget.parentElement.innerHTML;
        //console.log(panelId);

        //update collection
        Panels.update (
          panelId,  
          {$set: {text: newText}}
          );        
        
      }
    },

    'submit .new-panel-impression': function(event){
      //console.log("event is: " + event.type);
      event.preventDefault();

      //console.log(event.type);

      var text = event.target.text.value;
      var parentPanel = event.target.parent.value;

      if(text == ''){
        Session.set('storyError', "This can't be empty");
        return false;
      }



      //TODO: add validation and feedback

      var thisID = Panels.insert({
        text: spanify(text),
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

      var pendingImpressionWord = Session.get('pendingImpressionWord');
      $('#' + pendingImpressionWord).attr({'id': thisID, 'class': 'storyLink'});
      $('#' + pendingImpressionWord).removeClass('locked lockedBy');

      //update collection
      var panelId = parentPanel;
      var newText = $('#' + panelId + ' .panelText').html();
        

      //update collection
      Panels.update (
          panelId,  
          {$set: {text: newText}}
      );   


      Session.set('activePanel', thisID);

      var addedPanel = UI.renderWithData(Template.panel, {id: thisID}, $('#workspace').get(0));
      scrollToActive();

      event.target.text.value = '';
      return false;
  },

    'click .bookmarkButton': function(event){
      //TODO: prevent redundancies, prevent multiclicks, success feedback
      
      var toBeBookmarked = event.target.parentElement.parentElement.id;

      if(Meteor.user().profile.bookmarks.indexOf(toBeBookmarked) == -1){
        //console.log ('we can add this shit');
        Meteor.users.update(Meteor.userId(), {$push: {'profile.bookmarks': toBeBookmarked}});

      }
      else {
       // console.log('this is already bookmarked');
        Meteor.users.update(Meteor.userId(), {$pull: {'profile.bookmarks': toBeBookmarked}});
      }

      console.log(Meteor.user().profile.bookmarks);

    }

});

Template.panel.helpers({
      activePanel: function (id) {
        if(Session.get('activePanel') == id){
          //console.log('found true');
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
        //console.log('getting avatar for: '+ id);
       // console.log(Meteor.users.findOne(id).profile.avatar);
        return avatar = Meteor.users.findOne(id);
      },

      getPlainText: function(text){
        return stripHTML(text);
      },

      isBookmarked: function(id){

        if(Meteor.user().profile.bookmarks.indexOf(id) == -1){
          return {glyphClass: 'glyphicon glyphicon-bookmark'};
          
        }else{
          return {glyphClass:'glyphicon glyphicon-ok'};
        }
        
      }

      
  });
