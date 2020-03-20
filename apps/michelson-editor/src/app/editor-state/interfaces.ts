import { AbstractControl } from "@angular/forms"

export type Union<T extends any> = T[T extends Array<any> ? number : keyof T]
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((
    k: infer I,
    ) => void)
    ? I
    : never

export type Intersection<T extends any> = UnionToIntersection<Union<T>>
export type ExtractTypes<T> = Exclude<Union<Union<T>>, string>
