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
// UPDATE: I think its just rendring the template at the story url, not actually rerouting the browser. use Router.go()?

Router.route('/story/:_id', function(){

  var targetPanel = Panels.findOne({_id: this.params._id});
  var parentStory = Panels.findOne({_id: targetPanel.parentStory});
  Session.set('activePanel', this.params._id);
  Session.set('currentStoryID', targetPanel.parentStory);
  Session.set('title', parentStory.title);

  this.render('story', {
    //to: 'story',
    data: function() {
      
      return {panelID: this.params._id};
    
    },
  });
});

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

  scrollToActive = function(){

    $('html, body').animate({
        scrollTop: $("#"+Session.get('activePanel')).offset().top
      }, 1000);
  }

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
          console.log("could not add panel to collection");
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

/////////////// LIBRARY STUFF ////////////

  Template.library.helpers({

    stories: function() {
      return Panels.find({origin: true}).fetch();
    }
  })




///////// END LIBRARY STUFF /////////////



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
          console.log("could not add panel to collection");
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
  },

    'click .storyLink': function(event){
    
      var addedPanel = UI.renderWithData(Template.panel, {id: event.target.id}, $('#workspace').get(0));
      Session.set('activePanel', event.target.id);
      scrollToActive();
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

      getChild: function(id){
        console.log('getChild called: ' + id);
        console.log(Panels.findOne({_id: id}));
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

      title: function () {
        return Session.get('title');
      },

      storyLine: function() {
        var panel = Panels.findOne({_id: this.panelID});
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
        return storyLine;
      }
  });

  Template.story.rendered = function() {
    if (!this._rendered) {

      this._rendered = true;

      scrollToActive();      
      }
  }

 ////////// END STORY STUFF ///////////////// 

////////// FORM STUFF ////////////
  
  Template.form.helpers({


    //these options turn on and off the 3 link modes
      dots: function() {
        console.log('dots called');
        return false;
      },

      choices: function() {
        console.log('choices called');
        return true;
      },

      words: function() {
        //this one might be a little harder to implement
        return true;
      }
  });
