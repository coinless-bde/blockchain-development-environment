import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    Output,
} from "@angular/core"
import { Connect, effects } from "ng-effects"
import { Button, ButtonLike } from "./button"

@Component({
    selector: "bde-button, [bde-button]",
    template: `
        <ng-content></ng-content>
    `,
    styleUrls: ["./button.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [effects(Button)],
})
export class ButtonComponent implements ButtonLike {
    @Input()
    @HostBinding("attr.color")
    public color: "primary" | "secondary"

    @Input()
    public disabled: boolean

    @Output()
    public pressed: EventEmitter<MouseEvent>

    @HostBinding("class.is-hover")
    public hover: boolean

    @HostBinding("class.is-focus")
    public focus: boolean

    @HostBinding("class.is-active")
    public active: boolean

    constructor(connect: Connect) {
        this.disabled = false
        this.hover = false
        this.focus = false
        this.active = false
        this.color = "primary"
        this.pressed = new EventEmitter()
        connect(this)
    }
}
