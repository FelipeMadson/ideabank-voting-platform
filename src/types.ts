export interface Ballot {
  voterId: string;
  votes: Record<string, number>;
  receipt: string;
  timestamp: number;
}
