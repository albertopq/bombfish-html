var utils =  {

  hide: function u_hide(element) {
    element.classList.add('hide');
  },

  show: function u_show(element) {
    element.classList.remove('hide');
  },

  switchScreen: function g_switchScreen(from, to) {
    this.hide(from);
    this.show(to);
  }
};


(function() {
  var defaultFontSize = 62.5;
  var defaultWidth = 320;
  var defaultHeight = 480;

  function scale() {
    var deviceWidth = window.innerWidth;
    var fontSize = defaultFontSize;

    //Check for non base width devices
    if (defaultWidth != deviceWidth) {
      var ratio = (deviceWidth / defaultWidth).toFixed(2);
      fontSize *= ratio;
    }

    document.documentElement.style.fontSize = fontSize.toFixed(2) + '%';
  };

  scale();
  window.addEventListener('resize', scale);
})();