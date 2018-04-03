import { BlockChain } from "./BlockChain"
import { Transaction } from "./Transaction"

const lilyCoin = new BlockChain(25, 100)
console.log(`Setting difficulty to ${lilyCoin.difficulty}.`)

class Participant {
    name: string
    address: string

    constructor(name, address) {
        this.name = name
        this.address = address
    }
}

const people = [
    new Participant("Alice", "1B9E14B8-E5D5-41D3-884D-938DA61A9A83"),
    new Participant("Bob", "A7457009-9892-434A-BA77-E57F9D6C1F48"),
    new Participant("Charlie", "8EE34EFF-5B53-4170-98D8-83B888DA68D7"),
    new Participant("Daisy", "6141A44E-6ABC-4066-8AC6-F2ABB089818C"),
    new Participant("Evan", "DC8ADB1F-3440-4F64-9FFC-4F8F1F2B02D2"),
    new Participant("Faith", "A7D55C95-8A25-480A-AECB-0CA9AD185A77"),
    new Participant("George", "73D33801-3232-4AA2-B79B-DEFF6FFF92CD")
]

for (const person of people) {
    const transaction = new Transaction(null, person.address, 50)
    lilyCoin.createTransaction(transaction)
}

let totalTime = 0
let numberOfBlocks = 0
for (let i = 0; i < 20; i++) {
    //if (Math.random() < 0.2) {
        const miner = people[Math.floor(Math.random() * people.length)]
        console.log(`⛏ ${miner.name} mines the pending transactions.`)
        const result = lilyCoin.minePendingTransactions(miner.address)
        console.log(`👍 (${i+1})Verified ${result.numberOfTransactions} transactions  (${result.coins} coins). Iterations: ${result.nonce}. Time: ${result.time}s.`);
        totalTime += result.time
        numberOfBlocks++
    // } else {
    //     let temp = people.map(x => x)
        
    //     const senderIndex = Math.floor(Math.random() * temp.length)

    //     const sender = temp[senderIndex]

    //     let receiverIndex = senderIndex
    //     while (senderIndex === receiverIndex) {
    //         receiverIndex = Math.floor(Math.random() * temp.length)
    //     }
    //     const recipient = temp[receiverIndex]

    //     const amount = Math.floor(Math.random() * 100)

    //     const transactionCreated = lilyCoin.createTransaction(new Transaction(sender.address, recipient.address, amount))
    //     if (transactionCreated) {
    //         console.log(`💵 ✅ ${sender.name} ➡️ ${recipient.name} ${amount} coins.`)
    //     } else {
    //         console.log(`💵 ❌ ${sender.name} ➡️ ${recipient.name} ${amount} coins.`)
    //     }
    // }
}

// Calculate any pending transactions
const result = lilyCoin.minePendingTransactions("")
console.log(`👍 Verified ${result.numberOfTransactions} transactions  (${result.coins} coins). Iterations: ${result.nonce}. Time: ${result.time}.`);

for (const person of people) {
    console.log(`${person.name}'s balance: ${lilyCoin.getBalanceForAddress(person.address)}.`)
}
console.log(`Total mining time: ${totalTime}s for ${numberOfBlocks}. (Average time: ${totalTime/numberOfBlocks}s) Difficulty: ${lilyCoin.difficulty}.`)
console.log(lilyCoin.isChainValid() ? "✅ Chain is valid!" : "❌ Chain is NOT valid!")
