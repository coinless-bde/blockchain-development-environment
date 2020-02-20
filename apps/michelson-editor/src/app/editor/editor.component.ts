import { ChangeDetectionStrategy, Component } from "@angular/core"

@Component({
    selector: "bde-editor",
    template: `
        <bde-editor-menubar></bde-editor-menubar>
        <bde-editor-toolbar></bde-editor-toolbar>
        <bde-editor-sidebar></bde-editor-sidebar>
        <bde-editor-content></bde-editor-content>
        <bde-editor-preview></bde-editor-preview>
        <bde-editor-terminal></bde-editor-terminal>
    `,
    styleUrls: ["./editor.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent {
    constructor() {}
}
