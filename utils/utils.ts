import {
  Connection,
  Keypair,
  SendOptions,
  Signer,
  TransactionSignature,
  VersionedTransaction,
} from '@solana/web3.js';
import {decode} from 'bs58';

export async function sendSignedTransactions(
  signedTransactions: Array<Uint8Array>,
  minContextSlot: number | undefined,
  connection: Connection,
): Promise<[boolean[], Uint8Array[]]> {
  const valid = signedTransactions.map(_ => true);
  const signatures: (Uint8Array | null)[] = await Promise.all(
    signedTransactions.map(async (byteArray, index) => {
      try {
        const transaction: VersionedTransaction =
          VersionedTransaction.deserialize(byteArray);

        const signature: TransactionSignature =
          await connection.sendTransaction(transaction, {
            minContextSlot: minContextSlot,
            preflightCommitment: 'finalized',
            skipPreflight: true,
          });

        const response = await connection.confirmTransaction(
          signature,
          'confirmed',
        );

        return decode(signature);
      } catch (error) {
        console.log('Failed sending transaction ' + error);
        valid[index] = false;
        return null;
      }
    }),
  );

  return [valid, signatures as Uint8Array[]];
}

export function signTransactionPayloads(
  wallet: Keypair,
  payloads: Uint8Array[],
): [boolean[], Uint8Array[]] {
  const valid = payloads.map(_ => true);

  const signedPayloads = payloads.map((payload, index) => {
    try {
      const transaction: VersionedTransaction =
        VersionedTransaction.deserialize(new Uint8Array(payload));

      transaction.sign([
        {
          publicKey: wallet.publicKey,
          secretKey: wallet.secretKey,
        },
      ]);
      return transaction.serialize();
    } catch (e) {
      console.log('sign error: ' + e);
      valid[index] = false;
      return new Uint8Array([]);
    }
  });

  return [valid, signedPayloads];
}