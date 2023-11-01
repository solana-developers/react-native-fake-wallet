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