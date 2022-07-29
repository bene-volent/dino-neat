class Species {
  constructor(head) {
    this.players = []
    this.bestFitness = 0
    this.champ;
    this.averageFitness = 0
    this.staleness = 0
    if (head) {
      this.players.push(head)
      this.Rep = head.brain.clone()
      this.bestFitness = head.fitness
      this.champ = head.clone()
    }
  }
  addPlayer(p) {
    this.players.push(p)
  }
  sortSpecies() {
    this.players.sort((a, b) => {
      return b.fitness - a.fitness
    })
    if (this.players.length == 0) {
      this.staleness = 200
      return
    }
    if (this.players[0].fitness > this.bestFitness) {
      this.bestFitness = this.players[0].fitness
      this.rep = this.players[0].brain.clone()
      this.champ = this.players[0].clone()
    } else {
      this.staleness++
    }
  }
  giveMeBaby() {
    let baby
    if (random() > 0.75) {
      baby = this.selectPlayer().clone()
    } else {
      let p1 = this.selectPlayer()
      let p2 = this.selectPlayer()
      if (p1.fitness > p2.fitness) {
        baby = p1.crossover(p2)
      } else {
        baby = p2.crossover(p1)
      }
    }
    baby.brain.mutate()
    return baby
  }
  setAverage() {
    let summ = 0;
    for (let i = 0; i < this.players.length; i++) {
      summ += this.players[i].fitness
    }
    this.averageFitness = this.players.length == 0 ? 0 : summ / this.players.length

  }
  selectPlayer() {
    let fitSum = 0
    for (let i of this.players) {
      fitSum += i.fitness
    }
    let rand = random(fitSum)
    let runningSum = 0
    for (let i = 0; i < this.players.length; i++) {
      runningSum += this.players[i].fitness
      if (runningSum > rand) {
        return this.players[i]
      }
    }
    return this.players[0]
  }
  cull() {
    if (this.players.length > 2) {
      for (let i = this.players.length - 1; i >= round(this.players.length / 2); i--) {
        this.players.splice(i, 1)
      }
    }
  }
  fitnessShare() {
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].fitness /= this.players.length
    }
  }
}
