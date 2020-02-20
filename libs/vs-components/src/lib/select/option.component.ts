import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    Output,
} from "@angular/core"
import { Connect, effects } from "ng-effects"
import { OptionLike } from "./interfaces"
import { Button, PressedEvent } from "../button/button"
import { Option } from "./option"

@Component({
    selector: "bde-option, [bdeOption]",
    template: `
        <ng-content></ng-content>
    `,
    styleUrls: ["./option.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        effects([Option, Button], { markDirty: true }),
        {
            provide: OptionLike,
            useExisting: OptionComponent,
        },
    ],
    host: {
        tabindex: "0",
    },
})
export class OptionComponent<T> implements OptionLike<T> {
    @HostBinding("class.is-selected")
    @Input()
    public selected: boolean

    @Input()
    public value?: T

    @HostBinding("class.is-active")
    public active: boolean

    @Input()
    @HostBinding("class.is-disabled")
    public disabled: boolean

    @HostBinding("class.is-focus")
    public focus: boolean

    @HostBinding("class.is-hover")
    public hover: boolean

    @Output()
    public readonly pressed: EventEmitter<PressedEvent>

    // tslint:disable-next-line:no-output-native
    @Output()
    public readonly select: EventEmitter<T>

    constructor(connect: Connect) {
        this.selected = false
        this.active = false
        this.disabled = false
        this.focus = false
        this.hover = false
        this.value = undefined
        this.select = new EventEmitter()
        this.pressed = new EventEmitter()
        connect(this)
    }
}
