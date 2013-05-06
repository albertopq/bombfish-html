'use strict';

var Game = {
  gameView: null,
  homeView: null,
  postGameView: null,
  playButton: null,
  playAgain: null,
  canvas: null,
  context: null,
  NUM_COLS: 4,
  TOTAL: 12,
  FRAMES_TO_WAIT: 70,
  FPS: 30,
  fishRatio: null,
  fishes: [],
  gameOver: false,
  interval: null,
  activeInterval: null,
  gameStack: [],
  score: 0,
  scoreContainer: null,

  init: function g_init() {
    this.initContainers();
  },

  initContainers: function g_initContainers() {
    Sprite.init('img/peces', 1, 21, 'png');
    var ratio = ((document.body.scrollWidth * 80) / 400) / 80;
    this.fishRatio = 80 * ratio;

    this.playButton = document.getElementById('play_button');
    this.playAgain = document.getElementById('play_again');
    this.homeView = document.getElementById('home');
    this.gameView = document.getElementById('game');
    this.canvas = document.getElementById('peces');
    this.postGameView = document.getElementById('post_game');
    this.scoreContainer = document.getElementById('score');
    this.canvas.width = this.NUM_COLS * this.fishRatio;
    this.canvas.height = (this.TOTAL / this.NUM_COLS) * this.fishRatio;
    this.context = this.canvas.getContext('2d');

    var self = this;
    this.playAgain.addEventListener('click', function onClick() {
      Game.restart();
    });
    this.playButton.addEventListener('click', function onClick() {
      Game.start();
      utils.switchScreen(self.homeView, self.gameView);
    });
    var isTouch = window.ontouchstart;
    var touchstart = isTouch ? 'touchstart' : 'mousedown';
    this.canvas.addEventListener(touchstart, function(event) {
      self.checkClick(event.clientX, event.clientY);
      event.stopPropagation();
    });
  },

  start: function g_start() {
    for (var i = 0; i < this.TOTAL; i++) {
      this.fishes[i] = new Fish(i, this.NUM_COLS, this.fishRatio);
    }
    this.scoreContainer.textContent = this.score;
    this.renderFrame();
    this.interval = setInterval(this.renderFrame.bind(this), 1000 / this.FPS);
    this.activeInterval = setInterval(this.activate.bind(this), 1000);
    var self = this;
  },

  restart: function g_restart() {
    this.score = 0;
    this.gameOver = false;
    this.gameStack = [];
    this.canvas.classList.remove('game-over');
    utils.switchScreen(this.postGameView, this.gameView);
    Game.start();
  },

  renderFrame: function g_renderFrame() {
    // Cleaning canvas
    this.canvas.width = this.canvas.width;

    for (var i = 0; i < this.TOTAL; i++) {
      var currentFish = this.fishes[i];
      currentFish.draw(this.context);
      if (currentFish.countdown >= this.FRAMES_TO_WAIT) {
        //Timeout
        if (!this.gameOver)
          this.end(i);
      }
    }
  },

  increaseScore: function g_increaseScore() {
    this.score++;
    this.scoreContainer.textContent = this.score;
    var newSpeed;
    switch(this.score) {
      case 5:
        newSpeed = 800;
        break;
      case 10:
        newSpeed = 700;
        break;
      case 20:
        newSpeed = 500;
        break;
      case 50:
        newSpeed = 400;
        break;
    }
    if (newSpeed) {
      clearInterval(this.activeInterval);
      this.activeInterval = setInterval(this.activate.bind(this), newSpeed);
    }
  },

  activate: function g_activate() {
    var tba = Math.floor(this.TOTAL * Math.random());
    var timeout = 0;
    var fishTBA = this.fishes[tba];
    while (!fishTBA.is_activable() && timeout < 100) {
      tba = Math.floor(this.TOTAL * Math.random());
      fishTBA = this.fishes[tba];
      timeout++;
    }
    if (timeout >= 100) {
      var last = this.fishes[this.gameStack.pop()].id;
      this.end(last);
    }
    fishTBA.activate();
    this.gameStack.unshift(tba);
  },

  checkClick: function g_checkClick(x, y) {
    var marginLeft = this.canvas.offsetLeft;
    var marginTop = this.canvas.offsetTop;
    var xPos = parseInt((x - marginLeft) / this.fishRatio);
    var yPos = parseInt((y - marginTop) / this.fishRatio);
    var touched_fish = (yPos * this.NUM_COLS) + xPos;
    var next = this.fishes[this.gameStack.pop()].id;
    if (next == touched_fish) {
      this.fishes[touched_fish].active = 0;
      this.increaseScore();
    } else {
      this.end(next);
    }
  },

  end: function g_end(id) {
    this.gameOver = true;
    this.fishes[id].explode();
    window.setTimeout(this.endAnimation.bind(this), 1000);
    clearInterval(this.activeInterval);
  },

  endAnimation: function g_endAnimation() {
    clearInterval(this.interval);
    var self = this;
    this.canvas.addEventListener('transitionend', function transEnd() {
      this.removeEventListener('transitionend', transEnd);
      utils.show(self.postGameView);
    })
    this.canvas.classList.add('game-over');
  }
};

document.addEventListener('DOMContentLoaded', function() {
  Game.init();
});
