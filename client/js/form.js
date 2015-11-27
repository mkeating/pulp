Template.form.events({

    'click .addChoiceButton': function(event){
      $('.hiddenInputs').show();
      $('html, body').animate({
        scrollTop: $(".hiddenInputs").offset().top
      }, 1000);
    },

    // What is this? 
    'submit .new-panel': function(event){
      console.log('form helper preventing default');
      event.preventDefault;
    }
  });
  
  Template.form.helpers({


    //these options turn on and off the 3 link modes
      dots: function() {
        return false;
      },

      choices: function() {
        return true;
      },

      words: function() {
        //this one might be a little harder to implement
        return true;
      }
  });