class Player {
  constructor(parent) {
    this.score = 0
    this.fitness = 0
    this.finalFitness = 0
    this.bestScore = 0
    if (parent) {
      this.Data = parent
      this.brain = this.Data.GiveGenome()
      this.decision = []
      this.vision = []
    } else {
      this.human = true
      this.obstacles = [new Obstacle(floor(random(3)))]
      this.obstacleTimer = 0
      this.randomAdd = 0
      this.minimumTimer = 60
      this.obsSpeed = 8
    }
    this.dead = false
    this.lifeSpan = 0
    this.gen = 0

    ///GameStuff\
    this.w = 88/2
    this.runImaNo = 0
    this.runImg = dino_run
    this.crImg = dinoCr
    this.idle = dinoIdle

    this.ow = this.w
    this.h = 94/2
    this.oh = this.h
    this.crw = 118/2
    this.crh = 60/2
    this.x = width/5
    this.y = Ground-this.h/2
    this.crouched = false
    this.targetObs;
    this.gravity = 0.75
    this.jumpForce = 16
    this.downVel = 0
    this.grounded = true

  }
  //////For Human Play
  UpdateObstacle(){
    this.obstacleTimer++
    if(this.obstacleTimer>this.minimumTimer+this.randomAdd){
        this.addObstacle()
      }
      this.moveObstacle()

    for(let i = 0 ;i<this.obstacles.length;i++){
      if(this.obstacles[i].x+this.obstacles[i].w/2<0){
        this.obstacles.splice(i,1)
        i--
      }
    }
  }
  addObstacle(){
    this.obstacles.push(new Obstacle(floor(random(3))))
    this.obsSpeed+=0.002
    this.randomAdd=floor(random(30))
    this.obstacleTimer = 0

  }
  moveObstacle(){
    for(let i of this.obstacles){
      i.move(this.obsSpeed)
    }
  }
  showObstacle(){
    for(let i of this.obstacles){
      i.show()
    }
  }
  obstacleCheck(obj) {
    for (let i of this.obstacles) {
      if (!obj.dead) {
        i.check(obj)
      }
    }
  }
  /////For HUman Play
  show() {
    if(this.obstacles)
    this.showObstacle()
    push()
    ///What???????
    // fill(0,60)
    // stroke(255)
    // noStroke()
    
    imageMode(CENTER)
    if (this.grounded){
      if (!this.crouched)
    image(this.runImg[floor(this.runImaNo/4)],this.x,this.y,this.w,this.h)
    
    else{
      image(this.crImg[floor(this.runImaNo/4)],this.x,this.y,this.w,this.h)

    }
    this.runImaNo++
    if (floor(this.runImaNo/4)>=2)
    this.runImaNo=0
    }
    else{
      image(this.idle,this.x,this.y,this.w,this.h)
    }
    pop()
  }
  still(){
    this.crouched = false
    this.h = this.oh
    this.w = this.ow
  }
  softmax(x){
        let tmp = []
        let summ = 0
        for (let i of x){
            summ+=exp(i)
            tmp.push(exp(i))
        }
        for (let i = 0 ;i<tmp.length;i++){
            tmp[i] = tmp[i]/summ
        }
        return tmp
    }
  update() {
    this.still()

    if(this.human){
      this.UpdateObstacle()
      this.obstacleCheck(this)

      let rand = random()
      if(rand>0.66)
      this.Bigjump()
      else if (rand<0.33){
        this.smallJump()
      }
      else{
        this.crouch()
      }
    }
    else{
      // console.log(this.decision)
      let tmp = this.softmax(this.decision)
      if(tmp.indexOf(max(tmp))==0){
        Node.activateNode(12,this.brain.nodes)
        this.Bigjump()
      }
      else if(tmp.indexOf(max(tmp))==1){
        Node.activateNode(13,this.brain.nodes)

        this.smallJump()
      }
      else if(tmp.indexOf(max(tmp))==2){
        Node.activateNode(14,this.brain.nodes)

        this.crouch()
      }else{
  Node.activateNode(15,this.brain.nodes)
      }

    }

    ///PLAYER CALCULATIONS
    this.lifeSpan++
    if(this.lifeSpan%5==0)
    this.score++
    this.downVel+=this.gravity
    this.y+=this.downVel
    this.y = constrain(this.y,this.h/2,Ground+1-this.h/2)
    if(this.y>=Ground-this.h/2)
    {this.downVel = 0
    this.grounded = true}
    else{
      this.grounded = false
    }
  }
  think() {
    if (!HumanPlaying) {
      this.decision = this.brain.predict(this.vision)

    }

  }
  look(obs,speed,birds) {

    if (!HumanPlaying) {
      if(obs.length == 0){
        this.vision[0] =this.y/DrawHeight
        this.vision[1] =0
        this.vision[2] =0
        this.vision[3] =0
        this.vision[4] = 0

        this.vision[5] =speed
        this.vision[6] =  0
}
      else{
        let dis = []
        for (let i of obs){
          dis.push(i.x-this.x)
        }
        let mini = max(dis)
        let index = 0
        for(let i = 0 ;i<dis.length;i++){
          if(dis[i]<mini&&dis[i]>=0){
            mini = dis[i]
            index = i
          }
        }

        let di
        if(obs.length>1){
          let mx = max(dis)
          for(let i = 0;i<dis.length;i++){
            if(i<mx && i>mini){
              mx=i
            }
          }
          di = mx-mini
        }
        // console.log(obs,dis,di,mini,index)
        let target = obs[index]
        this.vision[0] = this.y/DrawHeight
        this.vision[1] = target.w/90
        this.vision[2] = target.h/90
        this.vision[3] =  (this.x-target.x)/width
        if(di){
          this.vision[4] = di/width
        }
        else{
          this.vision[4] = 1
        }
        this.vision[5] =speed



      }

    if(birds.length==0){
      this.vision[6] = 1
      this.vision[7] = 1
      this.vision[8] = 0
      this.vision[9] = 0

    }
    else{
      let index = -1
      let minn = Infinity
      for(let i = 0 ;i<birds.length;i++){
        let diss = birds[i].x - this.x
        if(diss>=0 && diss<minn)
        {
          minn = diss
          index = i
        }
      }

      if(index==-1){
        this.vision[6] = 1
        this.vision[7] = 1
        this.vision[8] = 0
        this.vision[9] = 0
      }
      else{
        let birdTarget = birds[index]
        this.vision[6] = minn/width
        this.vision[7] = birdTarget.y/DrawHeight
        this.vision[8] = birdTarget.w/60
        this.vision[9] = birdTarget.h/60
        // console.log(this.vision.slice(6,8))

      }
    }
this.vision[10] = 1

}

  }
  clone() {
    let clone = new Player(this.Data)
    clone.fitness = this.fitness
    clone.brain = this.brain.clone()
    clone.gen = this.gen
    clone.bestScore = this.score
    return clone
  }
  calculateFitness() {
    this.fitness = this.lifeSpan/1000+this.score*this.score/100
  }
  crossover(P2) {
    let child = new Player(this.Data)
    child.brain = this.brain.crossover(P2.brain)
    return child
  }
  Bigjump(){
    if(this.grounded)
    this.downVel=-this.jumpForce
  }
  smallJump(){
if(this.grounded)
    this.downVel=-this.jumpForce*0.8
  }
  crouch(){
    if(this.grounded){
      this.crouched = true
    this.h = this.crh
    this.w = this.crw
this.y = Ground-this.h/2
    }
  }
}
