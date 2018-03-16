import { BlockChain } from "./BlockChain"
import { Transaction } from "./Transaction"

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