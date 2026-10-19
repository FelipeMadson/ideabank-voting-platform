# IdeaBank Voting Platform

Cryptographically verifiable decision engine combining Borda Count preferential ranking and Quadratic Voting for decentralized open-source feature prioritization, issue ranking, and community governance.

[![CI](https://github.com/FelipeMadson/ideabank-voting-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/FelipeMadson/ideabank-voting-platform/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

*Read this in [Português](README.pt-BR.md).*

---

## Algorithmic Foundations

- **Borda Count Ranking**: Assigns proportional scores to ordinal preferences preventing tyrannical plurality biases.
- **Quadratic Voting (QV)**: Allows participants to express preference intensity using voice credits, where $n$ votes cost $n^2$ credits.
- **HMAC Receipt Verification**: Issues tamper-evident cryptographic receipts for every cast ballot to enable independent post-vote verification.

---

## Usage Example

```typescript
import { QuadraticVotingEngine, BordaEngine } from './src/index.ts';

// 1. Quadratic Voting
const qv = new QuadraticVotingEngine(100); // 100 credits per voter
qv.castVotes('voter_1', 'feature_dark_mode', 3); // costs 9 credits
qv.castVotes('voter_1', 'feature_offline', 5);   // costs 25 credits

const tally = qv.getResults();
```

## License

MIT © [Felipe Madson](https://github.com/FelipeMadson)
