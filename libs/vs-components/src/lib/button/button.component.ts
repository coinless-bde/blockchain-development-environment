import { ChangeDetectionStrategy, Component, HostBinding, Input, Output } from "@angular/core"
import { Connect, Effects, HostEmitter } from "ng-effects"
import { Button } from "../cdk/button"
import { ButtonLike, PressEvent } from "../cdk/interfaces"

@Component({
    selector: "bde-button, [bde-button], [bde-flush-button]",
    template: `
        <ng-content></ng-content>
    `,
    styleUrls: ["./button.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [Effects, Button],
})
export class ButtonComponent implements ButtonLike {
    @Input()
    @HostBinding("attr.color")
    public color: "primary" | "secondary" | "none"

    @Input()
    @HostBinding("class.is-disabled")
    public disabled: boolean

    @HostBinding("class.is-active")
    public active: boolean

    @HostBinding("class.is-hover")
    public hover: boolean

    @HostBinding("class.is-focus")
    public focus: boolean

    @Output()
    public readonly press: HostEmitter<PressEvent>

    constructor(connect: Connect) {
        this.disabled = false
        this.hover = false
        this.focus = false
        this.active = false
        this.color = "none"
        this.press = new HostEmitter()
        connect(this)
    }
}
