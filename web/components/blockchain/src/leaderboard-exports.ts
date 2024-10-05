// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import LeaderboardIDL from '../target/idl/poksol_leaderboard.json';
import type { PoksolLeaderboard } from '../target/types/poksol_leaderboard';

// Re-export the generated IDL and type
export { PoksolLeaderboard, LeaderboardIDL };

// The programId is imported from the program IDL.
export const WAGER_PROGRAM_ID = new PublicKey(LeaderboardIDL.address);

// This is a helper function to get the Counter Anchor program.
export function getLeaderboardProgram(provider: AnchorProvider) {
  return new Program(LeaderboardIDL as PoksolLeaderboard, provider);
}

// This is a helper function to get the program ID for the Counter program depending on the cluster.
export function getLeaderboardProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Counter program on devnet and testnet.
      return new PublicKey('2rT5faxcrTnWXE125tWzzje9PFHt3k4C3VUjhNfQuzvY');
    case 'mainnet-beta':
    default:
      return WAGER_PROGRAM_ID;
  }
}
