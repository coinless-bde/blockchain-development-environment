import { Store } from "./store"

export declare type JsonPrimitive = string | number | boolean | null
export declare type JsonValue = JsonPrimitive | JsonArray | JsonObject | undefined
export interface JsonArray extends Array<JsonValue> {}
export interface JsonObject {
    [key: string]: JsonValue
}

export abstract class Command<T> {
    abstract type: string
    constructor(payload: T) {
        if (typeof payload === "object") {
            Object.assign(this, payload)
        }
    }
}

export abstract class Event<T> {
    abstract type: string
    constructor(payload: T) {
        if (typeof payload === "object") {
            Object.assign(this, payload)
        }
    }
}

export interface StorePlugin {
    connect(store: Store<any>): any
}
