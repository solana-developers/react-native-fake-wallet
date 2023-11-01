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