import { Transaction } from "../Transaction"

test("Constructor sets from address", () => {
    const t = new Transaction("from", "to", 42)
    expect(t.fromAddress).toBe("from")
})
test("Constructor sets to address", () => {
    const t = new Transaction("from", "to", 42)
    expect(t.toAddress).toBe("to")
})
test("Constructor sets amount", () => {
    const t = new Transaction("from", "to", 42)
    expect(t.amount).toBe(42)
})