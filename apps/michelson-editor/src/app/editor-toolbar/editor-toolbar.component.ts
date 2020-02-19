import { Component, OnInit } from "@angular/core"

@Component({
    selector: "bde-editor-toolbar",
    template: `
        <bde-button bde-flush-button class="is-selected">
            <bde-codicon icon="files"></bde-codicon>
        </bde-button>
        <bde-button bde-flush-button>
            <bde-codicon icon="settings-gear"></bde-codicon>
        </bde-button>
    `,
    styleUrls: ["./editor-toolbar.component.css"],
})
export class EditorToolbarComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
