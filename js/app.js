(function() {

  window.App = {
    // ----------
    init: function() {
      var self = this;

      $('#browse')
        .click(function() {
          self.navigate("browse");
        });
    },

    // ----------
    goTo: function(name) {
      if (name == "browse") {
        this.page = new this.Browse();
      }
    },

    // ----------
    navigate: function(hash) {
      // Eventually we'll make this more efficient, but this works for now.
      location.href = "/#" + hash;
      location.reload();
    },

    // ----------
    template: function(name, config) {
      var rawTemplate = $("#" + name + "-template").text();
      var template = _.template(rawTemplate);
      var html = template(config);
      var $container = $("<div>")
        .addClass(name)
        .html(html);

      return $container;
    }
  };

  $(document).ready(function() {
    App.init();
  });

})();
