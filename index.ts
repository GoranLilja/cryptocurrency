declare function require(name: string)

const sha256 = require("crypto-js/sha256")

class Transaction {
    fromAddress: string
    toAddress: string
    amount: number

    constructor(fromAddress: string, toAddress: string, amount: number) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
    }
}

class Block {
    timestamp: number
    transactions: Transaction[]
    previousHash: string
    hash: string
    nonce: number = 0

    constructor(timestamp: number, transactions: Transaction[], previousHash: string = "") {
        this.timestamp = timestamp
        this.transactions = transactions
        this.previousHash = previousHash
        this.hash = this.calculateHash()
    }

    calculateHash(): string {
        return sha256(this.timestamp + this.previousHash + JSON.stringify(this.transactions) + this.nonce).toString()
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
    private chain: Block[] = []
    private difficulty: number = 2
    private pendingTransactions: Transaction[]
    private miningReward: number = 100

    constructor() {
        this.chain = [this.createGenesisBlock()]
        this.pendingTransactions = []
    }

    private createGenesisBlock(): Block {
        const now = +new Date()
        return new Block(now, [], null)
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length-1]
    }

    minePendingTransactions(rewardAddress: string): void {
        let block = new Block(+new Date(), this.pendingTransactions, this.getLatestBlock().hash)
        block.mineBlock(this.difficulty)
        this.chain.push(block)

        this.pendingTransactions = [new Transaction(null, rewardAddress, this.miningReward)]
    }

    getBalanceForAddress(address) {
        let balance = 0
        for (const block of this.chain) {
            for (const transaction of block.transactions) {
                if (transaction.fromAddress === address) {
                    balance -= transaction.amount
                }
                if (transaction.toAddress === address) {
                    balance += transaction.amount
                }
            }
        }
        return balance
    }

    createTransaction(transaction: Transaction): void {
        this.pendingTransactions.push(transaction)
    }

    isChainValid(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            if (this.chain[i].hash !== this.chain[i].calculateHash()) {
                console.error(`Hash for block at index ${i} is incorrect!`)
                return false
            }
            if (this.chain[i].previousHash !== this.chain[i-1].hash) {
                console.error(`Previous hash block at index ${i} is incorrect!`)
                return false
            }
        }
        return true
    }
}

const alice = "1B9E14B8-E5D5-41D3-884D-938DA61A9A83"
const bob = "A7457009-9892-434A-BA77-E57F9D6C1F48"
const charlie = "8EE34EFF-5B53-4170-98D8-83B888DA68D7"

const lilyCoin = new BlockChain()
lilyCoin.createTransaction(new Transaction(alice, bob, 100))
lilyCoin.createTransaction(new Transaction(bob, alice, 20))
lilyCoin.minePendingTransactions(charlie)

console.log(`Alice's balance: ${lilyCoin.getBalanceForAddress(alice)}.`)
console.log(`Bob's balance: ${lilyCoin.getBalanceForAddress(bob)}.`)
console.log(`Charlie's balance: ${lilyCoin.getBalanceForAddress(charlie)}.`)

console.log(`Chain valid? ${lilyCoin.isChainValid() ? "Yes" : "No"}`)