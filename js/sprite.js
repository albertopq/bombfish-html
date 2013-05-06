'use strict';

/* This helper pre-loads all the images
  we need, in order to avoid flashes
  first time we load the frames */
var Sprite = {
  nodes: [],
  init: function sp_init(path, first, last, format) {
    for (var i = first; i <= last; i++) {
      var imgElem = document.createElement('img');
      imgElem.src = path + '/' + i + '.' + format;
      this.nodes.push(imgElem);
    }
  },

  getFrame: function sp_getFrame(requester, frame) {
    return this.nodes[frame];
  }
};
