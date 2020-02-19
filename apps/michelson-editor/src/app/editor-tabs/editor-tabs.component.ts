import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core"

@Component({
    selector: "bde-editor-tabs",
    template: `
        <button bde-button class="tab is-selected">
            <bde-codicon icon="list-selection"></bde-codicon>
            <span>Untitled-1</span>
            <bde-codicon icon="close"></bde-codicon>
        </button>
        <button bde-button class="tab">
            <bde-codicon icon="list-selection"></bde-codicon>
            <span>Untitled-2</span>
            <bde-codicon icon="close"></bde-codicon>
        </button>
        <button bde-button class="action">
            <bde-codicon icon="ellipsis"></bde-codicon>
        </button>
    `,
    styleUrls: ["./editor-tabs.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorTabsComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
