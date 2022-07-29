let POP
let speed
let Human;
let HumanPlaying = !true
let ShowAll = false
let NoShow = false

let MaxFitnessReq
let DrawHeight
let Ground
let Batch = !false
let dino_run = []
let dinoCr = []
let birdImg = []
let dinoIdle = undefined
let scactusImg = []
function preload(){
  dino_run.push(loadImage('DinoImg/tile002.png'))
  dino_run.push(loadImage('DinoImg/tile003.png'))
  dinoCr.push(loadImage('DinoCrouched/tile000.png'))
  dinoCr.push(loadImage('DinoCrouched/tile001.png'))
  dinoIdle = loadImage('DinoImg/tile000.png')
  birdImg.push(loadImage('BirdImg/tile000.png'))
  birdImg.push(loadImage('BirdImg/tile001.png'))
}
function setup() {
  createCanvas(640, 720);
  console.log(dino_run,dinoCr,dinoIdle)
  DrawHeight = 2 / 3 * height
  Ground = DrawHeight-DrawHeight/15
  let maxx = 5000
  // speed.position(width-175,10)
  createButton("Show All Players").mousePressed(() => {
    ShowAll = !ShowAll
  })
  createButton("Hide Everything").mousePressed(() => {
    NoShow = !NoShow
  })
  createButton("Speed 1X").mousePressed(() => {
    speed.value(1)
  })
  createButton("Speed 2X").mousePressed(() => {
    speed.value(2)
  })
  createButton("Speed 10X").mousePressed(() => {
    speed.value(10)
  })
  createButton("Speed 50X").mousePressed(() => {
    speed.value(50)
  })
  speed = createSlider(1,maxx, 3, 1)



  if (!HumanPlaying) {
    POP = new Population(200,Batch);
  } else {
    Human = new Player()
  }
}


function draw() {
  background(237)

  for (let i = 0; i < speed.value(); i++)
    Update()
  if (!NoShow) {
    Render()
  }
  WriteInfo()

  //for stopping if needed

}

function Update() {
  if (!HumanPlaying) {
    if(!Batch){
    if (!POP.done()) {
      POP.update()
    } else {
      POP.naturalSelection()
    }
    if (max(POP.MaxFitnesses) > MaxFitnessReq && MaxFitnessesReq != undefined) {
      noLoop()
    }
  }
  else{
    POP.UpdateInBatch()
  }
  } else {
    Human.update()
    if(Human.dead)
    Human = new Player()
  }
}

function Render() {
  push()
  stroke(0)
  line(0,Ground,width,Ground)
  pop()
  if (!HumanPlaying) {
    if(!Batch){
    POP.show(ShowAll)
    POP.showGenome(width/2, 30, width/2, 300)

  }
  else{
    if(ShowAll){
      POP.showBatch()
    }
    else{
      POP.showBestInBatch()
    }
    POP.showBatchGenome(width/2, 30, width/2, 300)
  }
    push()
    fill(255)

    rect(0, DrawHeight, width, height - DrawHeight)
    FitnessChart()
    pop()

  } else {

    Human.show()
    CoverChart()
  }
}

function CoverChart() {
  push()
  fill(0)
  noStroke()
  rect(0, DrawHeight, width, height - DrawHeight)
  pop()
}

