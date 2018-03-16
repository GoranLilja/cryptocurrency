const sha256 = require("crypto-js/sha256")
import { Transaction } from "./Transaction"

export class Block {
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