/* FISH CLASS */
var frames_nadar = 10;
var last_frame = 16;
var frames_explode = 20;
var size = 160;

function Fish(id, cols, fish_res_ratio) {
  this.id = id;
  this.curr_frame = 0;
  this.countdown = 0;
  this.active = 0;
  this.up = 1;
  this.positionX = (this.id % cols) * fish_res_ratio;
  this.positionY = (parseInt(this.id / cols)) * fish_res_ratio;
  this.exploding = false;

  this.draw = function(context) {
    // Managing animation
    if(this.curr_frame==frames_nadar) {
      this.up = 0;
      this.countdown = 0;
    }else if(this.curr_frame==0){
      this.up = 1;
    }
    this.img = Sprite.getFrame(this.id, this.curr_frame);
    context.drawImage(this.img, 0, 0, size, size, this.positionX, this.positionY, fish_res_ratio, fish_res_ratio);
    // Calculating next frame
    if(this.active === 1) {
      if(this.curr_frame < last_frame) {
        this.curr_frame++;
      } else {
        this.countdown++;
        if (this.countdown > 70 && this.curr_frame < frames_explode && this.exploding) {
          this.curr_frame++;
        }
      }
    } else {

      if(this.curr_frame > frames_nadar){
        this.curr_frame--;
      }else{
        this.up ? this.curr_frame++ : this.curr_frame--;
      }
    }
  };

  this.explode = function() {
    this.exploding = true;
  };

  this.activate = function() {
    this.active = 1;
    this.countdown = 0;
  };

  this.deactivate = function() {
    this.active = 0;
  };

  this.is_activable = function() {
    return (this.active != 1 && this.countdown==0);
  };
}