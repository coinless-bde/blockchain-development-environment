import { EventConstructor, select, Store } from "./store"
import { Inject, Injectable, InjectionToken, Injector, OnDestroy, Type } from "@angular/core"
import { Subscription } from "rxjs"
import { AbstractControl } from "@angular/forms"
import { StorePlugin } from "./interfaces"

export interface FormModel {
    model: AbstractControl
}

export interface FormEntry<T extends EventConstructor<any> = any> {
    [name: string]: {
        model: Type<FormModel>
        dispatch: T
        reducer?: (state: any, action: any) => any
    }
}

@Injectable({ providedIn: "root" })
export class FormPlugin implements StorePlugin, OnDestroy {
    private forms: FormEntry
    private injector: Injector
    private sub: Subscription

    constructor(@Inject(REACTIVE_FORM) forms: FormEntry[], injector: Injector) {
        this.injector = injector
        this.sub = new Subscription()
        this.forms = forms.reduce((acc, value) => Object.assign(acc, value))
    }

    public connect(store: Store<any>) {
        const { forms, injector, sub } = this
        for (const [ name, factory ] of Object.entries(forms)) {
            const model = injector.get<FormModel>(factory.model).model

            if (factory.reducer) {
                store.addReducer(name, factory.reducer)
            }

            sub.add(
                model.valueChanges.subscribe(value => {
                    store.dispatch(new factory.dispatch(value))
                })
            )

            sub.add(
                store.pipe(
                    select(state => state[name])
                ).subscribe(value => {
                    model.patchValue(value, { emitEvent: false })
                })
            )
        }
        return sub
    }

    ngOnDestroy() {
        this.sub.unsubscribe()
    }
}

export const REACTIVE_FORM = new InjectionToken("REACTIVE_FORM")

export function registerForms(useValue: FormEntry) {
    return {
        provide: REACTIVE_FORM,
        useValue,
        multi: true
    }
}
