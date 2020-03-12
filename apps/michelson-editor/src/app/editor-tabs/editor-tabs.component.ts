import {
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    EventEmitter,
    Input,
    Output,
} from "@angular/core"
import { OptionLike, PressedEvent, Select, SelectLike } from "@coinless/vs-components"
import { Connect, Effects, effects } from "ng-effects"

@Component({
    selector: "bde-editor-tabs",
    template: `
        <ng-content></ng-content>
        <button bde-button class="action">
            <bde-codicon icon="ellipsis"></bde-codicon>
        </button>
    `,
    styleUrls: ["./editor-tabs.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        Effects, Select,
        {
            provide: SelectLike,
            useExisting: EditorTabsComponent,
        },
    ],
})
export class EditorTabsComponent implements SelectLike {
    public active = false
    public focus = false
    public hover = false
    public expanded = false

    @Input()
    public selected = undefined

    @Input()
    public disabled = false

    @ContentChildren(OptionLike)
    public options = undefined

    @Output()
    public selectedChange = new EventEmitter<any>()

    @Output()
    public pressed = new EventEmitter<PressedEvent>()

    constructor(connect: Connect) {
        connect(this)
    }
}
