class Node {
  constructor(no, x, y) {
    this.No = no || NaN
    this.x = x
    this.y = y
    this.connections = []
    this.outs = 0
    this.inputs = 0
    this.active = false
  }
  static activateNode(No,list){
    for(let i of list){
      if(i.No == No){
        i.active = true
      }
      else{
        i.active = false
      }
    }
  }
  static sigmoid(x) {
    return 1 / (1 + Math.exp(-4.9 * x))
  }
  calculate(list) {
    if (this.x > 0.1) {
      this.outs = Node.sigmoid(this.inputs)
    }
    for (let i = 0; i < this.connections.length; i++) {
      Node.getNode(this.connections[i].to, list).inputs += this.connections[i].wei * this.outs
    }
  }
  giveConnections(x) {
    this.connections.push(x)
  }
  clone() {
    let tmp = new Node(this.No, this.x, this.y)
    return tmp
  }
  static checkSelf(x, y, list) {
    for (let i of list) {
      if (x == i.x && y == i.y) {
        return false
      }
    }
    return true
  }
  static checkSource(x, y, th) {
    for (let i of th) {
      if (x == i.x && y == i.y) {
        return th.indexOf(i)
      }
    }
    return
  }
  static getNode(No, list) {
    for (let i of list) {
      if (No === i.No) {
        return i
      }
    }
  }
}
