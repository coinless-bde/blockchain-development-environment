import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    Output,
} from "@angular/core"
import { Connect, effects } from "ng-effects"
import { Button, Option, OptionLike, PressedEvent } from "@coinless/vs-components"

@Component({
    selector: "bde-editor-tab",
    template: `
        <ng-content></ng-content>
    `,
    styleUrls: ["./editor-tab.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        effects([Option, Button], { markDirty: true }),
        {
            provide: OptionLike,
            useExisting: EditorTabComponent,
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

    @Output()
    public pressed = new EventEmitter<PressedEvent>()

    @Output()
    public select = new EventEmitter<void>()

    constructor(connect: Connect) {
        connect(this)
    }
}
