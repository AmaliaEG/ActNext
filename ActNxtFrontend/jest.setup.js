import '@testing-library/jest-native/extend-expect';

jest.mock(
    'react-native/Libraries/Animated/NativeAnimatedHelper',
    () => ({}),
    { virtual: true }
);

jest.mock('react-native-gesture-handler', () => {
    const { View } = require('react-native');

    return {
        GestureHandlerRootView: View,
        PanGestureHandler: View,
        TapGestureHandler: View,

        State: {},
        Directions: {},

        default: { install: jest.fn() },
    };
});

import { NativeModules } from 'react-native';
NativeModules.RNGestureHandlerModule = {
    install: jest.fn(),

    attachGestureHandler: jest.fn(),
    createGestureHandler: jest.fn(),
    updateGestureHandler: jest.fn(),
    dropGestureHandler: jest.fn(),
};