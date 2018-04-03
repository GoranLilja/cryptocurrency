import { BlockChain } from "../BlockChain"
import { Transaction } from "../Transaction";

test("Constructor sets difficulty", () => {
    const b = new BlockChain(2, 200)
    expect(b.difficulty).toBe(2)
})

test("Genesis block should be set correctly", () => {
    const b = new BlockChain(2, 200)
    const block = b.getLatestBlock()
    expect(block.previousHash).toBe(null)
    expect(block.transactions).toEqual([])
    expect(block.nonce).toEqual(0)
})

test("Transactions should not be queued if balance is too low", () => {
    const b = new BlockChain(2, 0)
    const transactionResult = b.createTransaction(new Transaction("from", "to", 42))
    const miningResult = b.minePendingTransactions("miner")
    expect(transactionResult).toBe(false)
    expect(miningResult.coins).toEqual(0)
    expect(miningResult.numberOfTransactions).toEqual(0)
})

test("Transactions should be queued if balance is sufficient", () => {
    const b = new BlockChain(2, 0)
    b.createTransaction(new Transaction(null, "from", 42))
    b.minePendingTransactions("miner")
    const transactionResult = b.createTransaction(new Transaction("from", "to", 42))
    const miningResult = b.minePendingTransactions("miner")
    expect(transactionResult).toBe(true)
    expect(miningResult.coins).toEqual(42)
    expect(miningResult.numberOfTransactions).toEqual(2)
})

test("Miner should get rewarded", () => {
    const b = new BlockChain(2, 100)
    b.minePendingTransactions("miner")
    b.minePendingTransactions("miner")
    expect(b.getBalanceForAddress("miner")).toBe(100)
})