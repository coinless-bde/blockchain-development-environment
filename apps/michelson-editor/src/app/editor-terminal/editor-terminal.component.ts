import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core"

@Component({
    selector: "bde-editor-terminal",
    template: `
        <div class="header">
            <div class="tabs">
                <button bde-flush-button class="tab">Problems</button>
                <button bde-flush-button class="tab">Terminal</button>
            </div>
            <div class="actions">
                <button bde-flush-button class="action">
                    <bde-codicon icon="chevron-up"></bde-codicon>
                </button>
                <button bde-flush-button class="action">
                    <bde-codicon icon="close"></bde-codicon>
                </button>
            </div>
        </div>
        <div class="output">
            <code class="line">No problems detected.</code>
        </div>
    `,
    styleUrls: ["./editor-terminal.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorTerminalComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
