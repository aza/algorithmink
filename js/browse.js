(function() {

  var component = App.Browse = function() {
    $('#draw, #edit, #save').hide();

    var ALL_IMAGES = null;
    $.get("saves", function(data){
      ALL_IMAGES = $("a[href*=.png]", data);

      var $browser = $("<div>")
        .addClass("browser")
        .appendTo("body");

      var $inner = $("<div>")
        .addClass("inner")
        .appendTo($browser);

      _.each(_.first(ALL_IMAGES, 150), function(v, i) {
        var src = "saves/" + $.trim( $(v).text() );
        var $img = $("<img>")
          .addClass("browser-thumbnail")
          .attr('src', src)
          .click(function() {
            var endPos = src.indexOf( ".png" );
            var hash = src.substring(src.length-12, endPos);
            App.navigate(hash);
          });

        // Randomize the order!
        var c = Math.random();
        if( c > 0.5 )
          $inner.append($img);
        else
          $inner.prepend($img);
      });
    });
  };

  // ----------
  component.prototype = {
  };

})();
