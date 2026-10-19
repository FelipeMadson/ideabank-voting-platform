export class BordaEngine {
  static tally(preferencesList: string[][]): Record<string, number> {
    const scores: Record<string, number> = {};

    for (const pref of preferencesList) {
      const n = pref.length;
      pref.forEach((candidate, idx) => {
        const points = n - idx - 1;
        scores[candidate] = (scores[candidate] ?? 0) + points;
      });
    }

    return scores;
  }
}
