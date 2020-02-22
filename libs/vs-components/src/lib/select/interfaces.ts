import { merge, Subject } from "rxjs"
import { QueryList, TemplateRef } from "@angular/core"
import { ButtonLike } from "../button/button"

export interface SelectLike<T = any> extends ButtonLike {
    expanded: boolean
    selectedChange: Subject<T>
    selected?: T
    options?: QueryList<OptionLike<T>>
}
export abstract class SelectLike<T = any> {}

export interface OptionLike<T = any> extends ButtonLike {
    selected: boolean
    value?: T
    select: Subject<T>
}
export abstract class OptionLike<T = any> {}

export interface DropdownLike<T = void> {
    expanded: boolean
    template?: TemplateRef<T>
}
export abstract class DropdownLike<T = void> {}
