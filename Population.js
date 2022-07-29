class Population {
  constructor(size,Batching) {
    this.players = []

    this.pop = size
    this.bestPlayer;
    this.globalBestScore = 0
    this.MaxFitnesses = []
    this.MaxPop = 300
    this.MaxScore = []
    this.inputs = 10 + 1
    this.outputs = 4
    this.neat = new Neat(this.inputs, this.outputs)
    this.bestScore = 0
    this.gen = 0
    this.species = []
    for (let i = 0; i < size; i++) {
      this.players[i] = new Player(this.neat)
    }
    if(Batching){

    this.Batch = []
    this.BatchNo = 0
    this.MinimumSize = 40
    this.MaxBatchSize = floor(this.players.length/this.MinimumSize)
    this.DistributeBatch()
  }
    this.next = false
    this.extinctionEvent = false
    this.obstacles = [new Obstacle(floor(random(3)))]
    this.birds = []

    this.obstacleTimer = 0
    this.gameCounter = 0
    this.randomAdd = 0
    this.minimumTimer = 60
    this.obsSpeed = 8
  }
  UpdateObstacle() {
    this.obstacleTimer++
    this.gameCounter = this.givecurrentbestScore()
    if (this.obstacleTimer > this.minimumTimer + this.randomAdd) {
      this.addObstacle()
    }
    else if(random()<0.0001){
      this.addObstacle()
    }
    this.moveObstacle()
    for (let i = 0; i < this.obstacles.length; i++) {
      if (this.obstacles[i].x + this.obstacles[i].w / 2 < 0) {
        this.obstacles.splice(i, 1)
        i--
      }
    }
    for (let i = 0; i < this.birds.length; i++) {
      if (this.birds[i].x + this.birds[i].w / 2 < 0) {
        this.birds.splice(i, 1)
        i--
      }
    }
  }
  addObstacle() {
    if( this.gameCounter>1000&&random()<0.30){
      this.birds.push(new Bird(floor(random(3))))
      
    }
    else{
    this.obstacles.push(new Obstacle(floor(random(3))))
  }
    this.obsSpeed += 0.01
    this.randomAdd = floor(random(-20,30))
    this.obstacleTimer = 0
  }
  moveObstacle() {
    for (let i of this.obstacles) {
      i.move(this.obsSpeed)
    }
    for (let i of this.birds) {
      i.move(this.obsSpeed)
    }
  }
  showObstacle() {
    for (let i of this.obstacles) {
      i.show()
    }
    for (let i of this.birds) {
      i.show()
    }
  }
  obstacleCheck(obj) {
    for (let i of this.obstacles) {
      if (!obj.dead) {
        i.check(obj)
      }
    }
    for (let i of this.birds) {
      if (!obj.dead) {
        i.check(obj)
      }
    }
  }
  showGenome(x, y, w, h) {
    this.bestPlayer.brain.show(x, y, w, h)
  }
  show(show) {
    this.showObstacle()
    if (show == true) {
      for (let i = 0; i < this.players.length; i++)
        if (!this.players[i].dead)
          this.players[i].show()
    } else {
      this.bestPlayer.show()
    }

  }
  nextGen() {
    for (let i of this.players) {
      i.dead = true
    }
  }
  update() {
    this.UpdateObstacle()
    for (let i = 0; i < this.players.length; i++) {
      if (!this.players[i].dead) {
        this.players[i].look(this.obstacles,this.obsSpeed,this.birds)
        this.players[i].think()
        this.obstacleCheck(this.players[i])
        this.players[i].update()
      }
      if (this.players[i].score > this.globalBestScore) {
        this.globalBestScore = this.players[i].score
      }
    }
    this.selectBest()

  }
  done() {
    for (let i of this.players) {
      if (i.dead != true) {
        return false
      }
    }
    return true
  }
  calculateFitness() {
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].calculateFitness()
    }
  }
  killStale() {
    for (let i = this.species.length - 1; i >= 2; i--) {
      if (this.species[i].staleness >= 15) {
        this.species.splice(i, 1)
      }
    }
  }
  selectBest() {
    let fit = []
    for (let i of this.players) {
      i.calculateFitness()
      fit.push(i.fitness)
    }
    let index = fit.indexOf(max(fit))
    this.bestPlayer = this.players[index]
    this.bestScore = this.bestPlayer.score
  }
  getAvgFitnessSum() {
    var averageSum = 0;
    for (var s of this.species) {
      averageSum += s.averageFitness;
    }
    return averageSum;
  }
  killBad() {
    let as = this.getAvgFitnessSum()
    for (let i = this.species.length - 1; i > 0; i--) {
      if ((this.players.length * this.species[i].AverageFitness / as) < 1) {
        this.species.splice(i, 1)
      }
    }
  }
  cullSpecies() {
    for (let i of this.species) {
      i.cull()
      i.fitnessShare()
      i.setAverage()
    }
  }
  resetWorld(){
    this.gameCounter=0
    this.birds = []
    this.obstacles = [new Obstacle(floor(random(3)))]
    this.obstacleTimer = 0
    this.randomAdd = 0
    this.minimumTimer = 60
    this.obsSpeed = 8
  }
  naturalSelection() {
    var previousBest = this.players[0];
    this.resetWorld()
    this.speciate();
    this.calculateFitness();
    this.sortSpecies();


    if (this.extinctionEvent == true) {
      this.massExtinction()
      this.extinctionEvent = false
    }
    this.cullSpecies();

    this.killBad();
    this.killStale();
    this.selectBest();
    this.MaxFitnesses.push(this.bestPlayer.fitness)
    this.MaxScore.push(this.bestPlayer.score)
    // console.log(JSON.str)
    // console.log("generation  " + this.gen +  "  Number of mutations  " + this.neat.connectionGenes.length+"  species:   " + this.species.length + "  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");

    let as = this.getAvgFitnessSum()
    let children = []
    for (var j = 0; j < this.species.length; j++) {
      children.push(this.species[j].champ.clone());
      let NoOfChildren = floor(this.species[j].averageFitness / as * this.players.length) - 1;
      for (let i = 0; i < NoOfChildren; i++) {
        children.push(this.species[j].giveMeBaby())
      }
    }
    if (children.length < this.players.length) {
      children.push(previousBest.clone());
    }
    while (children.length < this.players.length) {
      children.push(this.species[0].giveMeBaby(this.innovationHistory));
    }
    this.players = []
    for (let i of children) {
      if(this.players.length<=this.MaxPop)
      this.players.push(i)
    }

    this.gen += 1
    if(this.MaxBatchSize){
      this.BatchNo = 0
      this.MaxBatchSize = floor(this.players.length/this.MinimumSize)

      this.DistributeBatch()
    }
  }

  massExtinction() {
    for (var i = 5; i < this.species.length; i++) {
      this.species.splice(i, 1);

      i--;
    }
  }
  sortSpecies() {
    for (let i = 0; i < this.species.length; i++) {
      this.species[i].sortSpecies()
    }
    this.species.sort((a, b) => {
      return b.bestFitness - a.bestFitness
    })
  }
  speciate() {
    for (let i of this.species) {
      i.players = []
    }
    for (let i = 0; i < this.players.length; i++) {
      let found = false;
      for (let s of this.species) {

        if (s.Rep.distance(this.players[i].brain) < this.neat.compatibilityThreshold) {
          s.addPlayer(this.players[i])
          found = true
          break
        }
      }
      if (!found) {
        this.species.push(new Species(this.players[i]))
      }
    }
  }
  DistributeBatch(){
    let inSize = floor(this.players.length/this.MaxBatchSize)
    let index = 0
    for(let i = 0;i<this.MaxBatchSize;i++){
      this.Batch[i] = []
      for(let j = 0;j<inSize;j++){
        this.Batch[i].push(this.players[index])
        index++
      }
    }
    for(let i = 0;i<this.players.length%this.MaxBatchSize;i++){
      this.Batch[this.MaxBatchSize-1].push(this.players[index])
      index++
    }

  }
  showBatch(){
    this.showObstacle()
    for(let i = 0;i<this.Batch[this.BatchNo].length;i++){
      if(this.Batch[this.BatchNo][i].dead == false)
      this.Batch[this.BatchNo][i].show()
    }

  }
  showBestInBatch(){
    this.showObstacle()
    this.GiveBestBatch().show()
  }
  UpdateInBatch(){
    this.UpdateObstacle()

    for(let i = 0;i<this.Batch[this.BatchNo].length;i++){
      if(!this.Batch[this.BatchNo][i].dead){
      this.Batch[this.BatchNo][i].look(this.obstacles,this.obsSpeed,this.birds)
      this.Batch[this.BatchNo][i].think()
      this.obstacleCheck(this.Batch[this.BatchNo][i])
      this.Batch[this.BatchNo][i].update()
    }

    if (this.Batch[this.BatchNo][i].score > this.globalBestScore) {
      this.globalBestScore = this.Batch[this.BatchNo][i].score
    }
}
this.checkCurrentBatch()

  }
  showBatchGenome(x,y,w,h){

    this.GiveBestBatch().brain.show(x,y,w,h)
  }

  checkCurrentBatch(){
      for (let i of this.Batch[this.BatchNo]) {
        if (i.dead != true) {
          return false
        }
      }
      this.BatchNo++
      this.resetWorld()
      if(this.BatchNo>=this.MaxBatchSize){
        this.naturalSelection()
      }
    }
    GiveBestBatch(){
      let scores = []
      for(let i = 0;i<this.Batch[this.BatchNo].length;i++){
        scores[i] = this.Batch[this.BatchNo][i].score
      }
      let index = scores.indexOf(max(scores))
      return this.Batch[this.BatchNo][index]
    }
    givecurrentbestScore(){
      if(this.Batch){
        return this.GiveBestBatch().score
      }
      else{
        this.selectBest()
        return this.bestPlayer.score
      }
    }

}
