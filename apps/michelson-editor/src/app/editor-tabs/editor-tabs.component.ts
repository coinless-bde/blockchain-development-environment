import { ChangeDetectionStrategy, Component, ContentChildren, Input, Output } from "@angular/core"
import { OptionLike, PressEvent, Select, SelectLike } from "@coinless/vs-components"
import { Connect, Effects, HostEmitter, HostRef } from "ng-effects"

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
            useExisting: HostRef,
        },
    ],
})
export class EditorTabsComponent implements SelectLike {
    public active = false
    public focus = false
    public hover = false
    public expanded = false
    public placeholder = undefined
    public label = ""

    @Input()
    public value = undefined

    @Input()
    public disabled = false

    @ContentChildren(OptionLike)
    public options = undefined

    @Output()
    public valueChange = new HostEmitter<any>()

    @Output()
    public press = new HostEmitter<PressEvent>()

    constructor(connect: Connect) {
        connect(this)
    }
}
