/*
  Pulp: a real-time collaborative storytelling platform



  Global TODO:

    validate all inputs - DONE: user and story
    DONE: implement tags
      test tags
    implement user DONE: bookmarks and DONE: avatars
    user profile page with go to bookmarks and change avatar (maybe)
    add dates to bookmark creation?

    by-word branches
        DONE: allow html in meteor output (currently prints out tags as text)
        DONE: add class on click
        DONE:permanent add id on panel submit
        DONE: ways to back out (click outside, a Cancel button)
        DONE: lock that word for other users
        clean up on unload

    first sign in demo/tutorial? 

    library search/filter
    library wider container than workspace?
    DONE: library card: truncated text of first panel, other options (created by, scoring, etc)

    big collection seed

  BUGS:
    when creating a new child for bespokeID1(or a new origin panel), activePanel doesnt update reactively. 
    works as expected when starting at non-origin panels
      FIXED: moved the session set out of the router, router was being called on form submit despite preventDefault

    NOTES/BLOG ideas:
      you cant send a string (class declaration, etc) from a helper to a template, but you can send an object! see isBookmarked
      including both data returned from a helper and text as an attribute in a tag (again, bookmarks)

      by-word choice: the collection as single truth, and how to use that as a real time interface (lock etc)
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

});  

Router.route('/story/:_id', function(){

  var targetPanel = Panels.findOne({_id: this.params._id});
  var parentStory = Panels.findOne({_id: targetPanel.parentStory});
  console.log('router called...');
  Session.set('currentStoryID', targetPanel.parentStory);
  Session.set('title', parentStory.title);

  this.render('story', {
    data: function() {
      return {panelID: this.params._id};
    },
  });
});

Router.route('/profile/:_id', function(){

  this.render('profile', 
    {data: function(){
      return {userId: this.params._id};
    }})

});

//////END URL ROUTING /////////////////

if (Meteor.isClient) {


  //// GLOBAL HELPERS //////////////
  scrollToActive = function(){
    console.log('scrollToActive active: ' + Session.get('activePanel'));

    $('html, body').animate({
        scrollTop: $("#"+Session.get('activePanel')).offset().top
      }, 1000);

    //Need to prevent page reload
    return false;
  }

  stripHTML = function(text){
    return text.replace(/(<([^>]+)>)/ig,'');
  }

  spanify = function(text){

    text = stripHTML(text);

    var words = text.split(' ');
    var spanifiedText = '';

    words.forEach(function(word){
      word = '<span>' + word + '</span>';
      spanifiedText += word + ' ';
    })

    console.log('spanify called');
    return spanifiedText;
  }

  clearErrors = function(){
    Session.set('storyError', null);
    Session.set('choiceError', null);
    Session.set('errorMessage', null);
  }
  //TODO: clean up on unload
  //      a clear all errors global helper

}
  ///////// END GLOBAL HELPERS ////////////////