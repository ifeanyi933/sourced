import { describe, it, expect, beforeEach } from "vitest"

type Principal = string

interface NFTMetadata {
  title: string
  summary: string
  hash: string
}

interface Result<T = unknown> {
  value?: T
  error?: number
}

const mockContract = {
  admin: "ST1ADMIN000000000000000000000000000000000",
  tokenCounter: 0,
  owners: new Map<number, Principal>(),
  titles: new Map<number, string>(),
  summaries: new Map<number, string>(),
  hashes: new Map<number, string>(),

  isAdmin(caller: Principal) {
    return caller === this.admin
  },

  mint(caller: Principal, recipient: Principal, title: string, summary: string, hash: string): Result<number> {
    if (title.length < 5 || hash.length < 10) return { error: 101 }

    const newId = ++this.tokenCounter
    this.owners.set(newId, recipient)
    this.titles.set(newId, title)
    this.summaries.set(newId, summary)
    this.hashes.set(newId, hash)
    return { value: newId }
  },

  transfer(caller: Principal, tokenId: number, from: Principal, to: Principal): Result<boolean> {
    if (caller !== from) return { error: 100 }
    if (!this.owners.has(tokenId)) return { error: 102 }
    if (this.owners.get(tokenId) !== from) return { error: 103 }

    this.owners.set(tokenId, to)
    return { value: true }
  },

  getOwner(tokenId: number): Result<Principal> {
    if (!this.owners.has(tokenId)) return { error: 102 }
    return { value: this.owners.get(tokenId)! }
  },

  getMetadata(tokenId: number): Result<NFTMetadata> {
    if (!this.owners.has(tokenId)) return { error: 102 }

    return {
      value: {
        title: this.titles.get(tokenId)!,
        summary: this.summaries.get(tokenId)!,
        hash: this.hashes.get(tokenId)!
      }
    }
  },

  transferAdmin(caller: Principal, newAdmin: Principal): Result<boolean> {
    if (!this.isAdmin(caller)) return { error: 100 }
    this.admin = newAdmin
    return { value: true }
  }
}

describe("Article NFT Contract – Sourced", () => {
  const admin = "ST1ADMIN000000000000000000000000000000000"
  const author = "ST2WRITER000000000000000000000000000000000"
  const reader = "ST3READER000000000000000000000000000000000"

  beforeEach(() => {
    mockContract.admin = admin
    mockContract.tokenCounter = 0
    mockContract.owners.clear()
    mockContract.titles.clear()
    mockContract.summaries.clear()
    mockContract.hashes.clear()
  })

  it("should mint an article NFT with valid data", () => {
    const result = mockContract.mint(author, author, "Title of Article", "Brief summary", "QmIPFSHash123456")
    expect(result.value).toBe(1)

    const owner = mockContract.getOwner(1)
    expect(owner.value).toBe(author)

    const metadata = mockContract.getMetadata(1)
    expect(metadata.value?.title).toBe("Title of Article")
    expect(metadata.value?.hash).toBe("QmIPFSHash123456")
  })

  it("should not mint article with invalid content", () => {
    const result = mockContract.mint(author, author, "Bad", "Short", "badhash")
    expect(result).toEqual({ error: 101 })
  })

  it("should transfer article NFT between users", () => {
    const minted = mockContract.mint(author, author, "Deep Dive", "Investigative summary", "QmValidHash99999")
    expect(minted.value).toBe(1)

    const transferResult = mockContract.transfer(author, 1, author, reader)
    expect(transferResult.value).toBe(true)

    const newOwner = mockContract.getOwner(1)
    expect(newOwner.value).toBe(reader)
  })

  it("should fail transfer if not owner", () => {
    mockContract.mint(author, author, "Report", "On corruption", "QmHash88888")
    const result = mockContract.transfer(reader, 1, author, reader)
    expect(result).toEqual({ error: 100 }) // NOT AUTHORIZED
  })

  it("should allow admin to transfer ownership", () => {
    const result = mockContract.transferAdmin(admin, reader)
    expect(result.value).toBe(true)
    expect(mockContract.admin).toBe(reader)
  })

  it("should block non-admin from transferring admin rights", () => {
    const result = mockContract.transferAdmin(reader, author)
    expect(result).toEqual({ error: 100 })
  })
})
