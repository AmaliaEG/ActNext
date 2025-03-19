import { registerRootComponent } from 'expo';

import SettingsPage from './Settings';
import App from './App';
import nav from './Navigator';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(nav);
