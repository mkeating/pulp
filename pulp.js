/*
  Pulp: a real-time collaborative storytelling platform



  Global TODO:

    validate all inputs - user and story
    implement tags
    implement user bookmarks and avatars

    by-word branches
        DONE: allow html in meteor output (currently prints out tags as text)

    first sign in demo/tutorial? 

    library search/filter
    library wider container than workspace?
    DONE: library card: truncated text of first panel, other options (created by, scoring, etc)

    big collection seed

*/

Panels = new Mongo.Collection("panels");

//////// URL ROUTING ////////////
Router.configure({
  layoutTemplate: 'ApplicationLayout',
});

Router.route('/',function(){
  this.render('main');
});

Router.route('/library', function(){
  this.render('library');

});  // TODO : for some reason the library links remain in workspace when you click a story url/
// UPDATE: I think its just rendring the template at the story url, not actually rerouting the browser. use Router.go()?

Router.route('/story/:_id', function(){

  var targetPanel = Panels.findOne({_id: this.params._id});
  var parentStory = Panels.findOne({_id: targetPanel.parentStory});
  Session.set('activePanel', this.params._id);
  Session.set('currentStoryID', targetPanel.parentStory);
  Session.set('title', parentStory.title);

  this.render('story', {
    data: function() {
      return {panelID: this.params._id};
    },
  });
});

//////END URL ROUTING /////////////////

if (Meteor.isClient) {

  scrollToActive = function(){

    $('html, body').animate({
        scrollTop: $("#"+Session.get('activePanel')).offset().top
      }, 1000);
  }

  spanify = function(text){
    var words = text.split(' ');
    console.log(words);
    var spanifiedText = '';

    words.forEach(function(word){
      console.log(word);
      word = '<span>' + word + '</span>';
      spanifiedText += word + ' ';
      console.log(spanifiedText);
    })


    return spanifiedText;
  }

  Template.main.events({
    'submit .new-story': function(event){
      event.preventDefault();

      console.log(event.target.text.value);
      var title = event.target.title.value;
      var text = event.target.text.value;

      //TODO: add spanify 

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
    },  
  })

  Template.libraryStory.helpers({

    truncatedText: function(text) {
      
      //TODO: use regex to clear all tags
      var cleanTags = text.replace(/<span>/g, '');
      console.log('cleanTags: ' + cleanTags);

      cleanTags = cleanTags.replace(/<\/span>/g, '');
      var truncatedText = cleanTags.substring(0, 500) + "...";
      return truncatedText;
    }
  })
///////// END LIBRARY STUFF /////////////


////////// USER STUFF /////////////

Template.register.events({
  'submit form': function(event){
    

    //trims whitespace
    var trimInput = function(text){
      return text.replace(/^\s*|\s*$/g, "");
    }

    //TODO: validate and feedback
    var email = trimInput(event.target.registerEmail.value);
    var password = event.target.registerPassword.value;

    event.preventDefault();

    Accounts.createUser({
      email: email,
      password: password,
    });
    Meteor.loginWithPassword(email, password);
  }
});

Template.login.events({
  'submit form': function(event){
    
    var email = event.target.loginEmail.value;
    var password = event.target.loginPassword.value;
    var errorMessage;
    event.preventDefault();

    //TODO: is this sending email and password to the url???

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
  }
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
  }
});

///////// END USER STUFF ///////////////


