import { HostEmitter, HostRef } from "ng-effects"
import { QueryList, TemplateRef } from "@angular/core"

export type PressEvent = MouseEvent | KeyboardEvent

export interface ButtonLike {
    hover: boolean
    focus: boolean
    active: boolean
    disabled: boolean
    press: HostEmitter<PressEvent>
}

export abstract class ButtonLike {}

export interface SelectLike<T = any> extends ButtonLike, DropdownLike {
    expanded: boolean
    valueChange: HostEmitter<T>
    value?: T
    label?: string
    placeholder?: string
    options?: QueryList<HostRef<OptionLike<T>>>
}

export abstract class SelectLike<T = any> {}

export interface OptionLike<T = any> extends ButtonLike {
    selected: boolean
    innerHTML: string
    value?: T
}

export abstract class OptionLike<T = any> {}

export interface DropdownLike<T = void> {
    expanded: boolean
    template?: TemplateRef<T>
}

export abstract class DropdownLike<T = void> {}