function FitnessChart() {
  let start = [0]
  push()
  textAlign(LEFT, TOP)
  stroke(0)
  fill(0)
  textSize((height - DrawHeight) / 17 - 5)
  text('Fitness Chart', start[0], DrawHeight + 2)
  text('MIN: ' + floor(min(POP.MaxFitnesses)), (width / 2) / 3, DrawHeight + 2)
  text('MAX: ' + floor(max(POP.MaxFitnesses)), 2 * (width / 2) / 3, DrawHeight + 2)

  pop()
  push()

  push()
  stroke(0)
  strokeWeight(2)

  line(0, DrawHeight, width, DrawHeight)
  line(0, DrawHeight + (height - DrawHeight) / 15, width, DrawHeight + (height - DrawHeight) / 15)
  pop()
  strokeWeight(2)
  let dis = (width / 2 - 5) / (POP.MaxFitnesses.length - 1)
  noFill()
  stroke(0, 0, 255)
  strokeWeight(1.5)

  beginShape()
  if(POP.MaxFitnesses.length>0){
  let hh = map(POP.MaxFitnesses[0], min(POP.MaxFitnesses), max(POP.MaxFitnesses), 0, 1)
    start.push( map(hh, 0, 1, height, DrawHeight + (height - DrawHeight) / 15 + 2))}
  vertex(start[0], start[1])
  // console.log(start)
  // console.log(max(fitnesses),fitnesses[gen])
  for (let i = 1; i < POP.MaxFitnesses.length; i++) {
    let h = map(POP.MaxFitnesses[i], min(POP.MaxFitnesses), max(POP.MaxFitnesses), 0, 1)
    vertex(start[0] + dis, map(h, 0, 1, height, DrawHeight + (height - DrawHeight) / 15 + 2))
    start = [start[0] + dis, map(h, 0, 1, height, DrawHeight + (height - DrawHeight) / 15 + 2)]
  }
  endShape()
  pop()
  push()
  stroke(0)
  strokeWeight(2)
  line(width / 2 - 5, DrawHeight, width / 2 - 5, height)
  pop()
  ScoreChart()
}

function ScoreChart() {
  let start = [width / 2 + 5]
  push()
  textAlign(LEFT, TOP)
  stroke(0)
  fill(0)
  textSize((height - DrawHeight) / 15 - 5)
  text('Score Chart', start[0], DrawHeight + 2)
  text('MIN: ' + floor(min(POP.MaxScore)), start[0] + (width / 2) / 3, DrawHeight + 2)
  text('MAX: ' + floor(max(POP.MaxScore)), start[0] + 2 * (width / 2) / 3, DrawHeight + 2)

  pop()
  push()
  stroke(0)
  strokeWeight(2)

  line(start[0], DrawHeight, start[0], height)
  pop()
  push()
  strokeWeight(2)
  let dis = (width / 2 - 5) / (POP.MaxScore.length - 1)
  noFill()
  stroke(0, 0, 255)
  strokeWeight(1.5)
  beginShape()
  if(POP.MaxFitnesses.length>0){
    let hh = map(POP.MaxScore[0], min(POP.MaxScore), max(POP.MaxScore), 0, 1)
      start.push( map(hh, 0, 1, height, DrawHeight + (height - DrawHeight) / 15 + 2))}
  vertex(start[0], start[1])
  // console.log(max(fitnesses),fitnesses[gen])
  for (let i = 1; i < POP.MaxScore.length; i++) {
    let h = map(POP.MaxScore[i], min(POP.MaxScore), max(POP.MaxScore), 0, 1)
    vertex(start[0] + dis, map(h, 0, 1, height, DrawHeight + (height - DrawHeight) / 15 + 2))
    start = [start[0] + dis, map(h, 0, 1, height, DrawHeight + (height - DrawHeight) / 15 + 2)]
  }
  endShape()
  pop()

}

function WriteInfo() {
  push()
  fill(51)
  stroke(51)
  textSize(width / 25)
  textAlign(LEFT, TOP)
  text("Gen : " + POP.gen, 10, 10)
  text("No Of Species : " + POP.species.length, 10, 40)
  text("Population : " + POP.players.length, 10, 70)
  if(Batch){
    text("Current Batch : " + (POP.BatchNo+1), 10, 100)
    text("Current BatchSize : " + POP.Batch[POP.BatchNo].length, 10, 130)
    text("Current Batch Best : " + POP.GiveBestBatch().score, 10, 160)
    text("BestScoreEver : " + POP.globalBestScore, 10, 190)


  }
  else{
  text("BestScore : " + POP.bestPlayer.score, 10, 100)
  text("BestScoreEver : " + POP.globalBestScore, 10, 130)

}
  pop()
}
