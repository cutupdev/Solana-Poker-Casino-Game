'use client';

import {
  getLeaderboardProgram,
  getLeaderboardProgramId,
} from '../blockchain/src/leaderboard-exports';
import { BN, Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

interface UpdateScoreArgs {
  user: PublicKey;
  score: BN;
}

export function useSolanaPokerQuizProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getLeaderboardProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getLeaderboardProgram(provider);

  const accounts = useQuery({
    queryKey: ['solana-poker-quiz', 'all', { cluster }],
    queryFn: () => program.account.userScore.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const updateScore = useMutation<string, Error, UpdateScoreArgs>({
    mutationKey: ['solana-poker-quiz', 'updateScore', { cluster }],
    mutationFn: async ({ user, score }) => {
      const [userScorePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('user-score'), user.toBuffer()],
        program.programId
      );

      // TODO: Have to deploy on devnet and connect with frontend
      return program.methods
        .updateScore(score)
        .accounts({
          //@ts-ignore
          userScore: userScorePda,
          user: user,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast('Score saved on Solana! - ' + signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    updateScore,
  };
}

/*
export function useSolanaPokerQuizProgramAccount({
  account,
}: {
  account: PublicKey;
}) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useSolanaPokerQuizProgram();

  const accountQuery = useQuery({
    queryKey: ['solana-poker-quiz', 'fetch', { cluster, account }],
    queryFn: () => program.account.solanaPokerQuiz.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ['solana-poker-quiz', 'close', { cluster, account }],
    mutationFn: () =>
      program.methods.close().accounts({ solanaPokerQuiz: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: ['solana-poker-quiz', 'decrement', { cluster, account }],
    mutationFn: () =>
      program.methods.decrement().accounts({ solanaPokerQuiz: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: ['solana-poker-quiz', 'increment', { cluster, account }],
    mutationFn: () =>
      program.methods.increment().accounts({ solanaPokerQuiz: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['solana-poker-quiz', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods.set(value).accounts({ solanaPokerQuiz: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  };
}

*/
