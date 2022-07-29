class Neat {
  constructor(inp, op) {
    this.i = inp
    this.o = op
    this.nodeGenes = []
    this.connectionGenes = []
    this.excessCoeff = 1;
    this.weightDiffCoeff = 0.5;
    this.compatibilityThreshold = 3;
  }
  GiveGenome() {
    let tmp = new Genome(this.i, this.o, this)
    tmp.InitializeGenome()
    tmp.InitializeRand()
    return tmp
  }

}
