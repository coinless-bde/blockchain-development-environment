import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    ContentChildren,
    EventEmitter,
    HostBinding,
    Input,
    Output,
    QueryList,
    TemplateRef,
    ViewChild,
} from "@angular/core"
import { Connect, effects } from "ng-effects"
import { Select } from "./select"
import { DropdownLike, OptionLike, SelectLike } from "./interfaces"
import { Button } from "../button/button"
import { Dropdown } from "./dropdown"

@Component({
    selector: "bde-select",
    template: `
        <ng-template>
            <div class="options">
                <ng-content select="bde-option, [bdeOption]"></ng-content>
            </div>
        </ng-template>

        <ng-template #labelRef>
            <ng-container
                *ngTemplateOutlet="label; context: { $implicit: selected }"
            ></ng-container>
        </ng-template>

        <ng-template #placeholderRef>
            <bde-option>{{ placeholder }}</bde-option>
        </ng-template>

        <ng-container
            *ngIf="selected === undefined; then placeholderRef; else labelRef"
        ></ng-container>

        <bde-codicon
            class="chevron"
            [icon]="expanded ? 'chevron-up' : 'chevron-down'"
        ></bde-codicon>
    `,
    styleUrls: ["./select.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        effects([Select, Button, Dropdown]),
        {
            provide: SelectLike,
            useExisting: SelectComponent,
        },
    ],
    host: {
        tabindex: "0",
    },
})
export class SelectComponent<T> implements SelectLike<T>, DropdownLike {
    @Input()
    public selected?: T

    @Input()
    public disabled: boolean

    @Input()
    public placeholder: string

    @HostBinding("class.is-expanded")
    public expanded: boolean

    @HostBinding("class.is-active")
    public active: boolean

    @HostBinding("class.is-focus")
    public focus: boolean

    @HostBinding("class.is-hover")
    public hover: boolean

    @ContentChildren(OptionLike)
    public options?: QueryList<OptionLike<T>>

    @ViewChild(TemplateRef)
    public template?: TemplateRef<void>

    @ContentChild(TemplateRef)
    public label?: TemplateRef<any>

    @Output()
    public readonly selectedChange: EventEmitter<T>

    @Output()
    public readonly pressed: EventEmitter<any>

    constructor(connect: Connect) {
        this.disabled = false
        this.expanded = false
        this.options = undefined
        this.selected = undefined
        this.template = undefined
        this.label = undefined
        this.active = false
        this.focus = false
        this.hover = false
        this.placeholder = "select"
        this.selectedChange = new EventEmitter()
        this.pressed = new EventEmitter()

        connect(this)
    }
}
