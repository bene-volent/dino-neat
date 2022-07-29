class Obstacle {
  constructor(No) {
    switch (No) {
      case 0:
        this.w = 30
        this.h = 90
        break;
      case 1:
        this.w = 50
        this.h = 55
        break;
        case 2:
          this.w = 90
          this.h = 30
          break;
      default:

    }
    this.x = width+this.w/2
    this.y = Ground-this.h/2
  }
  move(speed){
    this.x-=speed
  }
  show(){
    push()
    fill(51)
    stroke(220)
    rectMode(CENTER)
    rect(this.x,this.y,this.w,this.h)
    pop()
  }
  check(obj){
    //Later Use ---------->>>>    ||obj.x-obj.h/2<=this.y+this.h/2
    if(obj.y+obj.h/2>=this.y-this.h/2&&obj.y-obj.h/2<=this.y+this.h/2){
      if(obj.x+obj.w/2>=this.x-this.w/2&&obj.x-obj.w/2<=this.x+this.w/2)
      obj.dead = true
    }
  }
}
