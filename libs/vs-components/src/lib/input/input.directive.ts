import { Directive, ElementRef, HostListener, Injectable, Input, Output, Renderer2 } from "@angular/core"
import { Connect, Effect, Effects, HostEmitter, State } from "ng-effects"
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms"

export interface InputTextLike extends ControlValueAccessor {
    disabled: boolean
    value?: any
    valueChange: HostEmitter<any>
}

@Injectable()
export class InputText {
    constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

    @Effect()
    writeValue(state: State<InputTextLike>) {
        return state.writeValue.subscribe(value => {
            this.renderer.setProperty(this.elementRef.nativeElement, "value", value)
        })
    }

    @Effect("valueChange")
    valueChange(state: State<InputTextLike>) {
        return state.value
    }
}

@Directive({
    selector: "input[bdeInput], textarea[bdeInput]",
    providers: [Effects, InputText, {
        provide: NG_VALUE_ACCESSOR,
        useExisting: InputDirective,
        multi: true
    }],
})
export class InputDirective implements InputTextLike {
    @Input()
    disabled: boolean

    @Input()
    value?: any

    @Output()
    @HostListener("change")
    valueChange: HostEmitter<any>

    @HostListener("blur")
    touch: HostEmitter<void>

    writeValue: HostEmitter<any>

    registerOnChange(fn: any): void {
        this.valueChange.subscribe(fn)
    }

    registerOnTouched(fn: any): void {
        this.touch.subscribe(fn)
    }

    setDisabledState(disabled: boolean): void {
        this.disabled = disabled
    }

    constructor(connect: Connect) {
        this.disabled = false
        this.value = undefined
        this.touch = new HostEmitter()
        this.valueChange = new HostEmitter()
        this.writeValue = new HostEmitter()

        connect(this)
    }
}
