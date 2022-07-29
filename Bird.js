class Bird{
  constructor(No){

  switch (No) {
    case 0:
      
      this.h = 80/2
      this.y = Ground-this.h/2-10
      this.w = 92/2
      break;
    case 1:
    this.y = Ground-55
    this.h = 80/2
    this.w = 92/2
      break;
case 2:
    this.y = Ground-105
    this.h = 80/2
    this.w = 92/2
      break;
    default:

  }
  this.x = width+this.w/2
  this.imgs = birdImg
  this.imgNo = 0
}
move(speed){
  this.x-=speed
  // console.log(this.y)
}
show(){
  push()
  
  imageMode(CENTER)
  image(this.imgs[floor(this.imgNo/8)],this.x,this.y,this.w,this.h)
  this.imgNo++
  if (floor(this.imgNo/8)>=2){
    this.imgNo = 0
  }
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
