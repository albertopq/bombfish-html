var fps = 30;
var player_stack = [];
var game_stack = [];
var bombs = [];
var total_bombs = 12;
var cols = 4;
var count = 0;
var level = 8;
var background_max = 910;
var curr_frame = 0;
var frames_to_wait = 70;
var ratio, fish_res_ratio;
var canvas;
var fish_res = 80;
var home_view, game_view;
var game_over = false;

window.requestAnimFrame = (function(){
  // return window.requestAnimationFrame  ||
  //   window.webkitRequestAnimationFrame ||
  //   window.mozRequestAnimationFrame ||
  //   window.oRequestAnimationFrame  ||
  //   window.msRequestAnimationFrame  ||
  return function( callback, element) {
      window.setTimeout(callback, 1000 / 40);
    };
})();

document.addEventListener('DOMContentLoaded', function() {
  var isTouch = window.ontouchstart;
  var touchstart = isTouch ? 'touchstart' : 'mousedown';
  ratio = ((document.body.scrollWidth * 80) / 400) / 80;
  fish_res_ratio = 80 * ratio;
  home_view = document.getElementById('home');
  game_view = document.getElementById('game');

  document.getElementById('play_button').addEventListener(touchstart, function() {
    startGame();
    utils.hide(home_view);
    utils.show(game_view);
  });
});


function startGame() {
  canvas = document.getElementById('peces');
  canvas.width = cols * fish_res_ratio;
  canvas.height = (total_bombs / cols) * fish_res_ratio;
  context = canvas.getContext('2d');
  var sprite = Sprite.init('img/peces', 1, 21, 'png');
  for (i = 0; i < total_bombs; i++) {
    bombs[i] = new Fish(i);
  }
  drawBombs();
  interval = setInterval(drawBombs, 1000 / fps);
  activeInterval = setInterval(activate, 1000);
  canvas.addEventListener('click', function(event) {
    checkClick(event.clientX, event.clientY);
    event.stopPropagation();
  });
}

function drawBombs() {
  canvas.width = canvas.width;
  for (i = 0; i < total_bombs; i++) {
    var current_fish = bombs[i];
    current_fish.draw(context);
    if (current_fish.countdown >= frames_to_wait) {
      //Timeout
      if (!game_over)
        fin(i);
    }
  }
}

function activate() {
  tba = Math.floor(total_bombs * Math.random());
  timeout = 0;
  while (!bombs[tba].is_activable() && timeout < 100) {
    tba = Math.floor(total_bombs * Math.random());
    timeout++;
  }
  if (timeout >= 100) {
    fin(bombs[game_stack.pop()].id);
  }
  bombs[tba].activate();
  game_stack.unshift(tba);
}

function increaseLevel() {
  
}

function checkClick(x, y) {
  var marginLeft = canvas.offsetLeft;
  var marginTop = canvas.offsetTop;
  var xPos = parseInt((x - marginLeft) / fish_res_ratio);
  var yPos = parseInt((y - marginTop) / fish_res_ratio);
  var touched_fish = (yPos * cols) + xPos;

  var next = bombs[game_stack.pop()].id;
  if (next == touched_fish) {
    bombs[touched_fish].active = 0;
  } else {
    fin(next);
  }
}

function fin(id) {
  game_over = true;
  bombs[id].explode();
  window.setTimeout(endAnimation, 1000);
  clearInterval(activeInterval);
}

function endAnimation() {
  clearInterval(interval);
  canvas.classList.add('game-over');
}
