import { ChangeDetectionStrategy, Component, HostBinding, Input, Output } from "@angular/core"
import { Connect, Effects, HostEmitter, HostRef } from "ng-effects"
import { OptionLike, PressEvent } from "../cdk/interfaces"
import { Button } from "../cdk/button"
import { Option } from "../cdk/option"

@Component({
    selector: "bde-option",
    template: `
        <ng-content></ng-content>
    `,
    styleUrls: ["./option.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        Effects,
        Option,
        Button,
        {
            provide: OptionLike,
            useExisting: HostRef,
        },
    ],
    host: {
        tabindex: "0",
    },
})
export class OptionComponent<T> implements OptionLike<T> {
    @Input()
    public value?: T

    @HostBinding("class.is-selected")
    @Input()
    public selected: boolean

    @Input()
    @HostBinding("class.is-disabled")
    public disabled: boolean

    @HostBinding("class.is-active")
    public active: boolean

    @HostBinding("class.is-focus")
    public focus: boolean

    @HostBinding("class.is-hover")
    public hover: boolean

    public innerHTML: string

    @Output()
    public readonly press: HostEmitter<PressEvent>

    constructor(connect: Connect) {
        this.selected = false
        this.active = false
        this.disabled = false
        this.focus = false
        this.hover = false
        this.value = undefined
        this.press = new HostEmitter<PressEvent>()
        this.innerHTML = ""

        connect(this)
    }
}