//////////// PANEL STUFF //////////////

  Template.panel.events({
    'submit .new-panel': function(event){
      event.preventDefault();

      var text = event.target.text.value;
      var parentPanel = event.target.parent.value;

      //TODO: add spanify, validate and feedback

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

      //is this superfluous? can i just call getPanel?
      getChild: function(id){
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

  Template.form.events({

    'click .addChoiceButton': function(event){
      $('.hiddenInputs').show();
      $('html, body').animate({
        scrollTop: $(".hiddenInputs").offset().top
      }, 1000);
    }
  })
  
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
        text: "<span>Lorem</span> <span>ipsum</span> <span>dolor</span> <span>sit</span> <span>amet,</span> <span>consectetur</span> <span>adipiscing</span> <span>elit.</span> <span>Fusce</span> <span>dictum,</span> <span>elit</span> <span>a</span> <span>tristique</span> <span>varius,</span> <span>elit</span> <span>mauris</span> <span>porttitor</span> <span>neque,</span> <span>id</span> <span>maximus</span> <span>sem</span> <span>elit</span> <span>vel</span> <span>sapien.</span> <span>Maecenas</span> <span>a</span> <span>metus</span> <span>molestie,</span> <span>luctus</span> <span>sem</span> <span>nec,</span> <span>venenatis</span> <span>mauris.</span> <span>Pellentesque</span> <span>habitant</span> <span>morbi</span> <span>tristique</span> <span>senectus</span> <span>et</span> <span>netus</span> <span>et</span> <span>malesuada</span> <span>fames</span> <span>ac</span> <span>turpis</span> <span>egestas.</span> <span>Pellentesque</span> <span>vitae</span> <span>varius</span> <span>tellus.</span> <span>Vestibulum</span> <span>nibh</span> <span>nisl,</span> <span>molestie</span> <span>non</span> <span>gravida</span> <span>et,</span> <span>consectetur</span> <span>vitae</span> <span>mauris.</span> <span>Proin</span> <span>ac</span> <span>fringilla</span> <span>magna,</span> <span>eu</span> <span>placerat</span> <span>risus.</span> <span>Nullam</span> <span>mollis</span> <span>consequat</span> <span>malesuada.</span> <span>Integer</span> <span>ut</span> <span>laoreet</span> <span>dui.</span> <span>Curabitur</span> <span>in</span> <span>lacinia</span> <span>diam.</span> <span>Praesent</span> <span>velit</span> <span>neque,</span> <span>suscipit</span> <span>a</span> <span>tortor</span> <span>non,</span> <span>bibendum</span> <span>eleifend</span> <span>enim.</span> <span>Praesent</span> <span>vitae</span> <span>interdum</span> <span>arcu.</span> <span>Duis</span> <span>et</span> <span>dapibus</span> <span>eros,</span> <span>id</span> <span>dictum</span> <span>felis.</span> <span>Nunc</span> <span>ut</span> <span>mauris</span> <span>nec</span> <span>mi</span> <span>gravida</span> <span>maximus.</span> <span>Maecenas</span> <span>ut</span> <span>nunc</span> <span>vitae</span> <span>neque</span> <span>gravida</span> <span>gravida.</span> <span>Morbi</span> <span>quis</span> <span>erat</span> <span>elit.</span> <span>Ut</span> <span>rhoncus</span> <span>sed</span> <span>est</span> <span>imperdiet</span> <span>ullamcorper.</span> <span>Quisque</span> <span>a</span> <span>ultrices</span> <span>turpis.</span> <span>Suspendisse</span> <span>potenti.</span> <span>Sed</span> <span>sodales</span> <span>augue</span> <span>augue,</span> <span>vel</span> <span>imperdiet</span> <span>dui</span> <span>efficitur</span> <span>et.</span> <span>Morbi</span> <span>rhoncus</span> <span>volutpat</span> <span>ligula</span> <span>non</span> <span>pharetra.</span> <span>Suspendisse</span> <span>potenti.</span> <span>Cras</span> <span>tristique</span> <span>imperdiet</span> <span>est,</span> <span>eget</span> <span>fermentum</span> <span>nunc</span> <span>fermentum</span> <span>vitae.</span> <span>Nam</span> <span>eget</span> <span>justo</span> <span>dignissim,</span> <span>dignissim</span> <span>massa</span> <span>convallis,</span> <span>semper</span> <span>eros.</span> <span>Vestibulum</span> <span>auctor,</span> <span>augue</span> <span>ut</span> <span>sollicitudin</span> <span>mattis,</span> <span>augue</span> <span>magna</span> <span>lobortis</span> <span>libero,</span> <span>non</span> <span>cursus</span> <span>purus</span> <span>orci</span> <span>sed</span> <span>arcu.</span> <span>Morbi</span> <span>iaculis</span> <span>erat</span> <span>ante,</span> <span>sed</span> <span>fringilla</span> <span>lorem</span> <span>tempor</span> <span>ut.</span> <span>In</span> <span>nulla</span> <span>elit,</span> <span>euismod</span> <span>id</span> <span>leo</span> <span>in,</span> <span>aliquam</span> <span>imperdiet</span> <span>nulla.</span> ",
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
        text: "<span>Lorem</span> <span>ipsum</span> <span>dolor</span> <span>sit</span> <span>amet,</span> <span>consectetur</span> <span>adipiscing</span> <span>elit.</span> <span>Fusce</span> <span>dictum,</span> <span>elit</span> <span>a</span> <span>tristique</span> <span>varius,</span> <span>elit</span> <span>mauris</span> <span>porttitor</span> <span>neque,</span> <span>id</span> <span>maximus</span> <span>sem</span> <span>elit</span> <span>vel</span> <span>sapien.</span> <span>Maecenas</span> <span>a</span> <span>metus</span> <span>molestie,</span> <span>luctus</span> <span>sem</span> <span>nec,</span> <span>venenatis</span> <span>mauris.</span> <span>Pellentesque</span> <span>habitant</span> <span>morbi</span> <span>tristique</span> <span>senectus</span> <span>et</span> <span>netus</span> <span>et</span> <span>malesuada</span> <span>fames</span> <span>ac</span> <span>turpis</span> <span>egestas.</span> <span>Pellentesque</span> <span>vitae</span> <span>varius</span> <span>tellus.</span> <span>Vestibulum</span> <span>nibh</span> <span>nisl,</span> <span>molestie</span> <span>non</span> <span>gravida</span> <span>et,</span> <span>consectetur</span> <span>vitae</span> <span>mauris.</span> <span>Proin</span> <span>ac</span> <span>fringilla</span> <span>magna,</span> <span>eu</span> <span>placerat</span> <span>risus.</span> <span>Nullam</span> <span>mollis</span> <span>consequat</span> <span>malesuada.</span> <span>Integer</span> <span>ut</span> <span>laoreet</span> <span>dui.</span> <span>Curabitur</span> <span>in</span> <span>lacinia</span> <span>diam.</span> <span>Praesent</span> <span>velit</span> <span>neque,</span> <span>suscipit</span> <span>a</span> <span>tortor</span> <span>non,</span> <span>bibendum</span> <span>eleifend</span> <span>enim.</span> <span>Praesent</span> <span>vitae</span> <span>interdum</span> <span>arcu.</span> <span>Duis</span> <span>et</span> <span>dapibus</span> <span>eros,</span> <span>id</span> <span>dictum</span> <span>felis.</span> <span>Nunc</span> <span>ut</span> <span>mauris</span> <span>nec</span> <span>mi</span> <span>gravida</span> <span>maximus.</span> <span>Maecenas</span> <span>ut</span> <span>nunc</span> <span>vitae</span> <span>neque</span> <span>gravida</span> <span>gravida.</span> <span>Morbi</span> <span>quis</span> <span>erat</span> <span>elit.</span> <span>Ut</span> <span>rhoncus</span> <span>sed</span> <span>est</span> <span>imperdiet</span> <span>ullamcorper.</span> <span>Quisque</span> <span>a</span> <span>ultrices</span> <span>turpis.</span> <span>Suspendisse</span> <span>potenti.</span> <span>Sed</span> <span>sodales</span> <span>augue</span> <span>augue,</span> <span>vel</span> <span>imperdiet</span> <span>dui</span> <span>efficitur</span> <span>et.</span> <span>Morbi</span> <span>rhoncus</span> <span>volutpat</span> <span>ligula</span> <span>non</span> <span>pharetra.</span> <span>Suspendisse</span> <span>potenti.</span> <span>Cras</span> <span>tristique</span> <span>imperdiet</span> <span>est,</span> <span>eget</span> <span>fermentum</span> <span>nunc</span> <span>fermentum</span> <span>vitae.</span> <span>Nam</span> <span>eget</span> <span>justo</span> <span>dignissim,</span> <span>dignissim</span> <span>massa</span> <span>convallis,</span> <span>semper</span> <span>eros.</span> <span>Vestibulum</span> <span>auctor,</span> <span>augue</span> <span>ut</span> <span>sollicitudin</span> <span>mattis,</span> <span>augue</span> <span>magna</span> <span>lobortis</span> <span>libero,</span> <span>non</span> <span>cursus</span> <span>purus</span> <span>orci</span> <span>sed</span> <span>arcu.</span> <span>Morbi</span> <span>iaculis</span> <span>erat</span> <span>ante,</span> <span>sed</span> <span>fringilla</span> <span>lorem</span> <span>tempor</span> <span>ut.</span> <span>In</span> <span>nulla</span> <span>elit,</span> <span>euismod</span> <span>id</span> <span>leo</span> <span>in,</span> <span>aliquam</span> <span>imperdiet</span> <span>nulla.</span> ",
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
        text: "<span>Lorem</span> <span>ipsum</span> <span>dolor</span> <span>sit</span> <span>amet,</span> <span>consectetur</span> <span>adipiscing</span> <span>elit.</span> <span>Fusce</span> <span>dictum,</span> <span>elit</span> <span>a</span> <span>tristique</span> <span>varius,</span> <span>elit</span> <span>mauris</span> <span>porttitor</span> <span>neque,</span> <span>id</span> <span>maximus</span> <span>sem</span> <span>elit</span> <span>vel</span> <span>sapien.</span> <span>Maecenas</span> <span>a</span> <span>metus</span> <span>molestie,</span> <span>luctus</span> <span>sem</span> <span>nec,</span> <span>venenatis</span> <span>mauris.</span> <span>Pellentesque</span> <span>habitant</span> <span>morbi</span> <span>tristique</span> <span>senectus</span> <span>et</span> <span>netus</span> <span>et</span> <span>malesuada</span> <span>fames</span> <span>ac</span> <span>turpis</span> <span>egestas.</span> <span>Pellentesque</span> <span>vitae</span> <span>varius</span> <span>tellus.</span> <span>Vestibulum</span> <span>nibh</span> <span>nisl,</span> <span>molestie</span> <span>non</span> <span>gravida</span> <span>et,</span> <span>consectetur</span> <span>vitae</span> <span>mauris.</span> <span>Proin</span> <span>ac</span> <span>fringilla</span> <span>magna,</span> <span>eu</span> <span>placerat</span> <span>risus.</span> <span>Nullam</span> <span>mollis</span> <span>consequat</span> <span>malesuada.</span> <span>Integer</span> <span>ut</span> <span>laoreet</span> <span>dui.</span> <span>Curabitur</span> <span>in</span> <span>lacinia</span> <span>diam.</span> <span>Praesent</span> <span>velit</span> <span>neque,</span> <span>suscipit</span> <span>a</span> <span>tortor</span> <span>non,</span> <span>bibendum</span> <span>eleifend</span> <span>enim.</span> <span>Praesent</span> <span>vitae</span> <span>interdum</span> <span>arcu.</span> <span>Duis</span> <span>et</span> <span>dapibus</span> <span>eros,</span> <span>id</span> <span>dictum</span> <span>felis.</span> <span>Nunc</span> <span>ut</span> <span>mauris</span> <span>nec</span> <span>mi</span> <span>gravida</span> <span>maximus.</span> <span>Maecenas</span> <span>ut</span> <span>nunc</span> <span>vitae</span> <span>neque</span> <span>gravida</span> <span>gravida.</span> <span>Morbi</span> <span>quis</span> <span>erat</span> <span>elit.</span> <span>Ut</span> <span>rhoncus</span> <span>sed</span> <span>est</span> <span>imperdiet</span> <span>ullamcorper.</span> <span>Quisque</span> <span>a</span> <span>ultrices</span> <span>turpis.</span> <span>Suspendisse</span> <span>potenti.</span> <span>Sed</span> <span>sodales</span> <span>augue</span> <span>augue,</span> <span>vel</span> <span>imperdiet</span> <span>dui</span> <span>efficitur</span> <span>et.</span> <span>Morbi</span> <span>rhoncus</span> <span>volutpat</span> <span>ligula</span> <span>non</span> <span>pharetra.</span> <span>Suspendisse</span> <span>potenti.</span> <span>Cras</span> <span>tristique</span> <span>imperdiet</span> <span>est,</span> <span>eget</span> <span>fermentum</span> <span>nunc</span> <span>fermentum</span> <span>vitae.</span> <span>Nam</span> <span>eget</span> <span>justo</span> <span>dignissim,</span> <span>dignissim</span> <span>massa</span> <span>convallis,</span> <span>semper</span> <span>eros.</span> <span>Vestibulum</span> <span>auctor,</span> <span>augue</span> <span>ut</span> <span>sollicitudin</span> <span>mattis,</span> <span>augue</span> <span>magna</span> <span>lobortis</span> <span>libero,</span> <span>non</span> <span>cursus</span> <span>purus</span> <span>orci</span> <span>sed</span> <span>arcu.</span> <span>Morbi</span> <span>iaculis</span> <span>erat</span> <span>ante,</span> <span>sed</span> <span>fringilla</span> <span>lorem</span> <span>tempor</span> <span>ut.</span> <span>In</span> <span>nulla</span> <span>elit,</span> <span>euismod</span> <span>id</span> <span>leo</span> <span>in,</span> <span>aliquam</span> <span>imperdiet</span> <span>nulla.</span> ",
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
        text: "<span>Lorem</span> <span>ipsum</span> <span>dolor</span> <span>sit</span> <span>amet,</span> <span>consectetur</span> <span>adipiscing</span> <span>elit.</span> <span>Fusce</span> <span>dictum,</span> <span>elit</span> <span>a</span> <span>tristique</span> <span>varius,</span> <span>elit</span> <span>mauris</span> <span>porttitor</span> <span>neque,</span> <span>id</span> <span>maximus</span> <span>sem</span> <span>elit</span> <span>vel</span> <span>sapien.</span> <span>Maecenas</span> <span>a</span> <span>metus</span> <span>molestie,</span> <span>luctus</span> <span>sem</span> <span>nec,</span> <span>venenatis</span> <span>mauris.</span> <span>Pellentesque</span> <span>habitant</span> <span>morbi</span> <span>tristique</span> <span>senectus</span> <span>et</span> <span>netus</span> <span>et</span> <span>malesuada</span> <span>fames</span> <span>ac</span> <span>turpis</span> <span>egestas.</span> <span>Pellentesque</span> <span>vitae</span> <span>varius</span> <span>tellus.</span> <span>Vestibulum</span> <span>nibh</span> <span>nisl,</span> <span>molestie</span> <span>non</span> <span>gravida</span> <span>et,</span> <span>consectetur</span> <span>vitae</span> <span>mauris.</span> <span>Proin</span> <span>ac</span> <span>fringilla</span> <span>magna,</span> <span>eu</span> <span>placerat</span> <span>risus.</span> <span>Nullam</span> <span>mollis</span> <span>consequat</span> <span>malesuada.</span> <span>Integer</span> <span>ut</span> <span>laoreet</span> <span>dui.</span> <span>Curabitur</span> <span>in</span> <span>lacinia</span> <span>diam.</span> <span>Praesent</span> <span>velit</span> <span>neque,</span> <span>suscipit</span> <span>a</span> <span>tortor</span> <span>non,</span> <span>bibendum</span> <span>eleifend</span> <span>enim.</span> <span>Praesent</span> <span>vitae</span> <span>interdum</span> <span>arcu.</span> <span>Duis</span> <span>et</span> <span>dapibus</span> <span>eros,</span> <span>id</span> <span>dictum</span> <span>felis.</span> <span>Nunc</span> <span>ut</span> <span>mauris</span> <span>nec</span> <span>mi</span> <span>gravida</span> <span>maximus.</span> <span>Maecenas</span> <span>ut</span> <span>nunc</span> <span>vitae</span> <span>neque</span> <span>gravida</span> <span>gravida.</span> <span>Morbi</span> <span>quis</span> <span>erat</span> <span>elit.</span> <span>Ut</span> <span>rhoncus</span> <span>sed</span> <span>est</span> <span>imperdiet</span> <span>ullamcorper.</span> <span>Quisque</span> <span>a</span> <span>ultrices</span> <span>turpis.</span> <span>Suspendisse</span> <span>potenti.</span> <span>Sed</span> <span>sodales</span> <span>augue</span> <span>augue,</span> <span>vel</span> <span>imperdiet</span> <span>dui</span> <span>efficitur</span> <span>et.</span> <span>Morbi</span> <span>rhoncus</span> <span>volutpat</span> <span>ligula</span> <span>non</span> <span>pharetra.</span> <span>Suspendisse</span> <span>potenti.</span> <span>Cras</span> <span>tristique</span> <span>imperdiet</span> <span>est,</span> <span>eget</span> <span>fermentum</span> <span>nunc</span> <span>fermentum</span> <span>vitae.</span> <span>Nam</span> <span>eget</span> <span>justo</span> <span>dignissim,</span> <span>dignissim</span> <span>massa</span> <span>convallis,</span> <span>semper</span> <span>eros.</span> <span>Vestibulum</span> <span>auctor,</span> <span>augue</span> <span>ut</span> <span>sollicitudin</span> <span>mattis,</span> <span>augue</span> <span>magna</span> <span>lobortis</span> <span>libero,</span> <span>non</span> <span>cursus</span> <span>purus</span> <span>orci</span> <span>sed</span> <span>arcu.</span> <span>Morbi</span> <span>iaculis</span> <span>erat</span> <span>ante,</span> <span>sed</span> <span>fringilla</span> <span>lorem</span> <span>tempor</span> <span>ut.</span> <span>In</span> <span>nulla</span> <span>elit,</span> <span>euismod</span> <span>id</span> <span>leo</span> <span>in,</span> <span>aliquam</span> <span>imperdiet</span> <span>nulla.</span> ",
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
        text: "<span>Lorem</span> <span>ipsum</span> <span>dolor</span> <span>sit</span> <span>amet,</span> <span>consectetur</span> <span>adipiscing</span> <span>elit.</span> <span>Fusce</span> <span>dictum,</span> <span>elit</span> <span>a</span> <span>tristique</span> <span>varius,</span> <span>elit</span> <span>mauris</span> <span>porttitor</span> <span>neque,</span> <span>id</span> <span>maximus</span> <span>sem</span> <span>elit</span> <span>vel</span> <span>sapien.</span> <span>Maecenas</span> <span>a</span> <span>metus</span> <span>molestie,</span> <span>luctus</span> <span>sem</span> <span>nec,</span> <span>venenatis</span> <span>mauris.</span> <span>Pellentesque</span> <span>habitant</span> <span>morbi</span> <span>tristique</span> <span>senectus</span> <span>et</span> <span>netus</span> <span>et</span> <span>malesuada</span> <span>fames</span> <span>ac</span> <span>turpis</span> <span>egestas.</span> <span>Pellentesque</span> <span>vitae</span> <span>varius</span> <span>tellus.</span> <span>Vestibulum</span> <span>nibh</span> <span>nisl,</span> <span>molestie</span> <span>non</span> <span>gravida</span> <span>et,</span> <span>consectetur</span> <span>vitae</span> <span>mauris.</span> <span>Proin</span> <span>ac</span> <span>fringilla</span> <span>magna,</span> <span>eu</span> <span>placerat</span> <span>risus.</span> <span>Nullam</span> <span>mollis</span> <span>consequat</span> <span>malesuada.</span> <span>Integer</span> <span>ut</span> <span>laoreet</span> <span>dui.</span> <span>Curabitur</span> <span>in</span> <span>lacinia</span> <span>diam.</span> <span>Praesent</span> <span>velit</span> <span>neque,</span> <span>suscipit</span> <span>a</span> <span>tortor</span> <span>non,</span> <span>bibendum</span> <span>eleifend</span> <span>enim.</span> <span>Praesent</span> <span>vitae</span> <span>interdum</span> <span>arcu.</span> <span>Duis</span> <span>et</span> <span>dapibus</span> <span>eros,</span> <span>id</span> <span>dictum</span> <span>felis.</span> <span>Nunc</span> <span>ut</span> <span>mauris</span> <span>nec</span> <span>mi</span> <span>gravida</span> <span>maximus.</span> <span>Maecenas</span> <span>ut</span> <span>nunc</span> <span>vitae</span> <span>neque</span> <span>gravida</span> <span>gravida.</span> <span>Morbi</span> <span>quis</span> <span>erat</span> <span>elit.</span> <span>Ut</span> <span>rhoncus</span> <span>sed</span> <span>est</span> <span>imperdiet</span> <span>ullamcorper.</span> <span>Quisque</span> <span>a</span> <span>ultrices</span> <span>turpis.</span> <span>Suspendisse</span> <span>potenti.</span> <span>Sed</span> <span>sodales</span> <span>augue</span> <span>augue,</span> <span>vel</span> <span>imperdiet</span> <span>dui</span> <span>efficitur</span> <span>et.</span> <span>Morbi</span> <span>rhoncus</span> <span>volutpat</span> <span>ligula</span> <span>non</span> <span>pharetra.</span> <span>Suspendisse</span> <span>potenti.</span> <span>Cras</span> <span>tristique</span> <span>imperdiet</span> <span>est,</span> <span>eget</span> <span>fermentum</span> <span>nunc</span> <span>fermentum</span> <span>vitae.</span> <span>Nam</span> <span>eget</span> <span>justo</span> <span>dignissim,</span> <span>dignissim</span> <span>massa</span> <span>convallis,</span> <span>semper</span> <span>eros.</span> <span>Vestibulum</span> <span>auctor,</span> <span>augue</span> <span>ut</span> <span>sollicitudin</span> <span>mattis,</span> <span>augue</span> <span>magna</span> <span>lobortis</span> <span>libero,</span> <span>non</span> <span>cursus</span> <span>purus</span> <span>orci</span> <span>sed</span> <span>arcu.</span> <span>Morbi</span> <span>iaculis</span> <span>erat</span> <span>ante,</span> <span>sed</span> <span>fringilla</span> <span>lorem</span> <span>tempor</span> <span>ut.</span> <span>In</span> <span>nulla</span> <span>elit,</span> <span>euismod</span> <span>id</span> <span>leo</span> <span>in,</span> <span>aliquam</span> <span>imperdiet</span> <span>nulla.</span> ",
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
        text: "<span>Lorem</span> <span>ipsum</span> <span>dolor</span> <span>sit</span> <span>amet,</span> <span>consectetur</span> <span>adipiscing</span> <span>elit.</span> <span>Fusce</span> <span>dictum,</span> <span>elit</span> <span>a</span> <span>tristique</span> <span>varius,</span> <span>elit</span> <span>mauris</span> <span>porttitor</span> <span>neque,</span> <span>id</span> <span>maximus</span> <span>sem</span> <span>elit</span> <span>vel</span> <span>sapien.</span> <span>Maecenas</span> <span>a</span> <span>metus</span> <span>molestie,</span> <span>luctus</span> <span>sem</span> <span>nec,</span> <span>venenatis</span> <span>mauris.</span> <span>Pellentesque</span> <span>habitant</span> <span>morbi</span> <span>tristique</span> <span>senectus</span> <span>et</span> <span>netus</span> <span>et</span> <span>malesuada</span> <span>fames</span> <span>ac</span> <span>turpis</span> <span>egestas.</span> <span>Pellentesque</span> <span>vitae</span> <span>varius</span> <span>tellus.</span> <span>Vestibulum</span> <span>nibh</span> <span>nisl,</span> <span>molestie</span> <span>non</span> <span>gravida</span> <span>et,</span> <span>consectetur</span> <span>vitae</span> <span>mauris.</span> <span>Proin</span> <span>ac</span> <span>fringilla</span> <span>magna,</span> <span>eu</span> <span>placerat</span> <span>risus.</span> <span>Nullam</span> <span>mollis</span> <span>consequat</span> <span>malesuada.</span> <span>Integer</span> <span>ut</span> <span>laoreet</span> <span>dui.</span> <span>Curabitur</span> <span>in</span> <span>lacinia</span> <span>diam.</span> <span>Praesent</span> <span>velit</span> <span>neque,</span> <span>suscipit</span> <span>a</span> <span>tortor</span> <span>non,</span> <span>bibendum</span> <span>eleifend</span> <span>enim.</span> <span>Praesent</span> <span>vitae</span> <span>interdum</span> <span>arcu.</span> <span>Duis</span> <span>et</span> <span>dapibus</span> <span>eros,</span> <span>id</span> <span>dictum</span> <span>felis.</span> <span>Nunc</span> <span>ut</span> <span>mauris</span> <span>nec</span> <span>mi</span> <span>gravida</span> <span>maximus.</span> <span>Maecenas</span> <span>ut</span> <span>nunc</span> <span>vitae</span> <span>neque</span> <span>gravida</span> <span>gravida.</span> <span>Morbi</span> <span>quis</span> <span>erat</span> <span>elit.</span> <span>Ut</span> <span>rhoncus</span> <span>sed</span> <span>est</span> <span>imperdiet</span> <span>ullamcorper.</span> <span>Quisque</span> <span>a</span> <span>ultrices</span> <span>turpis.</span> <span>Suspendisse</span> <span>potenti.</span> <span>Sed</span> <span>sodales</span> <span>augue</span> <span>augue,</span> <span>vel</span> <span>imperdiet</span> <span>dui</span> <span>efficitur</span> <span>et.</span> <span>Morbi</span> <span>rhoncus</span> <span>volutpat</span> <span>ligula</span> <span>non</span> <span>pharetra.</span> <span>Suspendisse</span> <span>potenti.</span> <span>Cras</span> <span>tristique</span> <span>imperdiet</span> <span>est,</span> <span>eget</span> <span>fermentum</span> <span>nunc</span> <span>fermentum</span> <span>vitae.</span> <span>Nam</span> <span>eget</span> <span>justo</span> <span>dignissim,</span> <span>dignissim</span> <span>massa</span> <span>convallis,</span> <span>semper</span> <span>eros.</span> <span>Vestibulum</span> <span>auctor,</span> <span>augue</span> <span>ut</span> <span>sollicitudin</span> <span>mattis,</span> <span>augue</span> <span>magna</span> <span>lobortis</span> <span>libero,</span> <span>non</span> <span>cursus</span> <span>purus</span> <span>orci</span> <span>sed</span> <span>arcu.</span> <span>Morbi</span> <span>iaculis</span> <span>erat</span> <span>ante,</span> <span>sed</span> <span>fringilla</span> <span>lorem</span> <span>tempor</span> <span>ut.</span> <span>In</span> <span>nulla</span> <span>elit,</span> <span>euismod</span> <span>id</span> <span>leo</span> <span>in,</span> <span>aliquam</span> <span>imperdiet</span> <span>nulla.</span> ",
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






