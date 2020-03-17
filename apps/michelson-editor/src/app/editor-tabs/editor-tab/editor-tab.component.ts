import { ChangeDetectionStrategy, Component, HostBinding, Input, Output } from "@angular/core"
import { Connect, Effects, HostEmitter, HostRef } from "ng-effects"
import { Button, Option, OptionLike, PressEvent } from "@coinless/vs-components"

@Component({
    selector: "bde-editor-tab",
    template: `
        <ng-content></ng-content>
    `,
    styleUrls: ["./editor-tab.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        Effects, Option, Button,
        {
            provide: OptionLike,
            useExisting: HostRef,
        },
    ],
    host: {
        tabindex: "0",
    },
})
export class EditorTabComponent implements OptionLike {
    @Input()
    @HostBinding("class.is-selected")
    public selected = false

    @Input()
    public value = void 0

    @Input()
    @HostBinding("class.is-disabled")
    public disabled = false

    @HostBinding("class.is-active")
    public active = false

    @HostBinding("class.is-focus")
    public focus = false

    @HostBinding("class.is-hover")
    public hover = false

    public innerHTML = ""

    @Output()
    public press = new HostEmitter<PressEvent>()

    // tslint:disable-next-line:no-output-native
    @Output()
    public select = new HostEmitter()

    constructor(connect: Connect) {
        connect(this)
    }
}
