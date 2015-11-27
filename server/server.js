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







