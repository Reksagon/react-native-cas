import { NativeEventEmitter, NativeModules } from 'react-native';
const { MediationManagerModule } = NativeModules;
const emitter = new NativeEventEmitter(MediationManagerModule);
const subscriptions = {};
export const addEventListener = (event, handler) => {
    const subscription = emitter.addListener(event, handler);
    const current = subscriptions[event];
    if (current) {
        current.remove();
    }
    subscriptions[event] = subscription;
};
export const removeEventListener = (event) => {
    const current = subscriptions[event];
    if (current) {
        current.remove();
        delete subscriptions[event];
    }
};
