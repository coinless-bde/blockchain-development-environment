import { Effect, State } from "ng-effects"
import { filter, withLatestFrom } from "rxjs/operators"
import { ElementRef, Injectable, Renderer2 } from "@angular/core"
import { FormFieldLike } from "./interfaces"
import { FocusMonitor, FocusOrigin } from "@angular/cdk/a11y"
import { Observable } from "rxjs"

@Injectable()
export class FormField {
    private focusOrigin: Observable<FocusOrigin>

    @Effect("value")
    writeValue(state: State<FormFieldLike>) {
        return state.writeValue
    }

    @Effect("disabled")
    setDisabled(state: State<FormFieldLike>) {
        return state.setDisabledState
    }

    @Effect()
    setTouched(state: State<FormFieldLike>) {
        return this.focusOrigin.pipe(
            filter(focusOrigin => focusOrigin === null),
            withLatestFrom(state.registerOnTouched, (event, touched) => touched(event))
        )
    }

    @Effect()
    onChange(state: State<FormFieldLike>) {
        return state.valueChange.pipe(
            withLatestFrom(state.registerOnChange, (value, onChange) => onChange(value))
        )
    }

    constructor(elementRef: ElementRef, renderer: Renderer2, focusMonitor: FocusMonitor) {
        this.focusOrigin = focusMonitor.monitor(elementRef, true)
    }
}
