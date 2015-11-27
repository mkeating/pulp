Template.story.helpers({
      currentStoryID: function () {
        return Session.get('currentStoryID');
      },

      /*activePanel: function () {
        console.log('story helper active: ' + Session.get('activePanel'));
        return Session.get('activePanel');
      },*/

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

      Session.set('activePanel', Session.get('currentStoryID'));
      scrollToActive();      
      }
  }