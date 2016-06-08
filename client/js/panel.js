
  Template.panel.events({

    'submit .new-panel-choice': function(event){
      console.log("event is: " + event.type);
      event.preventDefault();

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
      }, function(error){
          console.log(error);
        }
      );

      //update parent panel's children with this new panel
      Panels.update( 
          {_id: parentPanel},
          {$push: {children: thisID}}
      );

      
      Session.set('activePanel', thisID);

      var addedPanel = UI.renderWithData(Template.panel, {id: thisID}, $('#workspace').get(0));
    
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

      //TODO: adding a panel has been moved, this can be reformatted as a if(!) statement

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

        var placeholderID = Random.id();

        Session.set('pendingImpressionWord', placeholderID);

        $(event.currentTarget).addClass('locked');
        $(event.currentTarget).attr({'id': placeholderID, 'lockedBy': Meteor.userId()});

        $('.impression').show();
        $('html, body').animate({
          scrollTop: $('.impression').offset().top
        }, 2000);
        
        $('.new-panel-choice').hide();
        var panelId = event.currentTarget.parentElement.parentElement.id;
        var newText = event.currentTarget.parentElement.innerHTML;

        //update collection
        Panels.update (
          panelId,  
          {$set: {text: newText}}
          );        
        
      }
    },

    'submit .new-panel-impression': function(event){
      
      event.preventDefault();

      var text = event.target.text.value;
      var parentPanel = event.target.parent.value;

      if(text == ''){
        Session.set('storyError', "This can't be empty");
        return false;
      }

      var thisID = Panels.insert({
        text: spanify(text),
        createdAt: new Date(),
        createdBy: Meteor.userId(),
        origin: false,
        terminal: false,
        parentStory: Session.get('currentStoryID'),
        children: [],
        parentPanel: parentPanel,
      }, function(error){
          console.log(error);
        }
      );

      //frees the word from the lock
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
      Session.set('pendingImpressionWord', null);

      var addedPanel = UI.renderWithData(Template.panel, {id: thisID}, $('#workspace').get(0));
      scrollToActive();

      event.target.text.value = '';
      return false;
  },

  'click #cancelBtn': function(event){

    //resets the pending word and frees it up
    console.log(Session.get('pendingImpressionWord'));

    $('#' + Session.get('pendingImpressionWord')).removeAttr('id').removeAttr('class').removeAttr('lockedBy');
    $('.new-panel-impression').hide();
    $('.new-panel-choice').show();
    scrollToActive();
    

  },

    'click .bookmarkButton': function(event){
      
      var toBeBookmarked = event.target.parentElement.parentElement.id;

      //if this is not already bookmarked
      if(Meteor.user().profile.bookmarks.indexOf(toBeBookmarked) == -1){        
        Meteor.users.update(Meteor.userId(), {$push: {'profile.bookmarks': toBeBookmarked}});
      }
      else {
        Meteor.users.update(Meteor.userId(), {$pull: {'profile.bookmarks': toBeBookmarked}});
      }

    },

    'click .linkButton': function(event){

      var toLink = event.target.parentElement.parentElement.id;
      $('.linkArea').text('pulp.mkeat.net/story/' + toLink);
      console.log($('.linkArea').html());

    }

});

Template.panel.helpers({
      activePanel: function (id) {
        if(Session.get('activePanel') == id){
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



