# MWA Deep Dive

# Repo

[https://github.com/Unboxed-Software/solana-rn-fake-wallet.git](https://github.com/Unboxed-Software/solana-rn-fake-wallet.git)

# Lesson

---
title: MWA Deep Dive
objectives:
- Explain the...
- Explain how...
- Use...
---

# TL;DR

- …
- ….
- …

# Overview

## What is MWA

### How does a normal wallet work?

- an abstraction for the following Keypair functions: `sign message`, `sign transaction`, etc…
- The jist: Wallet browser stores keypair safely, follows the api standard for the above functions, returns signed messages and transactions
- But what happens if we want to use mobile native wallets…
    
    Describe a scenario in which we want to use mobile wallets and how normal wallets won’t be a feasible choice for this scenario.
    
    Enter MWA!
    

### How MWA is different

- A short paragraph on how MWA uses a entrypoint component. All requests have to go through this entrypoint component.
- A short para on how we can interact with session updates through emits.
- A short para on extra functions provided by the MWA in addition to base keypair functions.  Examples include authorize, deauthorize, getCapabilities, cloneAuthorization, etc.

### Caveats

- A note regarding this package still being in alpha and not production ready, but has a stable API

## Operations

List of all the operations supported by MWA and breakdown of those operations in the following manner.

### Non-privileged Methods

- Authorize
    - Explanation
    - Link to the spec doc
- Reauthorize
    - Explanation
    - Link to the spec doc
- Deauthorize
    - Explanation
    - Link to the spec doc
- Get Capabilities
    - Explanation
    - Link to the spec doc

### Privileged Methods

- Sign Transactions
    - Explanation
    - Link to the spec doc
- Sign and Send Transactions
    - Explanation
    - Link to the spec doc
- Sign messages
    - Explanation
    - Link to the spec doc
- Clone Authorization
    - Explanation
    - Link to the spec doc

## Illustrations

### Authorizing a Dapp

The diagram from the spec doc and link to the spec doc.

### Authorizing and Sign Transaction

The diagram from the spec doc and link to the spec doc.

### Reauthorizing and Sign Transaction

The diagram from the spec doc and link to the spec doc.

## Implementing MWA Component

### Dependencies

```bash
#provide the npm command to install solana-web3 and MWA dependencies
```

### What is a MWA Component

Explain how MWA Component is a react component and how it is called using the `solana-wallet://` endpoint and how it will determine which UI to render based on the request initiated by the requesting Dapp.

**Dapp Identity Verification:**

Explain what is Dapp Identity

Explain `solana-wallet://` as a wallet endpoint and all wallets associated with solana respond to requests which call this endpoint. That’s how one gets to choose a wallet if the user has multiple supported wallets installed. 

Explain how this component will be rendered when an intent for `solana-wallet://` is sent.

### Creating Entrypoint

Explain that entrypoint simply means a react component which will be shown to user when he selects our fake wallet app to do any operation.

```tsx
//Creation of the MWAComponent and registering it in the AppRegistry
```

### Listening and Handling Requests

Explain the `useMobileWalletAdapterSession` hook and how it allows us to capture session event emits.

### Storing session and current request

```tsx
//show session and request handler method pseudo code
```

### Handling Authorization Request

```tsx
//show pseudo code switching on request type and returning auth component
```

### Handling Sign and Send Transaction Request

```tsx
//show pseudo code switching on request type and returning sign and send transaction
//component
```

### Handling Sign Transaction/Sign Messages Request

```tsx
//show pseudo code switching on request type and returning signing component
```

## Conclusion

# Demo

### 0. Prerequisites

Before we actually start programming our wallet we need to do some setup. You will need a React Native developer environment and a Solana dApp to test on. If you have completed the [Basic Solana Mobile lesson](), both of these requirements should be met with the counter app installed on your android device/emulator.

If you *haven't* completed the last lesson you will need to:

1. Setup an [Android React Native developer environment](https://reactnative.dev/docs/environment-setup) with a device or emulator
2. Install a [Devnet Solana dApp](https://github.com/Unboxed-Software/solana-react-native-counter.git)


If you want to install the app from the previous lesson, you can:

```bash
git clone https://github.com/Unboxed-Software/solana-react-native-counter.git
cd solana-react-native-counter
git checkout solution
npm i
npm run install
```

### 1. Plan out App Structure

-- Wallet First
- Wallet Provider
- MainScreen
- App.tsx

-- Popup Pt 1 ( Getting it to Work )
- MWAApp.tsx
- index.js

-- Popup Pt 2 ( Implementing Others )
- clientTrust.ts

-- Popup Pt 3 ( All Else )
- dapp.ts
- Authorize
- SignAndSend

### 2. Create the App

Let's create the app with:
```bash
npx react-native@latest init wallet --npm
cd wallet
```

Now, let's install our dependancies. These are the exact same dependancies from our [Basic Solana Mobile lesson](), with two additions: `@react-native-async-storage/async-storage`, and a polyfill: `fast-text-encoding`.

We will be using `async-storage` to store our Keypair so that the wallet will stay persistent through multiple sessions. It is important to note `async-storage` is ***NOT*** a safe place to keep your keys, do not use this in production. Instead, take a look at [Android's keystore system.](https://developer.android.com/privacy-and-security/keystore)

Install the dependancies with:
```bash
npm install \
  @solana/web3.js \
  @solana-mobile/mobile-wallet-adapter-protocol-web3js \
  @solana-mobile/mobile-wallet-adapter-protocol \
  react-native-get-random-values \
  buffer \
  @coral-xyz/anchor \
  assert \
  bs58 \
  @react-native-async-storage/async-storage \
  fast-text-encoding
```

The next step is a bit messy. We need to depend on Solana's `mobile-wallet-adapter-walletlib` package, which handles all of the low-level communication. However, this package is still in development and is not available through npm. From their github:

>This package is still in alpha and is not production ready. However, the API is stable and will not change drastically, so you can begin integration with your wallet.

However, we have extracted the package and made it available via github. If you're interested how that was done, take a look at the README of our edited version of the [walletlib](https://github.com/Unboxed-Software/mobile-wallet-adapter-walletlib)

Let's install the package in a new folder `lib`:
```bash
mkdir lib
cd lib
git clone https://github.com/Unboxed-Software/mobile-wallet-adapter-walletlib.git
```

We have to manually link the walletlib. Add `@solana-mobile/mobile-wallet-adapter-walletlib` to our `package.json` dependancies with the filepath as the resolution:
```json
"dependencies": {
    "@solana-mobile/mobile-wallet-adapter-walletlib": "file:./lib/mobile-wallet-adapter-walletlib",
}
```

Lastly, in `android/build.gradle`, change the `minSdkVersion` to version `23`.
```gradle
  minSdkVersion = 23
```

Finish setup off with installing the packages and building the app. You should get the default React Native app showing up on your device.
```bash
npm i
npm run android
```

If you get any errors make sure you double check you've followed all of the steps above.

### 3. Wallet App
The first part of our wallet app is the actual app part, it will do the following:

- Generate a `Keypair` on first load
- Display the address and balance
- Allow users to airdrop some Devnet sol to their wallet

This can all be accomplished in two additional files:

`WalletProvider.tsx` - Generates a Keypair and stores it in `async-storage` and fetches the Keypair on subsequent sessions. It also provides the Solana `Connection`.

`MainScreen.tsx` - Shows the wallet, it's balance and an airdrop button.

Let's start with the `WalletProvider.tsx`. This file will use `async-storage` to store a base58 encoded version of a `Keypair`. The provider will check the storage key of `@my_fake_wallet_keypair_key`, if nothing returns, then the provider should generate and store a keypair. The `WalletProvider` will then return it's context including the `wallet` and `connection`, so the rest of the app can access it using `useWallet()`.

***AGAIN*** async storage is not fit to store private keys in production. Please use something like [Android's keystore system.](https://developer.android.com/privacy-and-security/keystore)

Let's create the `WalletProvider.tsx` within a new directory `components`:
```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Connection, Keypair} from '@solana/web3.js';
import {encode, decode} from 'bs58';
import {ReactNode, createContext, useContext, useEffect, useState} from 'react';

const ASYNC_STORAGE_KEY = '@my_fake_wallet_keypair_key';

interface EncodedKeypair {
  publicKeyBase58: string;
  secretKeyBase58: string;
};


function encodeKeypair(keypair: Keypair): EncodedKeypair {
  return {
    publicKeyBase58: keypair.publicKey.toBase58(),
    secretKeyBase58: encode(keypair.secretKey),
  };
};

function decodeKeypair(encodedKeypair: EncodedKeypair): Keypair {
  const secretKey = decode(encodedKeypair.secretKeyBase58);
  return Keypair.fromSecretKey(secretKey);
};

export interface WalletContextData {
  wallet: Keypair | null;
  connection: Connection;
};

const WalletContext = createContext<WalletContextData>({
  wallet: null,
  connection: new Connection('https://api.devnet.solana.com'),
});

export const useWallet = () => useContext(WalletContext);

export interface WalletProviderProps {
  rpcUrl?: string;
  children: ReactNode;
}

export function WalletProvider(props: WalletProviderProps){
  const { rpcUrl, children } = props;
  const [keyPair, setKeyPair] = useState<Keypair | null>(null);

  const fetchOrGenerateKeypair = async () => {
    try {
      const storedKey = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
      let keyPair;
      if (storedKey && storedKey !== null) {
        const encodedKeypair: EncodedKeypair = JSON.parse(storedKey);
        keyPair = decodeKeypair(encodedKeypair);
      } else {
        // Generate a new random pair of keys and store them in local storage for later retrieval
        // This is not secure! Async storage is used for demo purpose. Never store keys like this!
        keyPair = await Keypair.generate();
        await AsyncStorage.setItem(
          ASYNC_STORAGE_KEY,
          JSON.stringify(encodeKeypair(keyPair)),
        );
      }
      setKeyPair(keyPair);
    } catch (e) {
      console.log('error getting keypair: ', e);
    }
  };

  useEffect(() => {
    fetchOrGenerateKeypair();
  }, []);

  const value = {
    wallet: keyPair,
    connection: new Connection(rpcUrl ?? 'https://api.devnet.solana.com'),
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
```

Note that we are defaulting our `rpcUrl` to Devnet.

Now let's make the `MainScreen.tsx`. It's pretty simple, it grabs the `wallet` and `connection` from `useWallet()`, and then shows the address and balance. Additionally, since all transactions cost sol, we'll also include an airdrop button.

Create a new directory `screens` and place `MainScreen.tsx` within in:
```tsx
import {Button, StyleSheet, Text, View} from 'react-native';
import {useWallet} from '../components/WalletProvider';
import {useEffect, useState} from 'react';
import {LAMPORTS_PER_SOL} from '@solana/web3.js';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center', // Centers children along the main axis (vertically for column)
    alignItems: 'center', // Centers children along the cross axis (horizontally for column)
  },
});

function MainScreen(){
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<null | number>(null);
  const {wallet, connection} = useWallet();

  useEffect(() => {
    updateBalance();
  }, [wallet]);

  const updateBalance = async () => {
    if (wallet) {
      await connection.getBalance(wallet.publicKey).then(lamports => {
        setBalance(lamports / LAMPORTS_PER_SOL);
      });
    }
  };

  const airdrop = async () => {
    if (wallet && !isLoading) {
      setIsLoading(true);
      try {
        const signature = await connection.requestAirdrop(
          wallet.publicKey,
          LAMPORTS_PER_SOL,
        );
        await connection.confirmTransaction(signature, 'max');
        await updateBalance();
      } catch (e) {
        console.log(e);
      }

      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Wallet:</Text>
      <Text>{wallet?.publicKey.toString() ?? 'No Wallet'}</Text>
      <Text>Balance:</Text>
      <Text>{balance?.toFixed(5) ?? ''}</Text>
      {isLoading && <Text>Loading...</Text>}
      {balance != null && !isLoading && balance < 0.005 && (
        <Button title="Airdrop 1 SOL" onPress={airdrop} />
      )}
    </View>
  );
};

export default MainScreen;
```

Lastly, let's edit the `App.tsx` file to complete the 'app' section of our wallet:
```tsx
import {SafeAreaView, Text, View} from 'react-native';
import MainScreen from './screens/MainScreen';
import 'react-native-get-random-values';
import { WalletProvider } from './components/WalletProvider';
import React from 'react';

function App(): JSX.Element {
  return (
      <SafeAreaView>
        <WalletProvider>
          <MainScreen />
        </WalletProvider>
      </SafeAreaView>
  );
}

export default App;
```

Make sure everything is working by building and deploying:
```bash
npm run android
```

### Barebones MWA App
The Mobile Wallet Adapter (MWA) 'app' is what is seen when a Solana dApp sends out an intent for `solana-wallet://`. Our MWA app will listen for this, establish a connection and render this app. Fortunately, we don't have to implement anything low-level. Solana has done the hard work for us in the `mobile-wallet-adapter-walletlib` library. All we have to do is create the view and handle the requests! If you want to know more about how the connection is made, you can take a [look at the spec](https://github.com/solana-mobile/mobile-wallet-adapter/blob/main/spec/spec.md). 

Let's start out with the absolute bare bones of of the MWA app. All it will do is pop up when a dApp connects to it and simply say 'I'm a wallet'.

To make this pop up when a Solana dApp requests access, we'll need the `useMobileWalletAdapterSession` from the walletlib. This requires a four things:

- `walletName` - name of the wallet
- `config` - some simple wallet configurations of type `MobileWalletAdapterConfig`
- `handleRequest` - callback function to handle requests from the dApp
- `handleSessionEvent` - callback function to handle session events

Here is an example of the minimum setup to satisfy `useMobileWalletAdapterSession`:
```tsx
  const config: MobileWalletAdapterConfig = useMemo(() => {
    return {
      supportsSignAndSendTransactions: true,
      maxTransactionsPerSigningRequest: 10,
      maxMessagesPerSigningRequest: 10,
      supportedTransactionVersions: [0, 'legacy'],
      noConnectionWarningTimeoutMs: 3000,
    };
  }, []);

  const handleRequest = useCallback((request: MWARequest) => {
  }, []);

  const handleSessionEvent = useCallback((sessionEvent: MWASessionEvent) => {
  }, []);

  useMobileWalletAdapterSession(
    'React Native Fake Wallet',
    config,
    handleRequest,
    handleSessionEvent,
  );
```

We will be implementing function into `handleRequest` and `handleSessionEvent` soon, but first let's make the MWA app work.

Create a new file in the root of your project `MWAApp.tsx`:
```tsx
import {useCallback, useMemo } from 'react';
import { SafeAreaView, StyleSheet, Text, View} from 'react-native';
import { WalletProvider } from './components/WalletProvider';
import { MWARequest, MWASessionEvent, MobileWalletAdapterConfig, useMobileWalletAdapterSession } from './lib/mobile-wallet-adapter-walletlib/src';


const styles = StyleSheet.create({
  container: {
    margin: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: 'black',
  },
});

function MWAApp(){

  const config: MobileWalletAdapterConfig = useMemo(() => {
    return {
      supportsSignAndSendTransactions: true,
      maxTransactionsPerSigningRequest: 10,
      maxMessagesPerSigningRequest: 10,
      supportedTransactionVersions: [0, 'legacy'],
      noConnectionWarningTimeoutMs: 3000,
    };
  }, []);

  const handleRequest = useCallback((request: MWARequest) => {
  }, []);

  const handleSessionEvent = useCallback((sessionEvent: MWASessionEvent) => {
  }, []);

  useMobileWalletAdapterSession(
    'React Native Fake Wallet',
    config,
    handleRequest,
    handleSessionEvent,
  );

  
  return (
    <SafeAreaView>
        <WalletProvider>
            <View style={styles.container}>
                <Text style={{fontSize: 50}}>I'm a wallet!</Text>
            </View>
        </WalletProvider>
    </SafeAreaView>
  );
};

export default MWAApp;
```

The last thing we need to do is to register our MWA app as an entrypoint in `index.js` under the name `MobileWalletAdapterEntrypoint`.

Change `index.js` to reflect the following:
```js
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import MWAApp from './MWAApp'

// Mock event listener functions to prevent them from fataling.
window.addEventListener = () => {};
window.removeEventListener = () => {};

AppRegistry.registerComponent(appName, () => App);

// Register the MWA component
AppRegistry.registerComponent(
'MobileWalletAdapterEntrypoint',
  () => MWAApp,
);
```

Let's now test this out. 

Build and deploy it:
```bash
npm run android
```

Open your Devnet Solana dApp, ideally the `counter` app from the previous lesson. Then make a request.

You should get a bottom drawer that says `Im a wallet`.

### Setup MWA App
Let's flesh out our `MWAApp.tsx`. We have the bare bones working, but now let's handle two different types of requests `authorize` and `signAndSendTransaction`.

We are adding a couple things in this new revision of our `MWAApp.tsx`:

1. Save the `currentRequest` and `currentSession` in a `useState`. This will allow us to track the life cycle of a connection.
2. Add a `hardwareBackPress` listener to gracefully handle closing out the MWA app.
3. Listen for a `SessionTerminatedEvent` to close out the MWA app.
4. Render appropriate content for the different types of requests with `renderRequest()`

Change your `MWAApp.tsx` to reflect the following:
```tsx
import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  BackHandler,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {WalletProvider} from './components/WalletProvider';
import {
  AuthorizeDappRequest,
  MWARequest,
  MWARequestFailReason,
  MWARequestType,
  MWASessionEvent,
  MWASessionEventType,
  MobileWalletAdapterConfig,
  ReauthorizeDappCompleteResponse,
  ReauthorizeDappResponse,
  SignAndSendTransactionsRequest,
  getCallingPackage,
  resolve,
  useMobileWalletAdapterSession,
} from './lib/mobile-wallet-adapter-walletlib/src';

const styles = StyleSheet.create({
  container: {
    margin: 0,
    width: '100%',
    backgroundColor: 'black',
    color: 'black',
  },
});

function MWAApp() {
  const [currentRequest, setCurrentRequest] = useState<MWARequest | null>(null);
  const [currentSession, setCurrentSession] = useState<MWASessionEvent | null>(
    null,
  );
  // ------------------- FUNCTIONS --------------------

  const endWalletSession = useCallback(() => {
    setTimeout(() => {
      BackHandler.exitApp();
    }, 200);
  }, []);

  const handleRequest = useCallback((request: MWARequest) => {
    setCurrentRequest(request);
  }, []);

  const handleSessionEvent = useCallback((sessionEvent: MWASessionEvent) => {
    setCurrentSession(sessionEvent);
  }, []);

  // ------------------- EFFECTS --------------------

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      resolve(currentRequest as any, {
        failReason: MWARequestFailReason.UserDeclined,
      });
      return false;
    });
  }, []);

  useEffect(() => {
    if (currentSession?.__type == MWASessionEventType.SessionTerminatedEvent) {
      endWalletSession();
    }
  }, [currentSession]);

  useEffect(() => {
    if (!currentRequest) {
      return;
    }

    if (currentRequest.__type == MWARequestType.ReauthorizeDappRequest) {
      resolve(currentRequest, {
        authorizationScope: new TextEncoder().encode('app'),
      });
    }

  }, [currentRequest, endWalletSession]);

  // ------------------- MWA --------------------

  const config: MobileWalletAdapterConfig = useMemo(() => {
    return {
      supportsSignAndSendTransactions: true,
      maxTransactionsPerSigningRequest: 10,
      maxMessagesPerSigningRequest: 10,
      supportedTransactionVersions: [0, 'legacy'],
      noConnectionWarningTimeoutMs: 3000,
    };
  }, []);

  useMobileWalletAdapterSession(
    'React Native Fake Wallet',
    config,
    handleRequest,
    handleSessionEvent,
  );

  // ------------------- RENDER --------------------

  const renderRequest = () => {
    if (!currentRequest) {
      return <Text>No request</Text>;
    }
  
  
    switch (currentRequest?.__type) {
      case MWARequestType.AuthorizeDappRequest:
      case MWARequestType.SignAndSendTransactionsRequest:
      case MWARequestType.SignMessagesRequest:
      case MWARequestType.SignTransactionsRequest:
      default:
        return <Text>TODO Show screen for {currentRequest?.__type}</Text>;
    }
  }

  // ------------------- RENDER --------------------

  return (
    <SafeAreaView>
      <WalletProvider>
        <View style={styles.container}>
          <Text>REQUEST: {currentRequest?.__type.toString()}</Text>
          {renderRequest()}
        </View>
      </WalletProvider>
    </SafeAreaView>
  );
}

export default MWAApp;
```

Note that `renderRequest` is not actually rendering anything useful yet. We still need to actually *handle* the different requests.

### Extra Components
Lets take a little detour and create some nice helper UI components. Simply, we will define a format for some text with `AppInfo.tsx` and some buttons in `ButtonGroup.tsx`.

`AppInfo.tsx` will show us all relevant information coming from the dApp:

```ts
  interface AppInfoProps {
    iconSource?: any; 
    title?: string;
    cluster?: string;
    appName?: string;
    uri?: string;
    scope?: string;
  }
```

Create `components/AppInfo.tsx`:
```tsx
import {Text, View} from 'react-native';

interface AppInfoProps {
  title?: string;
  cluster?: string;
  appName?: string;
  scope?: string;
}

function AppInfo(props: AppInfoProps) {
  const {title, cluster, appName, scope} =
    props;
  return (
    <>
      <Text>{title}</Text>
      <View>
        <Text>Request Metadata</Text>
        <Text>Cluster: {cluster ? cluster : 'NA'}</Text>
        <Text>App name: {appName ? appName : 'NA'}</Text>
        <Text>Scope: {scope ? scope : 'NA'}</Text>
      </View>
    </>
  );
}

export default AppInfo;
```

Now, let's create a component that groups an accept and reject button together.

Create `components/ButtonGroup.tsx`
```tsx
import {Button, Dimensions, StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  button: {flex: 1, marginHorizontal: 8},
  buttonGroup: {
    width: Dimensions.get('window').width,
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 16,
  },
});

interface ButtonGroupProps {
  positiveOnClick: () => any;
  negativeOnClick: () => any;
  positiveButtonText: string;
  negativeButtonText: string;
}
const ButtonGroup = (props: ButtonGroupProps) => {
  return (
    <View style={styles.buttonGroup}>
      <Button
        onPress={props.positiveOnClick}
        title={props.positiveButtonText}
      />
      <Button
        onPress={props.negativeOnClick}
        title={props.negativeButtonText}
      />
    </View>
  );
};

export default ButtonGroup;
```

### Authorize Screen
Let's put together our first screen to handle new authorizations. It's only job is to show what app want's authorization, and allow the user to accept or deny the request using the `resolve` function from the walletlib.

We'll use our `AppInfo` and `ButtonGroup` to compose our entire UI here. All we have to do is plug in the right information, and write the logic for accepting and rejecting the request.

The `resolve` function takes two arguments `request` and `response`, as you can imagine, this will respond to the calling app with the correct information. However, the `resolve` function acts differently by the different types of `request`. So we have to make sure to provide the correct parameters to the function depending on our situation.

All of the types of `resolve` from `resolve.ts` within the walletlib library.
```ts
export function resolve(request: AuthorizeDappRequest, response: AuthorizeDappResponse): void;
export function resolve(request: ReauthorizeDappRequest, response: ReauthorizeDappResponse): void;
export function resolve(request: DeauthorizeDappRequest, response: DeauthorizeDappResponse): void;
export function resolve(request: SignMessagesRequest, response: SignMessagesResponse): void;
export function resolve(request: SignTransactionsRequest, response: SignTransactionsResponse): void;
export function resolve(request: SignAndSendTransactionsRequest, response: SignAndSendTransactionsResponse): void;
export function resolve(request: MWARequest, response: MWAResponse): void {
    SolanaMobileWalletAdapterWalletLib.resolve(JSON.stringify(request), JSON.stringify(response));
}
```

So for authorization, we will use the `AuthorizeDappRequest` and `AuthorizeDappResponse` combo. `AuthorizeDappResponse` is a union of two more types `AuthorizeDappCompleteResponse` and `UserDeclinedResponse`. This is exactly what we have to resolve for our `authorize` and `reject` functions.

```ts
export type AuthorizeDappResponse = AuthorizeDappCompleteResponse | UserDeclinedResponse;

export type AuthorizeDappCompleteResponse = Readonly<{
    publicKey: Uint8Array;
    accountLabel?: string;
    walletUriBase?: string;
    authorizationScope?: Uint8Array;
}>;

export type UserDeclinedResponse = Readonly<{
    failReason: MWARequestFailReason.UserDeclined;
}>;
```

Now that we have all that context, we can put everything together in a new file `screens/AuthorizeDappRequestScreen.tsx`:
```tsx
import 'fast-text-encoding';
import React from "react";
import { useWallet } from "../components/WalletProvider";
import { AuthorizeDappCompleteResponse, AuthorizeDappRequest, MWARequestFailReason, resolve } from "../lib/mobile-wallet-adapter-walletlib/src";
import AppInfo from "../components/AppInfo";
import ButtonGroup from "../components/ButtonGroup";
import { Text, View } from "react-native";

export interface AuthorizeDappRequestScreenProps {
  request: AuthorizeDappRequest;
}

function AuthorizeDappRequestScreen(props: AuthorizeDappRequestScreenProps){
  const { request } = props;
  const { wallet } = useWallet();

  if(!wallet){
    throw new Error('No wallet found')
  }


  const authorize = () => {
    resolve(request, {
      publicKey: wallet?.publicKey.toBytes(),
      authorizationScope: new TextEncoder().encode("app"),
    } as AuthorizeDappCompleteResponse);
  }

  const reject = () => { 
    resolve(request, {
      failReason: MWARequestFailReason.UserDeclined,
    });
  }


  return (
    <View >
      <AppInfo
        title="Authorize Dapp"
        appName={request.appIdentity?.identityName}
        cluster={request.cluster}
        scope={"app"}
      />

      <ButtonGroup
        positiveButtonText="Authorize"
        negativeButtonText="Decline"
        positiveOnClick={authorize}
        negativeOnClick={reject}
      />
    </View>
  );
};

export default AuthorizeDappRequestScreen;
```

Now let's update our `MWAApp.tsx` to handle this situation by adding to our `renderRequest` switch statement:
```tsx
    switch (currentRequest?.__type) {
      case MWARequestType.AuthorizeDappRequest:
        return <AuthorizeDappRequestScreen request={currentRequest as AuthorizeDappRequest} />;
      case MWARequestType.SignAndSendTransactionsRequest:
      case MWARequestType.SignMessagesRequest:
      case MWARequestType.SignTransactionsRequest:
      default:
        return <Text>TODO Show screen for {currentRequest?.__type}</Text>;
    }
```

Feel free to build and run the wallet again. When you first interact with another Solana app, our new authorization screen will now appear.

// IMAGE of Authorization Screen

### Sign and Send Screen
Let's finish up our wallet app with the sign and send screen. Here, we need to grab the transactions from the `request`, sign them with our privatekey and then send them to an rpc.

For the UI, it will look very similar to our authorization page, some info about the app with `AppInfo` and some buttons with `ButtonGroup`. This time, we will fulfill the `SignAndSendTransactionsRequest` and `SignAndSendTransactionsResponse` for our `resolve` function.

```ts
export function resolve(request: SignAndSendTransactionsRequest, response: SignAndSendTransactionsResponse): void;
```

More specifically, we'll have to adhear to what `SignAndSendTransactionsResponse` is unioned with.
```ts
export type SignAndSendTransactionsResponse =
    | SignAndSendTransactionsCompleteResponse
    | UserDeclinedResponse
    | TooManyPayloadsResponse
    | AuthorizationNotValidResponse
    | InvalidSignaturesResponse;
```

We are only going to cover the `SignAndSendTransactionsCompleteResponse`,`InvalidSignaturesResponse` and `UserDeclinedResponse`.

Most notably, we'll have to adhere to `InvalidSignaturesResponse`:
```ts
export type InvalidSignaturesResponse = Readonly<{
    failReason: MWARequestFailReason.InvalidSignatures;
    valid: boolean[];
}>;
```

The `InvalidSignaturesResponse` is unique, because it requires an array of booleans, which correspond to which transactions failed. So we'll have to keep track of that.

As for signing and sending, we'll have to do some work. Since we are sending transactions over sockets, the transaction data is serialized into bytes. So, we'll have grab, deserialize and sign our transactions. 

We can do this in two functions:
-`signTransactionPayloads`, returns the signed transactions along with a 1-to-1 `valid` boolean array. We'll check that to see if a signature has failed.
-`sendSignedTransactions`, takes the signed transactions and sends them out to the rpc. Similarly, it keeps an array of `valid` booleans to know which transactions failed.

Let's put that all together in a new file `screens/SignAndSendTransactionScreen.tsx`:
```tsx
import {
  Connection,
  Keypair,
  SendOptions,
  TransactionSignature,
  VersionedTransaction,
} from '@solana/web3.js';
import {useState} from 'react';
import {
  MWARequestFailReason,
  SignAndSendTransactionsRequest,
  resolve,
} from '../lib/mobile-wallet-adapter-walletlib/src';

import {useWallet} from '../components/WalletProvider';
import {Text, View} from 'react-native';
import AppInfo from '../components/AppInfo';
import ButtonGroup from '../components/ButtonGroup';
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

export interface SignAndSendTransactionScreenProps {
  request: SignAndSendTransactionsRequest;
}

function SignAndSendTransactionScreen(
  props: SignAndSendTransactionScreenProps,
) {
  const {request} = props;
  const {wallet, connection} = useWallet();
  const [loading, setLoading] = useState(false);

  if (!wallet) {
    throw new Error('Wallet is null or undefined');
  }

  const signAndSendTransaction = async (
    wallet: Keypair,
    connection: Connection,
    request: SignAndSendTransactionsRequest,
  ) => {
    const [validSignatures, signedTransactions] = signTransactionPayloads(
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

    const [validTransactions, transactionSignatures] =
      await sendSignedTransactions(
        signedTransactions,
        request.minContextSlot ? request.minContextSlot : undefined,
        connection,
      );

    if (validTransactions.includes(false)) {
      resolve(request, {
        failReason: MWARequestFailReason.InvalidSignatures,
        valid: validTransactions,
      });
      return;
    }

    resolve(request, {signedTransactions: transactionSignatures});
  };

  const signAndSend = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await signAndSendTransaction(wallet, connection, request);
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
        title="Sign and Send Transaction"
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
        positiveButtonText="Sign and Send"
        negativeButtonText="Reject"
        positiveOnClick={signAndSend}
        negativeOnClick={reject}
      />
      {loading && <Text>Loading...</Text>}
    </View>
  );
}

export default SignAndSendTransactionScreen;
```

### Sign and Send Screen

```tsx
import {Connection, Keypair} from '@solana/web3.js';
import {useState, useEffect} from 'react';
import {
  MWARequestFailReason,
  SignAndSendTransactionsRequest,
  resolve,
} from '../lib/mobile-wallet-adapter-walletlib/src';
import {
  SendTransactionsError,
  getIconFromIdentityUri,
  getSignedPayloads,
  sendSignedTransactions,
} from '../utils/dapp';
import {useWallet} from '../components/WalletProvider';
import {ClientTrust, VerificationState, verificationStatusText} from '../utils/clientTrust';
import {Text, View} from 'react-native';
import AppInfo from '../components/AppInfo';
import ButtonGroup from '../components/ButtonGroup';

export interface SignAndSendTransactionScreenProps {
  request: SignAndSendTransactionsRequest;
  clientTrust: ClientTrust;
}

function SignAndSendTransactionScreen(
  props: SignAndSendTransactionScreenProps,
) {
  const {request, clientTrust} = props;
  const {wallet, connection} = useWallet();
  const [loading, setLoading] = useState(false);
  const [verificationState, setVerificationState] = useState<
    VerificationState | undefined
  >(undefined);

  if (!wallet) {
    throw new Error('Wallet is null or undefined');
  }

  useEffect(() => {
    const verifyClient = async () => {
      const authScope = new TextDecoder().decode(request.authorizationScope);
      const verificationState = await clientTrust?.verifyAuthorizationSource(
        request.appIdentity?.identityUri,
      );
      setVerificationState(verificationState);

      const verifyClient = async () => {
        const verificationState = await clientTrust?.verifyAuthorizationSource(
          request.appIdentity?.identityUri,
        );
        setVerificationState(verificationState);
      };

      verifyClient();

      const verified = await clientTrust?.verifyPrivilegedMethodSource(
        authScope,
      );

      //soft decline, not great UX. Should tell the user that client was not verified
      if (!verified) {
        resolve(request, {
          failReason: MWARequestFailReason.UserDeclined,
        });
      }
    };

    verifyClient();
  }, []);

  const signAndSendTransaction = async (
    wallet: Keypair,
    connection: Connection,
    request: SignAndSendTransactionsRequest,
  ) => {
    const [valid, signedTransactions] = getSignedPayloads(
      request.__type,
      wallet,
      request.payloads,
    );

    if (valid.includes(false)) {
      resolve(request, {
        failReason: MWARequestFailReason.InvalidSignatures,
        valid,
      });
      return;
    }

    try {
      const sigs = await sendSignedTransactions(
        signedTransactions,
        request.minContextSlot ? request.minContextSlot : undefined,
        connection,
      );
      resolve(request, {signedTransactions: sigs});
    } catch (e) {
      console.log('Send error: ' + e);
      if (e instanceof SendTransactionsError) {
        resolve(request, {
          failReason: MWARequestFailReason.InvalidSignatures,
          valid: e.valid,
        });
      } else {
        throw e;
      }
    }
  };

  const signAndSend = async () => {
    if (loading) return;
    setLoading(true);
    signAndSendTransaction(wallet, connection, request).finally(() =>
      setLoading(false),
    );
  };

  const reject = () => {
    resolve(request, {failReason: MWARequestFailReason.UserDeclined});
  }

  return (
    <View>
      <AppInfo
        iconSource={getIconFromIdentityUri(request.appIdentity)}
        title="Sign and Send Transaction"
        appName={request.appIdentity?.identityName}
        uri={request.appIdentity?.identityUri}
        cluster={request.cluster}
        verificationText={verificationStatusText(verificationState)}
        scope={verificationState?.authorizationScope}
      />
      <Text>Payloads</Text>
      <Text>
        This request has {request.payloads.length}{' '}
        {request.payloads.length > 1 ? 'payloads' : 'payload'} to sign.
      </Text>
      <ButtonGroup
        positiveButtonText="Sign and Send"
        negativeButtonText="Reject"
        positiveOnClick={signAndSend}
        negativeOnClick={reject}
      />
      {loading && <Text>Loading...</Text>}
    </View>
  );
}

export default SignAndSendTransactionScreen;
```

Let's edit `MWAApp.tsx` and add our new screen to the switch statement:
```tsx
    switch (currentRequest?.__type) {
      case MWARequestType.AuthorizeDappRequest:
        return <AuthorizeDappRequestScreen request={currentRequest as AuthorizeDappRequest} />;
      case MWARequestType.SignAndSendTransactionsRequest:
          return <SignAndSendTransactionScreen request={currentRequest as SignAndSendTransactionsRequest} />;
      case MWARequestType.SignMessagesRequest:
      case MWARequestType.SignTransactionsRequest:
      default:
        return <Text>TODO Show screen for {currentRequest?.__type}</Text>;
    }
```

Lastly, build and run your wallet app. You should now be able to authorize you dapp and sign and send transactions!

Congratulations!

# Challenge
Now it's your turn, try and implement the last two functions, `SignMessagesRequest` and `SignTransactionsRequest`.

```tsx
      case MWARequestType.SignMessagesRequest:
      case MWARequestType.SignTransactionsRequest:
```