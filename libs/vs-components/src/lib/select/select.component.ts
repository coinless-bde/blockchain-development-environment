import {
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    ElementRef,
    HostBinding, Injectable,
    Input,
    Output,
    QueryList, Renderer2,
    TemplateRef,
    ViewChild,
} from "@angular/core"
import { Connect, Effect, Effects, HostEmitter, HostRef, Observe, State } from "ng-effects"
import { FormFieldLike, OptionLike, SelectLike } from "../cdk/interfaces"
import { Button } from "../cdk/button"
import { Select } from "../cdk/select"
import { Dropdown } from "../cdk/dropdown"
import { combineLatest, Observable } from "rxjs"
import { distinctUntilChanged, map, switchMap, withLatestFrom } from "rxjs/operators"
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms"
import { EventMap, fromEvents } from "../utils"
import { FormField } from "../cdk/form-field"

export const selectEvents = {
    blur: FocusEvent
}

@Injectable()
export class SelectEffects {
    @Effect("width")
    setWidth(@Observe() observer: Observable<SelectComponent>) {
        return observer.pipe(
            map(() => this.elementRef.nativeElement.offsetWidth),
            distinctUntilChanged()
        )
    }

    constructor(private elementRef: ElementRef) {}
}

@Component({
    selector: "bde-select",
    template: `
        <bde-select-label class="label" [innerHTML]="label"></bde-select-label>

        <bde-codicon
            class="chevron"
            [icon]="expanded ? 'chevron-up' : 'chevron-down'"
        ></bde-codicon>

        <div class="options" *templateRef [style.width.px]="width">
            <ng-content select="bde-option, bdeOption]"></ng-content>
        </div>
    `,
    styleUrls: ["./select.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        Effects,
        Select,
        SelectEffects,
        Button,
        Dropdown,
        FormField,
        {
            provide: SelectLike,
            useExisting: HostRef,
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SelectComponent,
            multi: true
        }
    ],
    host: {
        tabindex: "0",
    },
})
export class SelectComponent<T = any> implements SelectLike<T>, FormFieldLike<T> {
    @Input()
    public value?: T

    @Input()
    public placeholder: string

    @Input()
    @HostBinding("class.is-disabled")
    public disabled: boolean

    @HostBinding("class.is-expanded")
    public expanded: boolean

    @HostBinding("class.is-active")
    public active: boolean

    @HostBinding("class.is-focus")
    public focus: boolean

    @HostBinding("class.is-hover")
    public hover: boolean

    @ContentChildren(OptionLike)
    public options?: QueryList<HostRef<OptionLike<T>>>

    @ViewChild(TemplateRef)
    public template?: TemplateRef<void>

    @Output()
    public readonly valueChange: HostEmitter<T>

    @Output()
    public readonly press: HostEmitter<any>

    public label: string
    public width: number
    public registerOnChange: HostEmitter<(value: any) => any>
    public registerOnTouched: HostEmitter<Function>
    public setDisabledState: HostEmitter<boolean>
    public writeValue: HostEmitter<any>

    constructor(connect: Connect) {
        this.disabled = false
        this.expanded = false
        this.options = undefined
        this.value = undefined
        this.template = undefined
        this.label = ""
        this.active = false
        this.focus = false
        this.hover = false
        this.width = 0
        this.placeholder = "Select"
        this.valueChange = new HostEmitter(true)
        this.press = new HostEmitter(true)
        this.registerOnChange = new HostEmitter()
        this.registerOnTouched = new HostEmitter()
        this.setDisabledState = new HostEmitter()
        this.writeValue = new HostEmitter()

        connect(this)
    }
}
