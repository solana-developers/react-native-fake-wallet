import {
  Keypair,
  VersionedTransaction,
} from '@solana/web3.js';
import {useState} from 'react';
import {
  MWARequestFailReason,
  SignTransactionsRequest,
  resolve,
} from '../lib/mobile-wallet-adapter-walletlib/src';

import {useWallet} from '../components/WalletProvider';
import {Text, View} from 'react-native';
import AppInfo from '../components/AppInfo';
import ButtonGroup from '../components/ButtonGroup';
import { signTransactionPayloads } from '../utils/utils';


export interface SignTransactionsScreenProps {
  request: SignTransactionsRequest;
}

function SignTransactionsScreen(
  props: SignTransactionsScreenProps,
) {
  const {request} = props;
  const {wallet} = useWallet();
  const [loading, setLoading] = useState(false);

  if (!wallet) {
    throw new Error('Wallet is null or undefined');
  }

  const signTransactions = async (
    wallet: Keypair,
    request: SignTransactionsRequest,
  ) => {
    const [validSignatures, signedPayloads] = signTransactionPayloads(
      wallet,
      request.payloads,
    );

    if (validSignatures.includes(false)) {
      resolve(request, {
        failReason: MWARequestFailReason.InvalidSignatures,
        valid: validSignatures,
      });
      return;
    }

    resolve(request, {signedPayloads});
  };

  const signAllTransactions = async () => {
    if (loading) return;
    setLoading(true);
    try {

      await signTransactions(wallet, request);
    } catch (e) {
      const valid = request.payloads.map(() => false);
      resolve(request, {
        failReason: MWARequestFailReason.InvalidSignatures,
        valid,
      });
    } finally {
      setLoading(false);
    }
  };

  const reject = () => {
    resolve(request, {failReason: MWARequestFailReason.UserDeclined});
  };

  return (
    <View>
      <AppInfo
        title="Sign Transactions"
        appName={request.appIdentity?.identityName}
        cluster={request.cluster}
        scope={'app'}
      />
      <Text>Payloads</Text>
      <Text>
        This request has {request.payloads.length}{' '}
        {request.payloads.length > 1 ? 'payloads' : 'payload'} to sign.
      </Text>
      <ButtonGroup
        positiveButtonText="Sign All"
        negativeButtonText="Reject"
        positiveOnClick={signAllTransactions}
        negativeOnClick={reject}
      />
      {loading && <Text>Loading...</Text>}
    </View>
  );
}

export default SignTransactionsScreen;
