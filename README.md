# Sourced – Decentralized Trust Protocol for Journalism

A Web3-powered publishing platform that enables transparent, censorship-resistant journalism with verifiable authorship, fact-checking, and reader-supported funding models.

## Overview

Sourced is a decentralized protocol for journalism that utilizes smart contracts on the Stacks blockchain. It empowers independent journalists, curates community-reviewed content, and ensures the provenance and integrity of news articles.

This system consists of nine main Clarity smart contracts:

1. **Journalist Registry Contract** – Verifies and manages journalist identities and reputations  
2. **Article NFT Contract** – Tokenizes published articles as immutable NFTs  
3. **Content Staking Contract** – Allows readers to stake tokens to support or challenge content  
4. **Fact-Checker Registry Contract** – Registers and scores decentralized fact-checkers  
5. **Dispute Resolution Contract** – Handles disputes over content credibility  
6. **Payment Splitting Contract** – Fairly distributes earnings among contributors  
7. **Subscription Manager Contract** – Manages recurring subscriptions to authors or topics  
8. **Reputation Engine Contract** – Maintains dynamic reputation scores for all roles  
9. **DAO Governance Contract** – Enables community-driven protocol updates and funding

## Features

- Immutable article publishing using NFTs  
- Tokenized reputation for journalists and fact-checkers  
- Decentralized content validation via reader and checker staking  
- Automated revenue distribution to contributors  
- Subscription model for sustainable journalism  
- On-chain dispute resolution  
- Fully governed by a community DAO  

## Smart Contracts

### Journalist Registry Contract

- Journalist onboarding and verification  
- Issuance of reputation tokens  
- Blacklisting of bad actors  

### Article NFT Contract

- One NFT per published article  
- IPFS/Arweave content hashes stored on-chain  
- Metadata includes author, date, and category  

### Content Staking Contract

- Token staking to support or challenge articles  
- Slashing mechanisms for false claims  
- Weighting of influence by reputation  

### Fact-Checker Registry Contract

- Credentialed and community-approved fact-checkers  
- Rating and penalty system for accuracy  
- Staking requirements for participation  

### Dispute Resolution Contract

- Community jury selection  
- Evidence submission and voting  
- Token rewards or penalties for jurors  

### Payment Splitting Contract

- Automatic revenue division among contributors  
- Integration with tipping and ad revenue streams  
- Optional real-time streaming of payments  

### Subscription Manager Contract

- Recurring token-based subscriptions  
- Access control for paid content  
- Personalized feed generation  

### Reputation Engine Contract

- Score adjustments based on performance  
- Influences staking weight and governance power  
- Transparent calculation rules  

### DAO Governance Contract

- Proposal creation and voting  
- Treasury allocation and upgrades  
- Token-weighted voting rights  

## Installation

1. Install Clarinet CLI  
2. Clone this repository  
3. Run tests:  
   ```bash
   npm test
   ```
4. Deploy contracts:
   ```bash
   clarinet deploy
   ```

## Usage

Each contract serves a distinct part of the journalism lifecycle and can be used independently or in concert. Developers and DAO contributors can refer to the contracts/ directory for implementation details and function documentation.

## Testing

Tests are written using Vitest and can be executed via:

    ```bash
   npm test
   ```
Mock environments simulate staking, NFT minting, dispute resolution, and DAO voting.

## License

MIT License