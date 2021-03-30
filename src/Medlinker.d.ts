declare module 'med-rn-hybrid' {
    export const exc: (moduleName: string, methodName: string, options: Params) => Promise<Result>;
    export const createEventResumable: (callback: () => any) => EventResumable;
}
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

export interface EventResumable {
    exc: (moduleName: string, methodName: string, options: Params) => Promise<Result>;
    _addSubscription: () => any;
    _removeSubscription: () => any;
}