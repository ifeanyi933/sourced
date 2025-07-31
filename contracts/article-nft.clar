;; Article NFT Contract for Sourced - Decentralized Journalism Protocol

(define-trait nft-trait
  (
    (get-owner (uint) (response principal (tuple (code uint))))
    (transfer (uint principal principal) (response bool (tuple (code uint))))
    (mint (principal (string-ascii 256) (string-ascii 256) (string-ascii 42)) (response uint (tuple (code uint))))
  )
)

(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-INVALID-CONTENT u101)
(define-constant ERR-TOKEN-NOT-FOUND u102)
(define-constant ERR-NOT-OWNER u103)

(define-data-var admin principal tx-sender)
(define-data-var last-token-id uint u0)

(define-map article-owners uint principal)
(define-map article-title uint (string-ascii 256))
(define-map article-summary uint (string-ascii 256))
(define-map article-hash uint (string-ascii 42))

;; Check if caller is admin
(define-private (is-admin)
  (is-eq tx-sender (var-get admin))
)

;; Check if caller owns a given token
(define-private (is-owner (token-id uint))
  (match (map-get? article-owners token-id)
    owner (is-eq tx-sender owner)
    false
  )
)

;; Mint a new article NFT
(define-public (mint (recipient principal) (title (string-ascii 256)) (summary (string-ascii 256)) (ipfs-hash (string-ascii 42)))
  (begin
    (asserts! (>= (len title) u5) (err ERR-INVALID-CONTENT))
    (asserts! (>= (len ipfs-hash) u10) (err ERR-INVALID-CONTENT))

    (let ((new-id (+ u1 (var-get last-token-id))))
      (map-set article-owners new-id recipient)
      (map-set article-title new-id title)
      (map-set article-summary new-id summary)
      (map-set article-hash new-id ipfs-hash)
      (var-set last-token-id new-id)
      (ok new-id)
    )
  )
)

;; Transfer ownership of an article
(define-public (transfer (token-id uint) (from principal) (to principal))
  (begin
    (asserts! (is-eq tx-sender from) (err ERR-NOT-AUTHORIZED))
    (asserts! (is-some (map-get? article-owners token-id)) (err ERR-TOKEN-NOT-FOUND))
    (asserts! (is-eq (unwrap! (map-get? article-owners token-id) (err ERR-TOKEN-NOT-FOUND)) from) (err ERR-NOT-OWNER))
    (map-set article-owners token-id to)
    (ok true)
  )
)

;; Read-only: Get article owner
(define-read-only (get-owner (token-id uint))
  (match (map-get? article-owners token-id)
    owner (ok owner)
    (err (tuple (code ERR-TOKEN-NOT-FOUND)))
  )
)

;; Read-only: Get article metadata
(define-read-only (get-metadata (token-id uint))
  (let (
    (title (map-get? article-title token-id))
    (summary (map-get? article-summary token-id))
    (hash (map-get? article-hash token-id))
  )
    (if (and (is-some title) (is-some summary) (is-some hash))
      (ok {
        title: (unwrap title),
        summary: (unwrap summary),
        hash: (unwrap hash)
      })
      (err (tuple (code ERR-TOKEN-NOT-FOUND)))
    )
  )
)

;; Admin-only: Transfer admin rights
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (var-set admin new-admin)
    (ok true)
  )
)