////////// END FORM STUFF /////////////////

  //// END IS CLIENT /////
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
        choiceName: null,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dictum, elit a tristique varius, elit mauris porttitor neque, id maximus sem elit vel sapien. Maecenas a metus molestie, luctus sem nec, venenatis mauris. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque vitae varius tellus. Vestibulum nibh nisl, molestie non gravida et, consectetur vitae mauris. Proin ac fringilla magna, eu placerat risus. Nullam mollis consequat malesuada. Integer ut laoreet dui. Curabitur in lacinia diam. Praesent velit neque, suscipit a tortor non, bibendum eleifend enim. Praesent vitae interdum arcu. Duis et dapibus eros, id dictum felis. Nunc ut mauris nec mi gravida maximus. Maecenas ut nunc vitae neque gravida gravida. Morbi quis erat elit. Ut rhoncus sed est imperdiet ullamcorper. Quisque a ultrices turpis. Suspendisse potenti. Sed sodales augue augue, vel imperdiet dui efficitur et. Morbi rhoncus volutpat ligula non pharetra. Suspendisse potenti. Cras tristique imperdiet est, eget fermentum nunc fermentum vitae. Nam eget justo dignissim, dignissim massa convallis, semper eros. Vestibulum auctor, augue ut sollicitudin mattis, augue magna lobortis libero, non cursus purus orci sed arcu. Morbi iaculis erat ante, sed fringilla lorem tempor ut. In nulla elit, euismod id leo in, aliquam imperdiet nulla.",
        parentPanel: null,
        parentStory: "bespokeID1",
        children: ["bespokeID2"],
        createdAt: null,
        createdBy: "mike", 
        origin: true,
        terminal: false,
      });

      Panels.insert({
        _id: "bespokeID2",
        choiceName: "Enter the cave",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dictum, elit a tristique varius, elit mauris porttitor neque, id maximus sem elit vel sapien. Maecenas a metus molestie, luctus sem nec, venenatis mauris. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque vitae varius tellus. Vestibulum nibh nisl, molestie non gravida et, consectetur vitae mauris. Proin ac fringilla magna, eu placerat risus. Nullam mollis consequat malesuada. Integer ut laoreet dui. Curabitur in lacinia diam. Praesent velit neque, suscipit a tortor non, bibendum eleifend enim. Praesent vitae interdum arcu. Duis et dapibus eros, id dictum felis. Nunc ut mauris nec mi gravida maximus. Maecenas ut nunc vitae neque gravida gravida. Morbi quis erat elit. Ut rhoncus sed est imperdiet ullamcorper. Quisque a ultrices turpis. Suspendisse potenti. Sed sodales augue augue, vel imperdiet dui efficitur et. Morbi rhoncus volutpat ligula non pharetra. Suspendisse potenti. Cras tristique imperdiet est, eget fermentum nunc fermentum vitae. Nam eget justo dignissim, dignissim massa convallis, semper eros. Vestibulum auctor, augue ut sollicitudin mattis, augue magna lobortis libero, non cursus purus orci sed arcu. Morbi iaculis erat ante, sed fringilla lorem tempor ut. In nulla elit, euismod id leo in, aliquam imperdiet nulla.",
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
        choiceName: "Examine the waterfall",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dictum, elit a tristique varius, elit mauris porttitor neque, id maximus sem elit vel sapien. Maecenas a metus molestie, luctus sem nec, venenatis mauris. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque vitae varius tellus. Vestibulum nibh nisl, molestie non gravida et, consectetur vitae mauris. Proin ac fringilla magna, eu placerat risus. Nullam mollis consequat malesuada. Integer ut laoreet dui. Curabitur in lacinia diam. Praesent velit neque, suscipit a tortor non, bibendum eleifend enim. Praesent vitae interdum arcu. Duis et dapibus eros, id dictum felis. Nunc ut mauris nec mi gravida maximus. Maecenas ut nunc vitae neque gravida gravida. Morbi quis erat elit. Ut rhoncus sed est imperdiet ullamcorper. Quisque a ultrices turpis. Suspendisse potenti. Sed sodales augue augue, vel imperdiet dui efficitur et. Morbi rhoncus volutpat ligula non pharetra. Suspendisse potenti. Cras tristique imperdiet est, eget fermentum nunc fermentum vitae. Nam eget justo dignissim, dignissim massa convallis, semper eros. Vestibulum auctor, augue ut sollicitudin mattis, augue magna lobortis libero, non cursus purus orci sed arcu. Morbi iaculis erat ante, sed fringilla lorem tempor ut. In nulla elit, euismod id leo in, aliquam imperdiet nulla.",
        parentPanel: "bespokeID2",
        parentStory: "bespokeID1",
        children: ["bespokeID4", "bespokeID5", "bespokeID6"],
        createdAt: null,
        createdBy: "mike", 
        origin: false,
        terminal: false,
      });

      Panels.insert({
        _id: "bespokeID4",
        choiceName: "Wake up the gnome",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dictum, elit a tristique varius, elit mauris porttitor neque, id maximus sem elit vel sapien. Maecenas a metus molestie, luctus sem nec, venenatis mauris. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque vitae varius tellus. Vestibulum nibh nisl, molestie non gravida et, consectetur vitae mauris. Proin ac fringilla magna, eu placerat risus. Nullam mollis consequat malesuada. Integer ut laoreet dui. Curabitur in lacinia diam. Praesent velit neque, suscipit a tortor non, bibendum eleifend enim. Praesent vitae interdum arcu. Duis et dapibus eros, id dictum felis. Nunc ut mauris nec mi gravida maximus. Maecenas ut nunc vitae neque gravida gravida. Morbi quis erat elit. Ut rhoncus sed est imperdiet ullamcorper. Quisque a ultrices turpis. Suspendisse potenti. Sed sodales augue augue, vel imperdiet dui efficitur et. Morbi rhoncus volutpat ligula non pharetra. Suspendisse potenti. Cras tristique imperdiet est, eget fermentum nunc fermentum vitae. Nam eget justo dignissim, dignissim massa convallis, semper eros. Vestibulum auctor, augue ut sollicitudin mattis, augue magna lobortis libero, non cursus purus orci sed arcu. Morbi iaculis erat ante, sed fringilla lorem tempor ut. In nulla elit, euismod id leo in, aliquam imperdiet nulla.",
        parentPanel: "bespokeID3",
        parentStory: "bespokeID1",
        children: [],
        createdAt: null,
        createdBy: "mike", 
        origin: false,
        terminal: false,
      });

      Panels.insert({
        _id: "bespokeID5",
        choiceName: "Examine the urn",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dictum, elit a tristique varius, elit mauris porttitor neque, id maximus sem elit vel sapien. Maecenas a metus molestie, luctus sem nec, venenatis mauris. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque vitae varius tellus. Vestibulum nibh nisl, molestie non gravida et, consectetur vitae mauris. Proin ac fringilla magna, eu placerat risus. Nullam mollis consequat malesuada. Integer ut laoreet dui. Curabitur in lacinia diam. Praesent velit neque, suscipit a tortor non, bibendum eleifend enim. Praesent vitae interdum arcu. Duis et dapibus eros, id dictum felis. Nunc ut mauris nec mi gravida maximus. Maecenas ut nunc vitae neque gravida gravida. Morbi quis erat elit. Ut rhoncus sed est imperdiet ullamcorper. Quisque a ultrices turpis. Suspendisse potenti. Sed sodales augue augue, vel imperdiet dui efficitur et. Morbi rhoncus volutpat ligula non pharetra. Suspendisse potenti. Cras tristique imperdiet est, eget fermentum nunc fermentum vitae. Nam eget justo dignissim, dignissim massa convallis, semper eros. Vestibulum auctor, augue ut sollicitudin mattis, augue magna lobortis libero, non cursus purus orci sed arcu. Morbi iaculis erat ante, sed fringilla lorem tempor ut. In nulla elit, euismod id leo in, aliquam imperdiet nulla.",
        parentPanel: "bespokeID3",
        parentStory: "bespokeID1",
        children: [],
        createdAt: null,
        createdBy: "mike", 
        origin: false,
        terminal: false,
      });

      Panels.insert({
        _id: "bespokeID6",
        choiceName: "Wait and see what the gnome does",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dictum, elit a tristique varius, elit mauris porttitor neque, id maximus sem elit vel sapien. Maecenas a metus molestie, luctus sem nec, venenatis mauris. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque vitae varius tellus. Vestibulum nibh nisl, molestie non gravida et, consectetur vitae mauris. Proin ac fringilla magna, eu placerat risus. Nullam mollis consequat malesuada. Integer ut laoreet dui. Curabitur in lacinia diam. Praesent velit neque, suscipit a tortor non, bibendum eleifend enim. Praesent vitae interdum arcu. Duis et dapibus eros, id dictum felis. Nunc ut mauris nec mi gravida maximus. Maecenas ut nunc vitae neque gravida gravida. Morbi quis erat elit. Ut rhoncus sed est imperdiet ullamcorper. Quisque a ultrices turpis. Suspendisse potenti. Sed sodales augue augue, vel imperdiet dui efficitur et. Morbi rhoncus volutpat ligula non pharetra. Suspendisse potenti. Cras tristique imperdiet est, eget fermentum nunc fermentum vitae. Nam eget justo dignissim, dignissim massa convallis, semper eros. Vestibulum auctor, augue ut sollicitudin mattis, augue magna lobortis libero, non cursus purus orci sed arcu. Morbi iaculis erat ante, sed fringilla lorem tempor ut. In nulla elit, euismod id leo in, aliquam imperdiet nulla.",
        parentPanel: "bespokeID3",
        parentStory: "bespokeID1",
        children: [],
        createdAt: null,
        createdBy: "mike", 
        origin: false,
        terminal: false,
      });

      ////// Second Story //////////
      Panels.insert(
      {
        _id: "bespokeID7",
        title: "The Second Story",
        choiceName: null,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dictum, elit a tristique varius, elit mauris porttitor neque, id maximus sem elit vel sapien. Maecenas a metus molestie, luctus sem nec, venenatis mauris. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque vitae varius tellus. Vestibulum nibh nisl, molestie non gravida et, consectetur vitae mauris. Proin ac fringilla magna, eu placerat risus. Nullam mollis consequat malesuada. Integer ut laoreet dui. Curabitur in lacinia diam. Praesent velit neque, suscipit a tortor non, bibendum eleifend enim. Praesent vitae interdum arcu. Duis et dapibus eros, id dictum felis. Nunc ut mauris nec mi gravida maximus. Maecenas ut nunc vitae neque gravida gravida. Morbi quis erat elit. Ut rhoncus sed est imperdiet ullamcorper. Quisque a ultrices turpis. Suspendisse potenti. Sed sodales augue augue, vel imperdiet dui efficitur et. Morbi rhoncus volutpat ligula non pharetra. Suspendisse potenti. Cras tristique imperdiet est, eget fermentum nunc fermentum vitae. Nam eget justo dignissim, dignissim massa convallis, semper eros. Vestibulum auctor, augue ut sollicitudin mattis, augue magna lobortis libero, non cursus purus orci sed arcu. Morbi iaculis erat ante, sed fringilla lorem tempor ut. In nulla elit, euismod id leo in, aliquam imperdiet nulla.",
        parentPanel: null,
        parentStory: "bespokeID7",
        children: [],
        createdAt: null,
        createdBy: "mike", 
        origin: true,
        terminal: false,
      });
    
      ////// Third Story //////////
      Panels.insert(
      {
        _id: "bespokeID8",
        title: "The Third Story",
        choiceName: null,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dictum, elit a tristique varius, elit mauris porttitor neque, id maximus sem elit vel sapien. Maecenas a metus molestie, luctus sem nec, venenatis mauris. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque vitae varius tellus. Vestibulum nibh nisl, molestie non gravida et, consectetur vitae mauris. Proin ac fringilla magna, eu placerat risus. Nullam mollis consequat malesuada. Integer ut laoreet dui. Curabitur in lacinia diam. Praesent velit neque, suscipit a tortor non, bibendum eleifend enim. Praesent vitae interdum arcu. Duis et dapibus eros, id dictum felis. Nunc ut mauris nec mi gravida maximus. Maecenas ut nunc vitae neque gravida gravida. Morbi quis erat elit. Ut rhoncus sed est imperdiet ullamcorper. Quisque a ultrices turpis. Suspendisse potenti. Sed sodales augue augue, vel imperdiet dui efficitur et. Morbi rhoncus volutpat ligula non pharetra. Suspendisse potenti. Cras tristique imperdiet est, eget fermentum nunc fermentum vitae. Nam eget justo dignissim, dignissim massa convallis, semper eros. Vestibulum auctor, augue ut sollicitudin mattis, augue magna lobortis libero, non cursus purus orci sed arcu. Morbi iaculis erat ante, sed fringilla lorem tempor ut. In nulla elit, euismod id leo in, aliquam imperdiet nulla.",
        parentPanel: null,
        parentStory: "bespokeID8",
        children: [],
        createdAt: null,
        createdBy: "mike", 
        origin: true,
        terminal: false,
      });

      ////// Fourth Story //////////
      Panels.insert(
      {
        _id: "bespokeID9",
        title: "The Fourth Story",
        choiceName: null,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dictum, elit a tristique varius, elit mauris porttitor neque, id maximus sem elit vel sapien. Maecenas a metus molestie, luctus sem nec, venenatis mauris. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque vitae varius tellus. Vestibulum nibh nisl, molestie non gravida et, consectetur vitae mauris. Proin ac fringilla magna, eu placerat risus. Nullam mollis consequat malesuada. Integer ut laoreet dui. Curabitur in lacinia diam. Praesent velit neque, suscipit a tortor non, bibendum eleifend enim. Praesent vitae interdum arcu. Duis et dapibus eros, id dictum felis. Nunc ut mauris nec mi gravida maximus. Maecenas ut nunc vitae neque gravida gravida. Morbi quis erat elit. Ut rhoncus sed est imperdiet ullamcorper. Quisque a ultrices turpis. Suspendisse potenti. Sed sodales augue augue, vel imperdiet dui efficitur et. Morbi rhoncus volutpat ligula non pharetra. Suspendisse potenti. Cras tristique imperdiet est, eget fermentum nunc fermentum vitae. Nam eget justo dignissim, dignissim massa convallis, semper eros. Vestibulum auctor, augue ut sollicitudin mattis, augue magna lobortis libero, non cursus purus orci sed arcu. Morbi iaculis erat ante, sed fringilla lorem tempor ut. In nulla elit, euismod id leo in, aliquam imperdiet nulla.",
        parentPanel: null,
        parentStory: "bespokeID9",
        children: [],
        createdAt: null,
        createdBy: "mike", 
        origin: true,
        terminal: false,
      });

      ////// Fifth Story //////////
      Panels.insert(
      {
        _id: "bespokeID10",
        title: "The Fifth Story",
        choiceName: null,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dictum, elit a tristique varius, elit mauris porttitor neque, id maximus sem elit vel sapien. Maecenas a metus molestie, luctus sem nec, venenatis mauris. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque vitae varius tellus. Vestibulum nibh nisl, molestie non gravida et, consectetur vitae mauris. Proin ac fringilla magna, eu placerat risus. Nullam mollis consequat malesuada. Integer ut laoreet dui. Curabitur in lacinia diam. Praesent velit neque, suscipit a tortor non, bibendum eleifend enim. Praesent vitae interdum arcu. Duis et dapibus eros, id dictum felis. Nunc ut mauris nec mi gravida maximus. Maecenas ut nunc vitae neque gravida gravida. Morbi quis erat elit. Ut rhoncus sed est imperdiet ullamcorper. Quisque a ultrices turpis. Suspendisse potenti. Sed sodales augue augue, vel imperdiet dui efficitur et. Morbi rhoncus volutpat ligula non pharetra. Suspendisse potenti. Cras tristique imperdiet est, eget fermentum nunc fermentum vitae. Nam eget justo dignissim, dignissim massa convallis, semper eros. Vestibulum auctor, augue ut sollicitudin mattis, augue magna lobortis libero, non cursus purus orci sed arcu. Morbi iaculis erat ante, sed fringilla lorem tempor ut. In nulla elit, euismod id leo in, aliquam imperdiet nulla.",
        parentPanel: null,
        parentStory: "bespokeID10",
        children: [],
        createdAt: null,
        createdBy: "mike", 
        origin: true,
        terminal: false,
      });

      ////// Sixth Story //////////
      Panels.insert(
      {
        _id: "bespokeID11",
        title: "The Sixth Story",
        choiceName: null,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dictum, elit a tristique varius, elit mauris porttitor neque, id maximus sem elit vel sapien. Maecenas a metus molestie, luctus sem nec, venenatis mauris. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque vitae varius tellus. Vestibulum nibh nisl, molestie non gravida et, consectetur vitae mauris. Proin ac fringilla magna, eu placerat risus. Nullam mollis consequat malesuada. Integer ut laoreet dui. Curabitur in lacinia diam. Praesent velit neque, suscipit a tortor non, bibendum eleifend enim. Praesent vitae interdum arcu. Duis et dapibus eros, id dictum felis. Nunc ut mauris nec mi gravida maximus. Maecenas ut nunc vitae neque gravida gravida. Morbi quis erat elit. Ut rhoncus sed est imperdiet ullamcorper. Quisque a ultrices turpis. Suspendisse potenti. Sed sodales augue augue, vel imperdiet dui efficitur et. Morbi rhoncus volutpat ligula non pharetra. Suspendisse potenti. Cras tristique imperdiet est, eget fermentum nunc fermentum vitae. Nam eget justo dignissim, dignissim massa convallis, semper eros. Vestibulum auctor, augue ut sollicitudin mattis, augue magna lobortis libero, non cursus purus orci sed arcu. Morbi iaculis erat ante, sed fringilla lorem tempor ut. In nulla elit, euismod id leo in, aliquam imperdiet nulla.",
        parentPanel: null,
        parentStory: "bespokeID11",
        children: [],
        createdAt: null,
        createdBy: "mike", 
        origin: true,
        terminal: false,
      });
    }
    
  });

}






