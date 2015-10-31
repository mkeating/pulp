Panels = new Mongo.Collection("panels");

//////// URL ROUTING ////////////
Router.configure({
  layoutTemplate: 'ApplicationLayout',
});

Router.route('/',function(){
  this.render('main');
});

Router.route('/library', function(){
  this.render('library', {to: 'library'});

});  // TODO : for some reason the library links remain in workspace when you click a story url/
// UPDATE: I think its just rendring the template at the story url, not actually rerouting the browser. user Router.go()?

Router.route('/datatest/:_id', function(){
  

  this.render('datatest', {
    to: 'datatest',
    data: function(){
      return {panelID: this.params._id};
    }    
  });
    
});

Router.route('/story/:_id', function(){

  // I think I should set currentStoryID here, via params._id.parentStory. Also allows me to set Title

  console.log( Panels.find().fetch());
  var targetPanel = Panels.findOne({_id: this.params._id});

  this.render('story', {
    //to: 'story',
    data: function() {
      
      return {panelID: this.params._id};
    
    },
  });
});


StoryController = RouteController.extend({
  action: function () {
    //sets the current story id as a variable so it can be insterted with each new panel
    //TODO: looks like this is no longer happening
    this.state.set('currentStoryID', this.params._id);
    this.render();
  }
})

//////END URL ROUTING /////////////////

if (Meteor.isClient) {


/////ANGULAR STUFF (might remove) ////////////

  angular.module('pulp',['angular-meteor']);

  angular.module('pulp').controller('LibraryCtrl', ['$scope', '$meteor', function($scope, $meteor){

    //controls getting all origin panels for the purposes of browsing
    $scope.stories = $meteor.collection(function (){
      return Panels.find({origin: true});
    });

  }]);
//////END ANGULAR STUFF ///////////

  Template.main.events({
    'submit .new-story': function(event){
      event.preventDefault();

      console.log(event.target.text.value);
      var title = event.target.title.value;
      var text = event.target.text.value;

      var newStoryID = Panels.insert({
        title: title,
        text: text,
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
      //TODO: update is overwriting all but these new values?? lol
      /*Panels.update( 
          {_id: newStoryID},
          {parentStory: newStoryID}
      );*/

      console.log('new story submitted! ID: ' + newStoryID);
   
      event.target.text.value = '';

      //TODO: set currentStoryID on reroute; the Session variable is overwritten on reroute
      //Session.set('currentStoryID', newStoryID);
      Router.go('/story/' + newStoryID);
  }
});


//////////// PANEL STUFF //////////////

  Template.panel.events({
    'submit .new-panel': function(event){
      event.preventDefault();

      var text = event.target.text.value;
      var parentPanel = event.target.parent.value;

      var thisID = Panels.insert({
        text: text,
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

      Session.set('activePanel', thisID);


      console.log('the created panel, hopefully: ' + JSON.stringify(Panels.findOne({_id: thisID})));
      console.log('active panel after panel creation is: ' + Session.get('activePanel'));
      var addedPanel = UI.renderWithData(Template.panel, {id: thisID}, $('#workspace').get(0));

      //TODO: this doesnt seem to be working

      
   
      event.target.text.value = '';
  }

});

Template.panel.helpers({
      activePanel: function (id) {
        //console.log(Session.get('activePanel'));
        if(Session.get('activePanel') == id){
          return true;

        }else{
          return false;
        }
      },

      getPanel: function(id) {
        return Panels.findOne({_id: id});
      }
  });

///////// END PANEL STUFF ///////////////////

  
//////// STORY STUFF ///////////////////////

  Template.story.helpers({
      currentStoryID: function () {
        return Session.get('currentStoryID');
      },

      activePanel: function () {
        return Session.get('activePanel');
      },

      storyLine: function() {
        var panel = Panels.findOne({_id: this.panelID});
        console.log("storyline helper: " + JSON.stringify(panel));
        console.log("parent story:" + panel.parentStory);
        console.log("origin: " + panel.origin);
        var storyLine = [panel];
        if(panel.origin == false){
          var origin = false;
          var lastPanel;

          while(origin == false){
            lastPanel = Panels.findOne({_id: panel.parentPanel});
            storyLine.unshift(lastPanel);

            if (lastPanel.origin == true){
              origin = true;
            }

            panel = lastPanel;
          }
        }

        console.log("storyline is:" + JSON.stringify(storyLine));
        return storyLine;
      }
  });

  Template.story.rendered = function() {
    if (!this._rendered) {
      this._rendered = true;
      
      //Loads the origin panel of the story
      //NOTE: this is obsolete once the storyline builder works; commenting out as it creates a pointless empty panel on story load

      //var cursor = Panels.find({_id: Session.get('currentStoryID')}, {_id: 1}).fetch();
      //var addedPanel = UI.renderWithData(Template.panel, {id: Session.get('currentStoryID')}, $('#workspace').get(0)); //this works, but it doesnt work in the panel click event
    }
  }

 ////////// END STORY STUFF ///////////////// 

 Template.datatest.helpers({
  panels: function(){
    return Panels.find();
  },

  panelID: function(){
    console.log("panelID from datatest helper: "+this.panelID);
    return this.panelID;
  }

 });

  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

    //collection seed
    if(Panels.find().count() == 0){
      console.log("collection empty; seeding...");

      Panels.insert(
      {
        _id: "bespokeID1",
        title: "The Origin",
        text: "The story begins here",
        parentPanel: null,
        parentStory: null,
        children: ["bespokeID2"],
        createdAt: null,
        createdBy: "mike", 
        origin: true,
        terminal: false,
      });

      Panels.insert({
        _id: "bespokeID2",
        text: "The story continues",
        parentPanel: "bespokeID1",
        parentStory: "bespokeID1",
        children: ["bespokeID3"],
        createdAt: null,
        createdBy: "mike", 
        origin: false,
        terminal: false,
      });

      Panels.insert({
        _id: "bespokeID3",
        text: "and continues....",
        parentPanel: "bespokeID2",
        parentStory: "bespokeID1",
        children: ["bespokeID4"],
        createdAt: null,
        createdBy: "mike", 
        origin: false,
        terminal: false,
      });

      Panels.insert({
        _id: "bespokeID4",
        text: "....and goes on and on....",
        parentPanel: "bespokeID3",
        parentStory: "bespokeID1",
        children: [],
        createdAt: null,
        createdBy: "mike", 
        origin: false,
        terminal: false,
      });

    }

    /*return Meteor.methods({

      removeAllPanels: function() {

        return Panels.remove({});

      }

    });*/
  });

}






