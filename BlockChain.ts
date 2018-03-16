import { Block } from "./Block"
import { Transaction } from "./Transaction"

export class BlockChain {
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