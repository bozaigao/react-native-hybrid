import { NativeModules } from 'react-native';
import { EventEmitter } from './EventEmitter';
import uuidv4 from 'uuid/v4';
const hybridProtocol = 'medmedlinker_rn_hybrid://';

export interface Result {
  code: number;
  message: string;
  data: any;
}

export interface Params {
  moduleName: string;
  methodName: string;
  //callbackId
  callback?: string;
  params?: any;
}

/**
 * 生成native能识别的hybrid协议链接
 * 协议://模块名.方法名?callback=结果回调id&params=JSON.stringify(参数)
 */
const genHybridUrl = function (params: Params) {
  let paramStr = '',
    url = hybridProtocol + `${params.moduleName}.${params.methodName}`,
    flag = '?';
  if (params.callback) {
    flag = '&';
    url += '?callback=' + params.callback;
  }
  if (params.params) {
    paramStr = typeof params.params == 'object' ? JSON.stringify(params.params) : params.params;
    url += flag + 'param=' + encodeURIComponent(paramStr);
  }
  
  return url;
};

export async function exc(moduleName: string, methodName: string, options: Params): Promise<Result> {
  
  return await NativeModules.Medlinker.exc(genHybridUrl({ moduleName, methodName, params: options }));
}

export function createEventResumable(
  callback: any,
): EventResumable {
  return new EventResumable(callback);
}

export class EventResumable {
  _uuid: string;
  _options: Params;
  _callback?: (result: any) => {};
  _subscription?: any;
  _emitter: any;

  constructor(
    callback?: any,
  ) {
    this._uuid = uuidv4();
    this._callback = callback;
    this._subscription = null;
    this._emitter = new EventEmitter(NativeModules.Medlinker);
  }

  async exc(moduleName: string, methodName: string, options: Params): Promise<Result> {
    this._addSubscription();
    return await await NativeModules.Medlinker.exc(genHybridUrl({ moduleName, methodName, callback: this._uuid, params: options, }));
  }

  _addSubscription(): void {
    if (this._subscription) {
      return;
    }
    this._subscription = this._emitter.addListener(
      '__event__',
      (event: any) => {
        
        if (event.callback === this._uuid) {
          const callback = this._callback;
          if (callback) {
            callback(event);
          }
        }
      }
    );
  }

  _removeSubscription(): void {
    if (!this._subscription) {
      return;
    }
    this._emitter.removeSubscription(this._subscription);
    this._subscription = null;
  }
}
