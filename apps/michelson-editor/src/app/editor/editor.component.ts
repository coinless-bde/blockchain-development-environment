import { ChangeDetectionStrategy, Component, HostBinding } from "@angular/core"
import { Editor, EditorLike } from "./editor"
import { Connect, Effects } from "ng-effects"

@Component({
    selector: "bde-editor",
    template: `
        <bde-editor-toolbar></bde-editor-toolbar>
        <bde-editor-menubar></bde-editor-menubar>
        <bde-editor-content></bde-editor-content>
        <bde-editor-preview></bde-editor-preview>
        <bde-editor-terminal></bde-editor-terminal>
    `,
    styleUrls: ["./editor.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [Effects, Editor],
})
export class EditorComponent implements EditorLike {
    @HostBinding("class.is-splitPane")
    public splitPane = true

    constructor(connect: Connect) {
        connect(this)
    }
}
