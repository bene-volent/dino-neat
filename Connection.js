class Connection {
  constructor(from, to, no, wei) {
    if (from) {
      this.from = from.No
      this.fromPos = createVector(from.x, from.y)
      this.to = to.No
      this.toPos = createVector(to.x, to.y)
      this.Inno = no
      this.wei = wei || Number(str(random(-1, 1)))
      this.enabled = random([true])
      this.removed = false
    }
  }
  static checkSource(a, b, ths) {
    let connections = []
    for (let i of ths.source.connectionGenes) {
      connections.push(i.Inno, i.from, i.to)
    }
    for (let i = 0; i < connections.length; i += 3) {
      if (a.No == connections[i + 1] && b.No == connections[i + 2]) {
        return [false, i / 3]
      }
    }
    return [true]
  }
  static checkSelf(a, b, ths) {
    let connections = []
    for (let i of ths) {
      connections.push(i.Inno, i.from, i.to)
    }
    for (let i = 0; i < connections.length; i += 3) {
      if (a.No == connections[i + 1] && b.No == connections[i + 2]) {
        return false
      }
    }
    return true
  }
  static checkSourceNo(a, b, ths) {
    let connections = []
    for (let i of ths.source.connectionGenes) {
      connections.push(i.Inno, i.from, i.to)
    }
    for (let i = 0; i < connections.length; i += 3) {
      if (a == connections[i + 1] && b == connections[i + 2]) {
        return i / 3
      }
    }
    return
  }
  static checkSelfNo(a, b, ths) {
    let connections = []
    for (let i of ths) {
      connections.push(i.Inno, i.from, i.to)
    }
    for (let i = 0; i < connections.length; i += 3) {
      if (a == connections[i + 1] && b == connections[i + 2]) {
        return false
      }
    }
    return true
  }
  copy() {
    let tmp = new Connection()
    tmp.from = this.from
    tmp.fromPos = this.fromPos.copy()
    tmp.to = this.to
    tmp.toPos = this.toPos.copy()
    tmp.Inno = this.Inno
    tmp.wei = this.wei
    tmp.enabled = this.enabled
    tmp.removed = this.removed
    return tmp

  }
  skeleton() {
    let tmp = new Connection()
    tmp.from = this.from
    tmp.fromPos = this.fromPos.copy()
    tmp.to = this.to
    tmp.toPos = this.toPos.copy()
    tmp.Inno = this.Inno
    tmp.wei = Number(str(random(-1, 1)))
    tmp.enabled = random([true])
    tmp.removed = false
    return tmp
  }
}
