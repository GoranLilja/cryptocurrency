const sha256 = require("crypto-js/sha256")
import { Transaction } from "./Transaction"

export class Block {
    timestamp: number
    transactions: Transaction[]
    previousHash: string
    hash: string
    nonce: number = 0
    blockDifficulty: number = 0

    constructor(timestamp: number, transactions: Transaction[], previousHash: string = "") {
        this.timestamp = timestamp
        this.transactions = transactions
        this.previousHash = previousHash
        this.hash = this.calculateHash()
    }

    calculateHash(): string {
        return sha256(
            this.timestamp +
            JSON.stringify(this.transactions) +
            this.previousHash +
            this.blockDifficulty +
            this.nonce).toString()
    }

    mineBlock(difficulty: number): any {
        const startTime = +new Date()
        this.blockDifficulty = difficulty
        this.hash = this.calculateHash()

        while (this.isHashValid(this.hash, difficulty) === false) {
            this.nonce++
            this.hash = this.calculateHash()
        }
        const totalTime = (+(new Date()) - startTime) / 1000
        return { nonce: this.nonce, time: totalTime }
    }

    private isHashValid(hash: string, num: number): boolean {
        const int = parseInt(hash, 16);
        const result = this.leftPad(int.toString(2), this.hash.length * 4, "0")
        const numberOfZeros = result.indexOf("1")
        return numberOfZeros === num
    }

    private leftPad(str: string, len: number, ch='0'): string {
        len = len - str.length + 1;
        return len > 0 ? new Array(len).join(ch) + str : str;
    }
}