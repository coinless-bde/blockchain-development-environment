import { Directive, ElementRef, HostListener, Injectable, Input, Output, Renderer2 } from "@angular/core"
import { Connect, Effect, Effects, HostEmitter, State } from "ng-effects"
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms"
import { FormField } from "../cdk/form-field"
import { FormFieldLike } from "../cdk/interfaces"

export interface InputTextLike<T = unknown> extends ControlValueAccessor {
    disabled: boolean
    value?: T
    valueChange: HostEmitter<T>
}

@Injectable()
export class InputText {
    @Effect()
    writeValue(state: State<InputTextLike>) {
        return state.value.subscribe(value => {
            this.renderer.setProperty(this.elementRef.nativeElement, "value", value)
        })
    }

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {}
}

@Directive({
    selector: "input[bdeInput], textarea[bdeInput]",
    providers: [Effects, InputText, FormField, {
        provide: NG_VALUE_ACCESSOR,
        useExisting: InputDirective,
        multi: true
    }],
})
export class InputDirective<T> implements InputTextLike<T>, FormFieldLike<T> {
    @Input()
    disabled: boolean

    @Input()
    value?: T

    @Output()
    @HostListener("change", ["$event.target.value"])
    valueChange: HostEmitter<any>

    registerOnChange: HostEmitter<(value: any) => any>
    registerOnTouched: HostEmitter<Function>
    setDisabledState: HostEmitter<boolean>
    writeValue: HostEmitter<any>

    constructor(connect: Connect) {
        this.disabled = false
        this.value = undefined
        this.valueChange = new HostEmitter()
        this.registerOnChange = new HostEmitter()
        this.registerOnTouched = new HostEmitter()
        this.setDisabledState = new HostEmitter()
        this.writeValue = new HostEmitter()

        connect(this)
    }
}
