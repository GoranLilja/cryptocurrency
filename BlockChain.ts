import { Block } from "./Block"
import { Transaction } from "./Transaction"

export class BlockChain {
    private chain: Block[] = [this.createGenesisBlock()]
    difficulty: number = 12
    private pendingTransactions: Transaction[] = []
    private miningReward: number = 100

    constructor(difficulty: number = 12, miningReward: number = 100) {
        this.difficulty = difficulty
        this.miningReward = miningReward
    }

    private createGenesisBlock(): Block {
        return new Block(+new Date(), [], null)
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length-1]
    }

    minePendingTransactions(rewardAddress: string): any {
        let block = new Block(+new Date(), this.pendingTransactions, this.getLatestBlock().hash)
        const result = block.mineBlock(this.difficulty)
        this.chain.push(block)

        const totalCoins = this.pendingTransactions.map(a => a.amount).reduce((a, b) => { return a+b }, 0)
        const numberOfTransactions = this.pendingTransactions.length;
        this.pendingTransactions = [new Transaction(null, rewardAddress, this.miningReward)]

        return {...result, coins: totalCoins, numberOfTransactions: numberOfTransactions}
    }

    getBalanceForAddress(address): number {
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
                console.error(`❌ Hash for block at index ${i} is incorrect!`)
                return false
            }
            if (this.chain[i].previousHash !== this.chain[i-1].hash) {
                console.error(`❌ Previous hash block at index ${i} is incorrect!`)
                return false
            }
        }
        return true
    }
}