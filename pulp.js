Panels = new Mongo.Collection("panels");

//////// URL ROUTING ////////////
Router.route('/',{
  template: 'main',
});

Router.route('/library');  // TODO : for some reason the library links remain in workspace when you click a story url/
// UPDATE: I think its just rendring the template at the story url, not actually rerouting the browser

Router.route('/story/:_id', {
  template: 'story',
  data: function(){

    var currentStory = this.params._id;
    var panel = Panels.findOne({ _id: currentStory});
    //console.log('route panel: ' + JSON.stringify(panel));
    
    Session.set('currentStoryID', currentStory);
    Session.set('activePanel', currentStory);
    
    if(panel.origin == true){
      //console.log("origin is true");
      return Panels.findOne({ _id: currentStory });
    }else{
      //Here is where we'll crawl back along parents until an orgin: true
      //console.log("origin is false");
      var panels = [panel];
      var origin = false;
      var lastPanel;
      while (origin == false){
        lastPanel = Panels.findOne({_id: panel.parentPanel});
        if (lastPanel.origin = true){
          origin = true;
        }
        panels.unshift(lastPanel);
      }
      //console.log('all tha panels:' + JSON.stringify(panels));
      // this is working. TODO: populate a panel template for each in panels
      return panels;
    }
    
  }

});

StoryController = RouteController.extend({
  action: function () {
    //sets the current story id as a variable so it can be insterted with each new panel
    this.state.set('currentStoryID', this.params._id);
    this.render();
  }
})

//////END URL ROUTING /////////////////

if (Meteor.isClient) {

  angular.module('pulp',['angular-meteor']);

  /*angular.module('pulp').controller('PanelsCtrl', ['$scope', '$meteor', function($scope, $meteor){

    $scope.panels = $meteor.collection(Panels);

  }]);*/

  angular.module('pulp').controller('LibraryCtrl', ['$scope', '$meteor', function($scope, $meteor){

    //controls getting all origin panels for the purposes of browsing
    $scope.stories = $meteor.collection(function (){
      return Panels.find({origin: true});
    });

  }]);

  angular.module('pulp').controller('StoryCtrl', ['$scope', '$meteor', function($scope, $meteor, panels){

    //what is going on here; i forget why i made this
    // oh i think this is going to be the storyline creator; taking a story Id as a parameter and climbing back up the parents until origin = true
    /*$scope.story = $meteor.collection(function (){
      return Panels.find({origin: true});
    });*/
    return panels;

  }]);

  Template.main.events({
    'submit .new-story': function(event){
      event.preventDefault();
      var title = event.target.title.value;
      var text = event.target.text.value;

      Panels.insert({
        title: title,
        text: text,
        parentPanel: null,
        parentStory: Session.get('currentStoryID'),
        children: [],
        createdAt: new Date(),
        createdBy: Meteor.userId(),
        origin: true,
        terminal: false,
      });

      console.log('panel submitted');

      //TODO: redirect to story view after origin panel creation
   
      event.target.text.value = '';
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

      //update parent panel's children with this
      Panels.update( 
          {_id: parentPanel},
          {$push: {children: thisID}}
      );

      console.log("parent ID: " + parentPanel);
      //console.log("children: " + Panels.findOne({_id: parentPanel}).fetch());

      //add this panel to the view
      /*var data = {
          text: text,
          parentPanel: parentPanel,
          parentStory: Session.get('currentStoryID'),
          thisID: thisID
      };*/

      console.log('the created panel, hopefully: ' + JSON.stringify(Panels.findOne({_id: thisID})));

      console.log('thisID:' + thisID);

      //this is returning false, but works in the story rendered
      var addedPanel = UI.renderWithData(Template.panel, {id: thisID}, $('#workspace').get(0));
      //console.log(document.getElementById('workspace'));

      Session.set('activePanel', thisID);
      console.log('panel submitted');
   
      event.target.text.value = '';
  }

});

Template.panel.helpers({
      activePanel: function (id) {
        //console.log(Session.get('activePanel'));
        if(Session.get('activePanel') == id){
          console.log('amIActive is true');
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
        //console.log(Session.get('activePanel'));
        return Session.get('activePanel');
      },
  });

  Template.story.rendered = function() {
    if (!this._rendered) {
      this._rendered = true;
      console.log('template loaded');
      console.log('currentStoryID:' + Session.get('currentStoryID'));
      console.log('active panel: ' + Session.get('activePanel'));
      //Loads the origin panel of the story
      //console.log("session current ID: " + Session.get('currentStoryID'));
      var cursor = Panels.find({_id: Session.get('currentStoryID')}, {_id: 1}).fetch();
      //console.log("first panel data: " + JSON.stringify(cursor));
      var addedPanel = UI.renderWithData(Template.panel, {id: Session.get('currentStoryID')}, $('#workspace').get(0)); //this works, but it doesnt work in the panel click event
    }
  }

 ////////// END STORY STUFF ///////////////// 

  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  
  /*Panels.allow({
    update: function (userId, doc, fields, modifier) {
      return true;
    }
  });*/

  });

}






