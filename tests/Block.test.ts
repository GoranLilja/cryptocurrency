import { Block } from "../Block"

test("Constructor sets timestamp", () => {
    const b = new Block(123412341234, null, null)
    expect(b.timestamp).toBe(123412341234)
})

test("Hash is calculated correctly", () => {
    const b = new Block(123412341234, null, null)
    expect(b.calculateHash()).toBe("81269b099b179846362a1f193bead8ff0231eb9a85fa53f33f0cbd636b0a79c6")
})

test("Mine block should return correct nonce", () => {
    const b = new Block(123412341234, null, null)
    const result = b.mineBlock(2)
    expect(result.nonce).toBe(3)
})

