import crypto from 'node:crypto';
import type { Ballot } from './types.ts';

export class QuadraticVotingEngine {
  private readonly creditsPerVoter: number;
  private readonly secretKey: string;
  private voterBalances = new Map<string, number>();
  private proposalTotals = new Map<string, number>();
  private ballots: Ballot[] = [];

  constructor(creditsPerVoter = 100, secretKey = 'ideabank-secret-key') {
    this.creditsPerVoter = creditsPerVoter;
    this.secretKey = secretKey;
  }

  castVotes(voterId: string, votes: Record<string, number>): Ballot {
    // 1. Calcula custo quadrático total: sum(votes^2)
    let totalCost = 0;
    for (const count of Object.values(votes)) {
      if (count < 0) throw new Error('Votos negativos não são permitidos');
      totalCost += count * count;
    }

    const currentSpent = this.voterBalances.get(voterId) ?? 0;
    if (currentSpent + totalCost > this.creditsPerVoter) {
      throw new Error(`Orçamento de créditos excedido: necessário ${currentSpent + totalCost}, disponível ${this.creditsPerVoter}`);
    }

    // 2. Debita e registra totais
    this.voterBalances.set(voterId, currentSpent + totalCost);
    for (const [proposalId, count] of Object.entries(votes)) {
      this.proposalTotals.set(proposalId, (this.proposalTotals.get(proposalId) ?? 0) + count);
    }

    // 3. Gera comprovante HMAC
    const timestamp = Date.now();
    const hmac = crypto.createHmac('sha256', this.secretKey);
    hmac.update(`${voterId}:${JSON.stringify(votes)}:${timestamp}`);
    const receipt = hmac.digest('hex');

    const ballot: Ballot = { voterId, votes, receipt, timestamp };
    this.ballots.push(ballot);
    return ballot;
  }

  getResults(): Record<string, number> {
    const res: Record<string, number> = {};
    for (const [k, v] of this.proposalTotals) {
      res[k] = v;
    }
    return res;
  }

  verifyReceipt(ballot: Ballot): boolean {
    const hmac = crypto.createHmac('sha256', this.secretKey);
    hmac.update(`${ballot.voterId}:${JSON.stringify(ballot.votes)}:${ballot.timestamp}`);
    return hmac.digest('hex') === ballot.receipt;
  }
}
