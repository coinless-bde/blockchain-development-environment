import {
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    ElementRef,
    HostBinding,
    Input,
    Output,
    QueryList,
    TemplateRef,
    ViewChild,
} from "@angular/core"
import { Connect, Effect, Effects, HostEmitter, HostRef, Observe } from "ng-effects"
import { OptionLike, SelectLike } from "../cdk/interfaces"
import { Button } from "../cdk/button"
import { Select } from "../cdk/select"
import { Dropdown } from "../cdk/dropdown"
import { Observable } from "rxjs"
import { distinctUntilChanged, map } from "rxjs/operators"

@Component({
    selector: "bde-select",
    template: `
        <bde-select-label [innerHTML]="label"></bde-select-label>

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
        Button,
        Dropdown,
        {
            provide: SelectLike,
            useExisting: HostRef,
        },
    ],
    host: {
        tabindex: "0",
    },
})
export class SelectComponent<T> implements SelectLike<T> {
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

    public label?: string

    public width: number

    @Output()
    public readonly valueChange: HostEmitter<T>

    @Output()
    public readonly press: HostEmitter<any>

    @Effect("width")
    setWidth(@Observe() observer: Observable<SelectComponent<any>>) {
        return observer.pipe(
            map(() => this.elementRef.nativeElement.offsetWidth),
            distinctUntilChanged()
        )
    }

    constructor(connect: Connect, public elementRef: ElementRef<HTMLElement>) {
        this.disabled = false
        this.expanded = false
        this.options = undefined
        this.value = undefined
        this.template = undefined
        this.label = undefined
        this.active = false
        this.focus = false
        this.hover = false
        this.width = 0
        this.placeholder = "Select"
        this.valueChange = new HostEmitter(true)
        this.press = new HostEmitter(true)

        connect(this)
    }
}
