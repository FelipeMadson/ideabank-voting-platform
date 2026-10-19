import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { QuadraticVotingEngine } from '../src/quadratic.ts';
import { BordaEngine } from '../src/borda.ts';

describe('QuadraticVotingEngine', () => {
  it('aplica custo quadrático e emite comprovante HMAC verificável', () => {
    const qv = new QuadraticVotingEngine(100);
    // 3 votos em P1 (custo 9) + 4 votos em P2 (custo 16) = custo total 25
    const ballot = qv.castVotes('alice', { 'P1': 3, 'P2': 4 });

    assert.ok(ballot.receipt);
    assert.equal(qv.verifyReceipt(ballot), true);

    const totals = qv.getResults();
    assert.equal(totals['P1'], 3);
    assert.equal(totals['P2'], 4);
  });

  it('impede que o eleitor exceda seu limite de créditos', () => {
    const qv = new QuadraticVotingEngine(100);
    // 11 votos em P1 = custo 121 (excede 100)
    assert.throws(
      () => qv.castVotes('bob', { 'P1': 11 }),
      /Orçamento de créditos excedido/
    );
  });
});

describe('BordaEngine', () => {
  it('soma pontos por ordenação preferencial corretamente', () => {
    // 2 eleitores com 3 alternativas: [1º=2pts, 2º=1pt, 3º=0pts]
    const ballots = [
      ['A', 'B', 'C'], // A=2, B=1, C=0
      ['B', 'A', 'C']  // B=2, A=1, C=0
    ];

    const results = BordaEngine.tally(ballots);
    assert.equal(results['A'], 3);
    assert.equal(results['B'], 3);
    assert.equal(results['C'], 0);
  });
});
