app.controller('SubTabController', function() {

  var that = this;

  that.allLength = null;

  that.tab = 1;

  that.setTab = function(newTab) {
    that.tab = newTab;
  };

  that.isSet = function(tabNum) {
    return that.tab === tabNum;
  };
});
