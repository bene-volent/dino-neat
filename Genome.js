class Genome{
    mut_Con = 0.07
    mut_Node = 0.02
    mut_Wei = 0.8
    constructor(input,output,source,ch){

        this.source = source
        this.input = input
        this.output = output

        this.nodes = []
        this.connections = []
        if (ch)
        return

    }
    InitializeGenome(){
        let nodes = 1
        let Nolist = []
        for (let i of this.source.nodeGenes){
            Nolist.push(i.No)
        }
        while (nodes<=this.input){
            let index = Nolist.indexOf(nodes)
            if (index ==-1){
                this.nodes.push(new Node(nodes,0.1,map((nodes) / (this.input+1), 0, 1, 0.1, 0.9)))
                this.source.nodeGenes.push(this.nodes[this.nodes.length-1].clone())
            }
            else
            this.nodes.push(this.source.nodeGenes[index].clone())
            nodes++
        }
        while (nodes<=this.input+this.output){

            let index = Nolist.indexOf(nodes)
            if (index ==-1){
            this.nodes.push(new Node(nodes,0.9,map((nodes-this.input) / (this.output+1 ), 0, 1, 0.1, 0.9)))
            this.source.nodeGenes.push(this.nodes[this.nodes.length-1].clone())
        }
            else
            this.nodes.push(this.source.nodeGenes[index].clone())
            nodes++
        }
        this.connectBias()
    }
    connectBias(){
      let Biasnode = this.nodes[this.input-1]
      let outputNodes = []
      for (let i = this.input;i<this.input+this.output;i++){
        outputNodes.push(this.nodes[i])
      }
      let OtherNode = random(outputNodes)
      if (Connection.checkSelf(Biasnode,OtherNode,this.connections))
      {
          let pres = Connection.checkSource(Biasnode,OtherNode,this)
      if (pres.length==2){
          let tmp = this.source.connectionGenes[pres[1]].skeleton()
          this.connections.push(tmp.copy())
      }
      else{
          let tmp = new Connection(Biasnode,OtherNode,this.source.connectionGenes.length+1)
          this.source.connectionGenes.push(tmp.copy())
          this.connections.push(tmp)
      }
  }

    }
    InitializeRand(){

        let no = floor(random(0,2))
        for (let i = 0 ;i<=no;i++){
            this.mutate_addCon()
        }
    }
    static clone(g,n){
        let tmp = n.GiveGenome()
        for(let i = 0 ;i<g.nodes.length;i++){
            tmp.nodes[i] = g.nodes[i].clone()
        }
        for (let i = 0;i<g.connections.length;i++){
            tmp.connections[i]  = g.connections[i].copy()
        }
        return tmp
    }
    clone(){
        let tmp = this.source.GiveGenome()
        for(let i = 0 ;i<this.nodes.length;i++){
            tmp.nodes[i] = this.nodes[i].clone()
        }
        for (let i = 0;i<this.connections.length;i++){
            tmp.connections[i]  = this.connections[i].copy()
        }
        return tmp
    }
    mutate(){
        if (random()<this.mut_Con){
            this.mutate_addCon()
        }
            if (random()<this.mut_Node){
                this.mutate_addNode()
            }
                if (random()<this.mut_Wei){
                    this.mutate_Wei()
                }

    }

    show(x1,y1,w,h){
        let x2 = x1+w
        let y2 = y1+h
        let dia = 8
        push()
        for (let i of this.connections){
            if (i.enabled==true ){
                if (i.wei>0)
                stroke(0,0,255)
                else
                stroke(255,0,0)
                strokeWeight(4*Math.abs(i.wei))
                fill(255)
                textSize(15)
                textAlign(CENTER,TOP)
                // text(i.Inno,(map(i.fromPos.x,0,1,x1,x2)+map(i.toPos.x,0,1,x1,x2))/2,(map(i.fromPos.y,0,1,y1,y2)+map(i.toPos.y,0,1,y1,y2))/2)
                line(map(i.fromPos.x,0,1,x1,x2),map(i.fromPos.y,0,1,y1,y2),map(i.toPos.x,0,1,x1,x2),map(i.toPos.y,0,1,y1,y2))
            }
        }
        pop()
        for (let i of this.nodes){
            let x = map(i.x,0,1,x1,x2)
            let y = map(i.y,0,1,y1,y2)
            stroke(0)
            strokeWeight(dia/13)
            push()
            if(!i.active)
            fill(255)
            else{
              fill(0,255,100)
            }
            rectMode(CENTER)
            rect(x,y,dia*1.5,dia*1.5)
            fill(0)
            textSize(dia*1.2)
            textAlign(CENTER,CENTER)
            text(i.No,x,y)
            pop()
        }
    }
    mutate_addCon(){
        let n1 = random(this.nodes)
        while (n1.x==0.9){
            n1 = random(this.nodes)
        }
        let n2 = random(this.nodes)
        while(n2.x <= n1.x){
            n2 = random(this.nodes)
        }
        if (Connection.checkSelf(n1,n2,this.connections))
        {
            let pres = Connection.checkSource(n1,n2,this)
        if (pres.length==2){
            let tmp = this.source.connectionGenes[pres[1]].skeleton()
            this.connections.push(tmp.copy())
        }
        else{
            let tmp = new Connection(n1,n2,this.source.connectionGenes.length+1)
            this.source.connectionGenes.push(tmp.copy())
            this.connections.push(tmp)
        }
    }
}mutate_addNode(){
    if (this.connections.length>0){
    let con = random(this.connections)

    // console.log(con)
    let x = (con.fromPos.x + con.toPos.x)/2
    let y = (con.fromPos.y + con.toPos.y)/2
    let from = Node.getNode(con.from,this.source.nodeGenes).clone()
    let to = Node.getNode(con.to,this.source.nodeGenes).clone()
if (Node.checkSelf(x,y,this.nodes)){
        let index = Node.checkSource(x,y,this.source.nodeGenes)
        if (index){
            let tmp = this.source.nodeGenes[index].clone()
            this.nodes.push(tmp)
            let pos1 = Connection.checkSourceNo(from.No,tmp.No,this)
            let pos2 = Connection.checkSourceNo(tmp.No,to.No,this)

            if (pos1 == undefined){
            }
            else{

                let temp = this.source.connectionGenes[pos1].skeleton()
                // console.log(temp)
                this.connections.push(temp)
            }

            if(pos2 == undefined){
            }
            else{
                let temp = this.source.connectionGenes[pos2].skeleton()

                temp.enabled = con.enabled
                temp.weight = con.enabled
                con.enabled = false
                // console.log(temp)
                this.connections.push(temp)
            }

        }
        else{
            let Inno = this.source.nodeGenes.length+1
            let tmp = new Node(Inno,x,y)

            if(Connection.checkSelfNo(con.from,tmp.No,this.connections) && Connection.checkSelfNo(con.from,tmp.No,this.connections)){
                this.nodes.push(tmp)
                this.source.nodeGenes.push(tmp.clone())
                //FromEnd
                let pos1 = Connection.checkSourceNo(from.No,tmp.No,this)
                let pos2 = Connection.checkSourceNo(tmp.No,to.No,this)

                if (pos1){
                }
                else{
                    let Inno = this.source.connectionGenes.length+1
                    let temp = new Connection(from,tmp,Inno)
                    // console.log(temp)
                    this.source.connectionGenes.push(temp.skeleton())
                    this.connections.push(temp)
                }

                if(pos2){
                }
                else{
                    let Inno = this.source.connectionGenes.length+1
                    let temp = new Connection(tmp,to,Inno)
                    temp.enabled = con.enabled
                    temp.weight = con.enabled

                    con.enabled = false

                    // console.log(temp)
                    this.source.connectionGenes.push(temp.skeleton())
                    this.connections.push(temp)
                }
            }


        }

}



    // con.removed = true
    // con.enabled = false

}
}
giveConnections(){

    for (let i = 0 ; i <this.nodes.length;i++){
        this.nodes[i].connections = []
       for (let j = 0 ;j<this.connections.length;j++){
            if (this.connections[j].from == this.nodes[i].No && this.connections[j].enabled){
                this.nodes[i].giveConnections(this.connections[j])
            }
        }
    }
}
removeConnections(){
    for (let i = 0 ; i <this.nodes.length;i++){
        this.nodes[i].connections = []}
}
predict(inputs){
    this.sortNodes()
    this.giveConnections()
    for (let i = 0 ; i<this.input;i++){
        this.nodes[i].outs = inputs[i]
    }
    for (let i = 0 ;i<this.nodes.length;i++){
            this.nodes[i].calculate(this.nodes)
        }

        let outs = []
        for (let i = 0 ;i<this.output;i++){
            outs[i] = this.nodes[this.nodes.length-this.output+i].outs
        }
        for (let i = 0 ;i<this.nodes.length;i++){
            this.nodes[i].inputs = 0
        }
    this.removeConnections()
    return outs
}
distance(g2){
    //1,1;2,3;4,3;4,5;6,5;6;7
    let mm = this.connections
    let nn = g2.connections

    mm.sort((a,b)=>{return a.Inno - b.Inno})
    nn.sort((a,b)=>{return a.Inno - b.Inno})
    let m = []
    let n = []
    for (let i = 0 ;i <mm.length;i++){
        m[i] = mm[i].Inno
    }
    for (let i = 0 ;i<nn.length;i++){
        n[i] = nn[i].Inno
    }
    let i = 0
    let j = 0
    let same = 0
    let wei_diff = 0
    let diff = 0
    let step = 0

    while (i<m.length || j<n.length){
        step++
        if (step>1000){
            break
        }


        if (m[i]==n[j]){
            wei_diff += Math.abs(mm[i].wei-nn[j].wei)
            i++
            j++

            same++
        }
        else if (m[i]<n[j]){
            i++
            diff++
        }
        else if (m[i]>n[j]){
            j++
            diff++
        }
        else if(i>=m.length && j<n.length){
            j++
            diff++
        }

        else if(j>=n.length && i<m.length){
            i++
            diff++
        }
    }
    wei_diff = same == 0?1000:wei_diff/same
    let N = max([m.length,n.length])<20?1:max([m.length,n.length])


    return  this.source.excessCoeff * (N == 0?1000:diff/N)+this.source.weightDiffCoeff*wei_diff
}
crossover(g2){

    let mm = this.connections
    let nn = g2.connections
    mm.sort((a,b)=>{return a.Inno - b.Inno})
    nn.sort((a,b)=>{return a.Inno - b.Inno})
    let m = []
    let n = []
    for (let i = 0 ;i <mm.length;i++){
        m[i] = mm[i].Inno
    }
    for (let i = 0 ;i<nn.length;i++){
        n[i] = nn[i].Inno
    }
    let tmpCon  =[ ]
    let tmpNode = []
    for (let i = 0 ;i<this.nodes.length;i++){
        tmpNode[i] = this.nodes[i].clone()
    }
    let NodeNo = []
    for (let i = 0 ; i<tmpNode.length;i++){
        NodeNo[i] = tmpNode[i].No
    }
    for(let i = 0 ;i<g2.nodes.length;i++){
        if (NodeNo.indexOf(g2.nodes[i].No)==-1){
            tmpNode.push(g2.nodes[i].clone())
        }
    }
    let i = 0
    let j = 0
    let same = 0
    let wei_diff = 0
    let diff = 0
    let step = 0

    while (i<m.length || j<n.length){
        step++

        if (step>1000){
            break
        }


        if (m[i]==n[j]){
            wei_diff += Math.abs(mm[i].wei-nn[j].wei)
            let ran = random()
			let enable = true
            if (!mm[i].enabled || !nn[j].enabled)
            if ( ran<0.75){
                    enable = false

                }
            else{
                 enable = true

                }


         if(random()<0.75){
            let tmper = mm[i].copy()
			tmper.enabled = enable
			tmpCon.push(tmper)
        }
        else {
            let tmper = nn[j].copy()
			tmper.enabled = enable
			tmpCon.push(tmper)
        }
            i++
            j++

            same++
        }
        else if (m[i]<n[j]){
            tmpCon.push(mm[i].copy())

            i++

            diff++
        }
        else if (m[i]>n[j]){
            tmpCon.push(nn[j].copy())
            j++
            diff++
        }
        else if(i>=m.length && j<n.length){
            tmpCon.push(nn[j].copy())
            j++
            diff++
        }

        else if(j>=n.length && i<m.length){
            tmpCon.push(mm[i].copy())
            i++
            diff++
        }
    }
    let tmp = this.source.GiveGenome()

    let conTemp = []
       for (let i of tmpCon){
           conTemp.push(i.Inno)
       }
       // console.log('-------')
       // console.log(conTemp.length,tmpCon.length)

       for (let i = 0 ;i<conTemp.length;i++){
           let rep = 0
           for (let j = 0;j<conTemp.length;j++){
               if(conTemp[i]==conTemp[j]){
                   rep++
               }
           }
           if(rep>1){
               conTemp.splice(i,1)
               tmpCon.splice(i,1)
               i--
           }
       }

    for(let i = 0 ;i<tmpNode.length;i++){
        tmp.nodes[i] = tmpNode[i].clone()
    }
    for (let i = 0;i<tmpCon.length;i++){
        tmp.connections[i]  = tmpCon[i].copy()
    }
    return tmp


}
mutate_Wei(){
    for (let i = 0 ;i<this.connections.length;i++){
        if (random()<0.1){
            this.connections[i].wei=Number(str(random(-1,1)))
        }
        else{
            this.connections[i].wei+=Number(str(randomGaussian()/50))
        }
        this.connections[i].wei = constrain(this.connections[i].wei,-1,1)

    }
}
test()
{
        let inputs = []
        for (let i = 0 ;i<this.input;i++){
            inputs[i] = 1
        }
        return this.predict(inputs)
}
sortNodes(){
    this.nodes.sort((a,b)=>{return a.x-b.x})
}
}
