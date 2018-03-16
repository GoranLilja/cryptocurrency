declare function require(name: string)

const sha256 = require("crypto-js/sha256")

class Block {
    timestamp: number
    data: any
    previousHash: string
    hash: string
    nonce: number

    constructor(timestamp: number, data: any, previousHash: string = "") {
        this.timestamp = timestamp
        this.data = data
        this.previousHash = previousHash
        this.hash = this.calculateHash()
        this.nonce = 0
    }

    calculateHash(): string {
        return sha256(this.timestamp + this.previousHash + JSON.stringify(this.data) + this.nonce).toString()
    }

    mineBlock(difficulty: number) {
        const startTime = +new Date()
        console.log("Start mining block.")
        while (this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")) {
            this.nonce++
            this.hash = this.calculateHash()
        }
        const totalTime = (+(new Date()) - startTime) / 1000
        console.log(`Block mined. Hash: ${this.hash}. Nonce: ${this.nonce}. Time spent: ${totalTime}s.`)
        
    }
}

class BlockChain {
    private chain: [Block]
    private difficulty: number = 5
    constructor() {
        this.chain = [this.createGenisisBlock()]
    }

    private createGenisisBlock(): Block {
        const now = +new Date()
        return new Block(now, null, null)
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length-1]
    }

    addBlock(block: Block): Block {
        block.previousHash = this.getLatestBlock().hash
        block.mineBlock(this.difficulty)
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
console.log("Mining block 1...")
lilyCoin.addBlock(new Block(+new Date(), { amount: 100 }))
console.log("Mining block 2...")
lilyCoin.addBlock(new Block(+new Date(), { amount: 120 }))
console.log("Done mining!")
console.log(`Chain valid? ${lilyCoin.isChainValid() ? "Yes" : "No"}`)
