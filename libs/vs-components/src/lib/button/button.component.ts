import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    Output,
} from "@angular/core"
import { Connect, Effects, effects } from "ng-effects"
import { Button, ButtonLike, PressedEvent } from "../cdk/button"

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
    public readonly pressed: EventEmitter<PressedEvent>

    constructor(connect: Connect) {
        this.disabled = false
        this.hover = false
        this.focus = false
        this.active = false
        this.color = "none"
        this.pressed = new EventEmitter()
        connect(this)
    }
}
