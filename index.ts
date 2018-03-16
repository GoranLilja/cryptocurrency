declare function require(name: string)

const sha256 = require("crypto-js/sha256")

class Block {
    index: number
    timestamp: number
    data: any
    previousHash: string
    hash: string

    constructor(index: number, timestamp: number, data: any, previousHash: string = "") {
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.previousHash = previousHash
        this.hash = this.calculateHash()
    }

    calculateHash(): string {
        return sha256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data)).toString()
    }
}

class BlockChain {
    private chain: [Block]
    constructor() {
        this.chain = [this.createGenisisBlock()]
    }

    private createGenisisBlock(): Block {
        const now = +new Date()
        return new Block(0, now, null, null)
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length-1]
    }

    addBlock(block: Block): Block {
        block.previousHash = this.getLatestBlock().hash
        block.hash = block.calculateHash()
        this.chain.push(block)
        return block
    }

    isChainValid(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            if (this.chain[i].hash !== this.chain[i].calculateHash()) {
                return false
            }
            if (this.chain[i].previousHash !== this.chain[i-1].hash) {
                return false
            }
        }
        return true
    }
}

const lilyCoin = new BlockChain()
lilyCoin.addBlock(new Block(1, + new Date(), { amount: 100 }))
lilyCoin.addBlock(new Block(2, + new Date(), { amount: 120 }))
console.log(JSON.stringify(lilyCoin, null, 2))
console.log(`Chain valid? ${lilyCoin.isChainValid() ? "Yes" : "No"}`)
