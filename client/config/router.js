// define the plugin
Iron.Router.plugins.hideBootstrapModalOnStop=function(router,options){
  router.onStop(function(){
    // hide modal backdrop on route change
    $(".modal-backdrop").remove();
    // remove modal-open state on body
    $("body").removeClass("modal-open");
  });
};

// activate the plugin
Router.plugin("hideBootstrapModalOnStop");