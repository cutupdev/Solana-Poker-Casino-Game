import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PoksolLeaderboard } from "../target/types/poksol_leaderboard";
import { expect } from "chai";

describe("poksol-leaderboard", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.PoksolLeaderboard as Program<PoksolLeaderboard>;
  const provider = anchor.getProvider() as anchor.AnchorProvider;

  it("Initializes the program", async () => {
    // const tx = await program.methods.initialize().rpc();
    // console.log("Initialization transaction signature", tx);
  });

  it("Updates scores for 3 users", async () => {
    const users = await Promise.all(
      Array(3).fill(0).map(async (_, i) => {
        const user = anchor.web3.Keypair.generate();
        const signature = await provider.connection.requestAirdrop(user.publicKey, 100 * anchor.web3.LAMPORTS_PER_SOL);
        await provider.connection.confirmTransaction(signature, "confirmed");
        return user;
      })
    );

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const score = (i + 1) * 100; // Different score for each user

      const [userScorePda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("user-score"), user.publicKey.toBuffer()],
        program.programId
      );

      try {
        const tx = await program.methods
          .updateScore(new anchor.BN(score))
          .accounts({
            userScore: userScorePda,
            user: user.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([user])
          .rpc();

        console.log(`Score update transaction for user ${i + 1}:`, tx);

        // Fetch the account and verify the score
        const userScoreAccount = await program.account.userScore.fetch(userScorePda);
        expect(userScoreAccount.user.toString()).to.equal(user.publicKey.toString());
        expect(userScoreAccount.score.toNumber()).to.equal(score);
      } catch (error) {
        console.error(`Error updating score for user ${i + 1}:`, error);
        throw error;
      }
    }
  });

  it("Updates scores for 3 users again", async () => {
    const users = await Promise.all(
      Array(3).fill(0).map(async (_, i) => {
        const user = anchor.web3.Keypair.generate();
        const signature = await provider.connection.requestAirdrop(user.publicKey, 100 * anchor.web3.LAMPORTS_PER_SOL);
        await provider.connection.confirmTransaction(signature, "confirmed");
        return user;
      })
    );

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const score = (i + 1) * 49; // Different score for each user

      const [userScorePda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("user-score"), user.publicKey.toBuffer()],
        program.programId
      );

      try {
        const tx = await program.methods
          .updateScore(new anchor.BN(score))
          .accounts({
            userScore: userScorePda,
            user: user.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([user])
          .rpc();

        console.log(`Score update transaction for user ${i + 1}:`, tx);

        // Fetch the account and verify the score
        const userScoreAccount = await program.account.userScore.fetch(userScorePda);
        expect(userScoreAccount.user.toString()).to.equal(user.publicKey.toString());
        expect(userScoreAccount.score.toNumber()).to.equal(score);
      } catch (error) {
        console.error(`Error updating score for user ${i + 1}:`, error);
        throw error;
      }
    }
  });
});