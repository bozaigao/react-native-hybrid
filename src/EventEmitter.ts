import invariant from 'invariant';
import { NativeEventEmitter, Platform } from 'react-native';

const nativeEmitterSubscriptionKey = '@@nativeEmitterSubscription@@';

type NativeModule = {
  startObserving?: () => void;
  stopObserving?: () => void;
  addListener: (eventName: string) => void;
  removeListeners: (count: number) => void;
};

export type Subscription = {
  remove: () => void;
};

export class EventEmitter {
  _listenerCount = 0;
  _eventEmitter: NativeEventEmitter;

  constructor(nativeModule: NativeModule) {
    this._eventEmitter = new NativeEventEmitter(nativeModule as any);
  }

  addListener<T>(eventName: string, listener: (event: T) => void): Subscription {
    this._listenerCount++;
    const nativeEmitterSubscription = this._eventEmitter.addListener(eventName, listener);
    const subscription = {
      [nativeEmitterSubscriptionKey]: nativeEmitterSubscription,
      remove: () => {
        this.removeSubscription(subscription);
      },
    };
    return subscription;
  }

  removeAllListeners(eventName: string): void {
    const removedListenerCount = this._eventEmitter.listeners(eventName).length;
    this._eventEmitter.removeAllListeners(eventName);
    this._listenerCount -= removedListenerCount;
    invariant(
      this._listenerCount >= 0,
      `监听器数量不能为负数`
    );
  }

  removeSubscription(subscription: Subscription): void {
    const nativeEmitterSubscription = subscription[nativeEmitterSubscriptionKey];
    if (!nativeEmitterSubscription) {
      return;
    }

    this._eventEmitter.removeSubscription(nativeEmitterSubscription!);
    this._listenerCount--;

    // Ensure that the emitter's internal state remains correct even if `removeSubscription` is
    // called again with the same subscription
    delete subscription[nativeEmitterSubscriptionKey];

    // Release closed-over references to the emitter
    subscription.remove = () => {};
  }

  emit(eventName: string, ...params: any[]): void {
    this._eventEmitter.emit(eventName, ...params);
  }
}
