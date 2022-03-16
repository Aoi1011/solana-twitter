import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolanaTwitter } from "../target/types/solana_twitter";
import * as assert from "assert";

describe("solana-twitter", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  // @ts-ignore
  const program = anchor.workspace.SolanaTwitter as Program<SolanaTwitter>;

  it("can send a new tweet!", async () => {
    // Before sending the transaction to the blockchain.
    const tweetKeypair = anchor.web3.Keypair.generate();
    await program.rpc.sendTweet("Hello", "Hello, World!", {
      accounts: {
        tweet: tweetKeypair.publicKey,
        author: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [tweetKeypair],
    });

    // After sending the transaction to the blockchain.
    // Fetch the account details of the created tweet.
    const tweetAccount = await program.account.tweet.fetch(
      tweetKeypair.publicKey
    );

    // Ensure it has the right data.
    assert.equal(
      tweetAccount.author.toBase58(),
      program.provider.wallet.publicKey.toBase58()
    );
    assert.equal(tweetAccount.topic, "Hello");
    assert.equal(tweetAccount.content, "Hello, World!");
    assert.ok(tweetAccount.timestamp);
  });
});
